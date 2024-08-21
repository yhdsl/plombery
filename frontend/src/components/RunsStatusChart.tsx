import { UseQueryResult } from '@tanstack/react-query'
import { Card, Text, Flex, Tracker, Italic, Metric } from '@tremor/react'
import { HTTPError } from 'ky'

import { PipelineRun } from '../types'
import {formatDate, STATUS_COLORS, translatePipelineRunStatus} from '../utils'
import ErrorAlert from './queries/Error'
import { MetricLoader, TextLoader, TrackerLoader } from './queries/Loaders'

interface Props {
  query: UseQueryResult<PipelineRun[], HTTPError>
  subject: 'Trigger' | 'Pipeline'
}

const Loader = ({ subject }: { subject: string }) => (
  <Card>
    <Text>成功运行</Text>

    <MetricLoader />

    <Text className="mt-4">{subject} 健康监控</Text>

    <TrackerLoader />

    <Flex className="mt-2">
      <TextLoader className="w-20" />
      <TextLoader className="w-20" />
    </Flex>
  </Card>
)

const RunsStatusChart: React.FC<Props> = ({ query, subject }) => {
  if (query.isLoading || query.isFetching) {
    return <Loader subject={subject} />
  }

  if (query.isError) {
    return (
      <Card>
        <ErrorAlert query={query} />
      </Card>
    )
  }

  const runs = [...query.data].reverse()
  const successfulRuns = runs.filter((run) => run.status === 'completed')

  const successPercentage = (successfulRuns.length / runs.length) * 100 || 0

  const fromDate = runs[0]?.start_time
  const toDate = runs[runs.length - 1]?.start_time

  return (
    <Card>
      <Flex className="items-start">
        <Text>健康状态</Text>
      </Flex>

      <Flex className="justify-start items-baseline space-x-3 truncate">
        <Metric>
          {successPercentage.toFixed(1)} <span className="text-lg">%</span>
        </Metric>
      </Flex>

      {runs.length ? (
        <>
          <Flex className="mt-4">
            <Text>{subject.replace("Trigger", "触发器").replace("Pipeline", "管道")}健康监控</Text>
          </Flex>
          <Tracker
            className="mt-2"
            data={runs.map((run) => ({
              key: run.id,
              color: STATUS_COLORS[run.status],
              tooltip: `#${run.id} ${translatePipelineRunStatus(run.status)}`,
            }))}
          />
        </>
      ) : (
        <Text className="text-center mt-8">
          <Italic>该{subject.replace("Trigger", "触发器").replace("Pipeline", "管道")}尚未运行过</Italic>
        </Text>
      )}
      <Flex className="mt-2">
        <Text>{fromDate && formatDate(fromDate)}</Text>
        <Text>{toDate && formatDate(toDate)}</Text>
      </Flex>
    </Card>
  )
}

export default RunsStatusChart
