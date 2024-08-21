import { AreaChart, Card, Flex, Metric, Text } from '@tremor/react'
import { UseQueryResult } from '@tanstack/react-query'
import { HTTPError } from 'ky'

import { PipelineRun } from '../types'
import ErrorAlert from './queries/Error'
import { ChartLoader, MetricLoader } from './queries/Loaders'
import { CustomTooltipProps } from "@tremor/react/dist/components/chart-elements/common/CustomTooltipProps"

interface Props {
  query: UseQueryResult<PipelineRun[], HTTPError>
}

const dataFormatter = (number: number) => (number / 1000).toFixed(1) + ' s'

const Loader = () => (
  <Card>
    <Text>运行时长 (平均)</Text>

    <MetricLoader />

    <ChartLoader className="mt-6" />
  </Card>
)

const RunsDurationChart: React.FC<Props> = ({ query }) => {
  if (query.isFetching || query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return (
      <Card>
        <ErrorAlert query={query} />
      </Card>
    )
  }

  const successfulRuns = query.data
    .filter((run) => run.status === 'completed')
    .reverse()

  const avgDuration =
    successfulRuns.reduce((total, current) => total + current.duration, 0) /
      successfulRuns.length || 0

  const customTooltip = (props: CustomTooltipProps) => {
    const { payload, active, label } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown dark:bg-dark-tremor-background dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card dark:border-dark-tremor-brand">
        {payload.map((category, idx) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="font-medium text-tremor-content">#{label} 运行时长</p>
              <p className="font-medium text-tremor-content-emphasis">
                  {dataFormatter(Number(category.value))}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <Flex className="items-start">
        <Text>运行时长 (平均)</Text>
      </Flex>

      <Flex className="justify-start items-baseline space-x-3 truncate">
        <Metric>{dataFormatter(avgDuration)}</Metric>
      </Flex>

      <AreaChart
        data={successfulRuns}
        index="id"
        categories={['duration']}
        colors={['indigo']}
        valueFormatter={dataFormatter}
        yAxisWidth={40}
        showLegend={false}
        autoMinValue
        className="mt-6 h-28"
        noDataText="无数据"
        customTooltip={customTooltip}
      />
    </Card>
  )
}

export default RunsDurationChart
