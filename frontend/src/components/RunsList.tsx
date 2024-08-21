import { UseQueryResult, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
} from '@tremor/react'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { zhCN } from "date-fns/locale"
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HTTPError } from 'ky'

import { useSocket } from '@/socket'
import { PipelineRun, WebSocketMessage } from '@/types'
import { formatDateTime } from '@/utils'
import StatusBadge from './StatusBadge'
import Timer from './Timer'
import ErrorAlert from './queries/Error'
import { TableLoader } from './queries/Loaders'

interface Props {
  pipelineId?: string
  query: UseQueryResult<PipelineRun[], HTTPError>
  triggerId?: string
}

const RunsList: React.FC<Props> = ({ pipelineId, query, triggerId }) => {
  const [runs, setRuns] = useState<PipelineRun[]>(query.data || [])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { lastMessage } = useSocket('run-update')

  const onWsMessage = useCallback(
    (message: WebSocketMessage) => {
      const { data, type } = message

      data.run.start_time = new Date(data.run.start_time)
      data.run.trigger_id = data.trigger

      if (data.run.status === 'running') {
        setRuns([data.run, ...runs])
      } else {
        let oldRuns = [...runs]
        const i = oldRuns.findIndex((run) => run.id === data.run.id)

        if (i >= 0) {
          oldRuns[i] = data.run
        } else {
          oldRuns = [data.run, ...oldRuns]
        }

        setRuns(oldRuns)

        queryClient.invalidateQueries({
          queryKey: ['runs', pipelineId, triggerId],
        })
      }
    },
    [pipelineId, queryClient, runs, triggerId]
  )

  useEffect(() => {
    if (lastMessage) {
      onWsMessage(lastMessage)
    }
  }, [lastMessage])

  useEffect(() => {
    if (query.data?.length) {
      setRuns(query.data)
    }
  }, [query.data])

  const numberOfColumns = 4 + Number(!!pipelineId) + Number(!!triggerId)

  return (
    <Card>
      <Title>运行状态</Title>

      <Table className="overflow-auto max-h-[50vh]">
        <TableHead className="sticky top-0 bg-tremor-background dark:bg-dark-tremor-background shadow dark:shadow-tremor-dropdown z-10">
          <TableRow>
            <TableHeaderCell className="text-right">#</TableHeaderCell>
            <TableHeaderCell>状态</TableHeaderCell>
            {!pipelineId && <TableHeaderCell>管道ID</TableHeaderCell>}
            {!triggerId && <TableHeaderCell>触发器ID</TableHeaderCell>}
            <TableHeaderCell>启动时间</TableHeaderCell>
            <TableHeaderCell className="text-right">运行时长</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow
              key={run.id}
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-tremor-background-subtle transition-colors"
              onClick={() =>
                navigate(
                  `/pipelines/${run.pipeline_id}/triggers/${run.trigger_id}/runs/${run.id}`
                )
              }
            >
              <TableCell className="text-right">{run.id}</TableCell>
              <TableCell>
                <StatusBadge status={run.status} />
              </TableCell>
              {!pipelineId && (
                <TableCell>
                  <Link
                    to={`/pipelines/${run.pipeline_id}`}
                    className="link--arrow"
                    title="单击查看管道信息"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {run.pipeline_id}
                  </Link>
                </TableCell>
              )}
              {!triggerId && (
                <TableCell>
                  <Link
                    to={`/pipelines/${run.pipeline_id}/triggers/${run.trigger_id}`}
                    className="link--arrow"
                    title="单击查看触发器信息"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {run.trigger_id}
                  </Link>
                </TableCell>
              )}
              <TableCell title={formatDateTime(run.start_time, false)}>
                <Text>
                  {differenceInDays(new Date(), run.start_time) <= 1
                    ? formatDistanceToNow(run.start_time, {
                        addSuffix: true,
                        includeSeconds: true,
                        locale: zhCN,
                      })
                    : formatDateTime(run.start_time)}
                </Text>
              </TableCell>
              <TableCell className="text-right">
                {run.status !== 'running' ? (
                  (run.duration / 1000).toFixed(2)
                ) : (
                  <Timer startTime={run.start_time} />
                )}{' '}
                s
              </TableCell>
            </TableRow>
          ))}

          {(query.isFetching || query.isLoading) && (
            <TableLoader columns={numberOfColumns} />
          )}

          {query.isError && (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <ErrorAlert query={query} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

export default RunsList
