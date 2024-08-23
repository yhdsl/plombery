import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Badge,
  Color,
  Flex,
  Grid,
  Icon,
  MultiSelect,
  MultiSelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react'
import { BarsArrowDownIcon } from '@heroicons/react/24/outline'
import { createRef, useCallback, useEffect, useState } from 'react'

import { getLogs } from '@/repository'
import { socket } from '@/socket'
import { LogEntry, LogLevel, Pipeline, PipelineRun } from '@/types'
import { formatNumber, formatTime, getTasksColors } from '@/utils'
import TracebackInfoDialog from './TracebackInfoDialog'

interface Props {
  pipeline: Pipeline
  run: PipelineRun
}

/**
 * If the user scrolls to the bottom and arrives
 * that close to the bottom then the scroll lock is
 * activated.
 */
const SCROLL_LOCK_THRESHOLD = 30

const LOG_LEVELS_COLORS: Record<LogLevel, Color> = {
  DEBUG: 'slate',
  INFO: 'sky',
  WARNING: 'amber',
  ERROR: 'rose',
}

interface FilterType {
  levels: string[]
  tasks: string[]
}

const LogViewer: React.FC<Props> = ({ pipeline, run }) => {
  const [filter, setFilter] = useState<FilterType>({ levels: [], tasks: [] })
  const [scrollToBottom, setScrollToBottom] = useState(true)
  const queryClient = useQueryClient()

  const tableRef = createRef<HTMLTableElement>()

  const query = useQuery(getLogs(run.id))

  const onWsMessage = useCallback(
    (message: string) => {
      queryClient.setQueryData<LogEntry[]>(['logs', run.id], (oldLogs = []) => {
        const log: LogEntry = JSON.parse(message)
        log.id = oldLogs.length
        log.timestamp = new Date(log.timestamp)
        return [...oldLogs, log]
      })
    },
    [run.id]
  )

  const onMouseScroll = useCallback(
    (e: Event) => {
      const element = tableRef.current?.parentElement
      if (!element) {
        return
      }

      const event = e as WheelEvent

      // Add deltaY as the scrollTop doesn't include it at this point
      let scrollBottom = Math.max(
        element.scrollTop + element.clientHeight + event.deltaY,
        0
      )

      scrollBottom = Math.min(scrollBottom, element.scrollHeight)

      const userScrolledToBottom =
        element.scrollHeight - scrollBottom < SCROLL_LOCK_THRESHOLD

      setScrollToBottom(userScrolledToBottom)
    },
    [tableRef]
  )

  useEffect(() => {
    tableRef.current?.parentElement?.addEventListener('wheel', onMouseScroll)

    return () => {
      tableRef.current?.parentElement?.removeEventListener(
        'wheel',
        onMouseScroll
      )
    }
  }, [tableRef])

  useEffect(() => {
    if (scrollToBottom) {
      const element = tableRef.current?.parentElement
      element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
    }
  })

  useEffect(() => {
    socket.on(`logs.${run.id}`, onWsMessage)

    return () => {
      socket.off(`logs.${run.id}`, onWsMessage)
    }
  }, [])

  const onFilterChange = useCallback((newFilter: Partial<FilterType>) => {
    setFilter((currentFilter) => ({ ...currentFilter, ...newFilter }))
  }, [])

  if (query.isPending) {
    return <div>加载中...</div>
  }

  if (query.isError) {
    return <div>加载日志时出错</div>
  }

  const logs = query.data.filter((log) => {
    return (
      (filter.levels.length === 0 || filter.levels.includes(log.level)) &&
      (filter.tasks.length === 0 || filter.tasks.includes(log.task))
    )
  })

  const tasksColors = getTasksColors(pipeline.tasks)

  const hasLiveLogs = ['running', 'pending'].includes(run.status)

  return (
    <Flex flexDirection="col" alignItems="stretch" style={{ maxHeight: 600 }}>
      <Grid numItemsMd={3} className="gap-6 items-start">
        <div>
          <Text>任务</Text>

          <MultiSelect
            className="mt-1 z-20"
            onValueChange={(tasks) => {
              onFilterChange({ tasks })
            }}
            placeholder="选择..."
            placeholderSearch="搜索"
          >
            {pipeline.tasks.map((task) => (
              <MultiSelectItem value={task.id} key={task.id}>
                {task.name}
              </MultiSelectItem>
            ))}
          </MultiSelect>
        </div>

        <div>
          <Text>日志等级</Text>

          <MultiSelect
            className="mt-1 z-20"
            onValueChange={(levels) => {
              onFilterChange({ levels })
            }}
            placeholder="选择..."
            placeholderSearch="搜索"
          >
            {Object.keys(LOG_LEVELS_COLORS).map((level) => (
              <MultiSelectItem value={level} key={level} />
            ))}
          </MultiSelect>
        </div>

        {hasLiveLogs && (
          <Flex justifyContent="end" className="order-first md:order-last">
            <Icon
              icon={BarsArrowDownIcon}
              variant="light"
              color={scrollToBottom ? 'indigo' : 'gray'}
              tooltip="自动滚动至最新的日志。单击进行切换"
              className="mr-4"
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setScrollToBottom(!scrollToBottom)
              }}
            />

            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>

            <Text className="ml-2 opacity-80">实时日志</Text>
          </Flex>
        )}
      </Grid>

      <Table className="mt-6 flex-grow" ref={tableRef}>
        <TableHead className="sticky top-0 bg-tremor-background dark:bg-dark-tremor-background shadow dark:shadow-tremor-dropdown z-9">
          <TableRow>
            <TableHeaderCell>时间</TableHeaderCell>
            <TableHeaderCell>等级</TableHeaderCell>
            <TableHeaderCell>任务</TableHeaderCell>
            <TableHeaderCell>消息</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, i) => {
            const duration =
              i !== 0
                ? log.timestamp.getTime() - logs[i - 1].timestamp.getTime()
                : -1

            return (
              <TableRow key={log.id}>
                <TableCell>
                  <Text className="font-mono text-xs">
                    <span title={formatTime(log.timestamp, false)}>
                      {formatTime(log.timestamp)}
                    </span>

                    {duration >= 0 && (
                      <span className="text-slate-400 ml-2">
                        +{formatNumber(duration)} ms
                      </span>
                    )}
                  </Text>
                </TableCell>
                <TableCell>
                  <Badge size="xs" color={LOG_LEVELS_COLORS[log.level]}>
                    {log.level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Flex>
                    <div
                      className={`h-2 w-2 mr-2 rounded-full ${
                        tasksColors[log.task]
                      }`}
                    />
                    {log.task}
                  </Flex>
                </TableCell>
                <TableCell className="w-full">
                  <Text>{log.message}</Text>

                  {log.exc_info && <TracebackInfoDialog logEntry={log} />}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Flex>
  )
}

export default LogViewer
