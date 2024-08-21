import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  StopCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { Color } from '@tremor/react'
import { format, addMinutes } from 'date-fns'
import { zhCN } from "date-fns/locale"

import { PipelineRunStatus, Task } from './types'
import { RunningIcon } from './components/RunningIcon'

type ExtendedStatus = PipelineRunStatus | 'warning'

export const STATUS_COLORS: Record<ExtendedStatus, Color> = {
  pending: 'slate',
  completed: 'emerald',
  failed: 'rose',
  cancelled: 'slate',
  running: 'blue',
  warning: 'amber',
}

export const STATUS_ICONS: Record<ExtendedStatus, React.ElementType<any>> = {
  pending: NoSymbolIcon,
  completed: CheckCircleIcon,
  failed: XCircleIcon,
  cancelled: StopCircleIcon,
  running: RunningIcon,
  warning: ExclamationTriangleIcon,
}

export const TASKS_COLORS: Color[] = [
  'cyan',
  'violet',
  'pink',
  'emerald',
  'orange',
  'stone',
  'fuchsia',
]

export const getTasksColors = (tasks: Task[]) => {
  return Object.fromEntries(
    tasks.map((task, i) => [
      task.id,
      `bg-${TASKS_COLORS[i % TASKS_COLORS.length]}-500`,
    ])
  )
}

export const formatDateTime = (date: Date, utc: boolean = false): string => {
  if (utc) {
    const finalDate = addMinutes(date, date.getTimezoneOffset())
    return format(finalDate, 'yyyy年MMMdd日 HH:mm:ss', { locale: zhCN }) + ' (UTC)'
  } else {
    return format(date, 'yyyy年MMMdd日 HH:mm:ss (OOOO)', { locale: zhCN })
  }
}

export const formatTime = (date: Date, utc: boolean = false) => {
  if (utc) {
    const finalDate = addMinutes(date, date.getTimezoneOffset())
    return format(finalDate, 'HH:mm:ss.SSS', { locale: zhCN }) + ' (UTC)'
  } else {
    return format(date, 'HH:mm:ss.SSS', { locale: zhCN })
  }
}

export const formatDate = (date: Date) => format(date, 'yyyy年MMMdd日', { locale: zhCN })

const numberFormatter = new Intl.NumberFormat()

export const formatNumber = (value: number) => numberFormatter.format(value)

export const translatePipelineRunStatus = (
    value: PipelineRunStatus | ExtendedStatus
) => value.replace('pending', '等待中...').replace('running', '运行中...').replace('completed', '成功').replace('failed', '失败').replace('cancelled', '取消').replace('warning', '警告')
