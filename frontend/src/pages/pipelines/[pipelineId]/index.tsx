import { useQuery } from '@tanstack/react-query'
import {
  Card,
  Title,
  Col,
  Text,
  ListItem,
  Flex,
  Icon,
  List,
  Bold,
  Grid,
  TextInput,
} from '@tremor/react'
import { useParams } from 'react-router-dom'
import React from 'react'
import {
  ArrowTopRightOnSquareIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

import CopyButton from '@/components/CopyButton'
import Breadcrumbs from '@/components/Breadcrumbs'
import RunsDurationChart from '@/components/RunsDurationChart'
import RunsList from '@/components/RunsList'
import RunsStatusChart from '@/components/RunsStatusChart'
import { getPipeline, getPipelineRunUrl, listRuns } from '@/repository'
import ManualRunDialog from '@/components/ManualRunDialog'
import TriggersList from '@/components/TriggersList'
import PageLayout from '@/components/PageLayout'

const PipelineView: React.FC = () => {
  const urlParams = useParams()
  const pipelineId = urlParams.pipelineId as string

  const pipelineQuery = useQuery(getPipeline(pipelineId))
  const runsQuery = useQuery(listRuns(pipelineId))

  const CopyUrlButton = () => (
    <CopyButton content={getPipelineRunUrl(pipelineId)} className="ml-2.5" />
  )

  if (pipelineQuery.isLoading)
    return <div>加载中...</div>

  if (pipelineQuery.isError)
    return <div>出现了一个错误</div>

  const pipeline = pipelineQuery.data

  return (
    <PageLayout
      header={
        <div>
          <Flex className="items-start">
            <Flex className="justify-start items-start md:items-center flex-col md:flex-row min-w-0">
              <Title className="truncate max-w-full">
                管道 "{pipeline.name}"
              </Title>
              {pipeline.description && (
                <Text className="truncate max-w-full">
                  <span className="hidden md:inline mx-2">&middot;</span>
                  {pipeline.description}
                </Text>
              )}
            </Flex>

            <ManualRunDialog pipeline={pipeline} />
          </Flex>

          <Breadcrumbs pipeline={pipeline} className="mt-4" />
        </div>
      }
    >
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
        <Card className="flex flex-col h-full">
          <Title>任务信息</Title>

          <List>
            {pipeline.tasks.map((task) => (
              <ListItem key={task.id}>
                <div>
                  <Text>
                    <Bold>{task.name}</Bold>
                  </Text>
                  {task.description && (
                    <Text className="truncate">{task.description}</Text>
                  )}
                </div>
              </ListItem>
            ))}

            {pipeline.tasks.length === 0 && (
              <div className="mt-4">
                <Text className="text-center italic">
                 该管道未定义任何任务，无法运行
                </Text>

                <div className="text-center mt-2 text-sm">
                  <a
                    href="https://yhdsl.github.io/plombery/tasks/"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-indigo-50/30 hover:bg-indigo-50 dark:bg-indigo-950/50 dark:hover:bg-indigo-950 rounded-sm px-4 py-2 text-indigo-500 transition-colors duration-300 cursor-pointer no-underline"
                  >
                    如何创建任务
                    <Icon
                      icon={ArrowTopRightOnSquareIcon}
                      size="sm"
                      className="p-0"
                      color="indigo"
                    />
                  </a>
                </div>
              </div>
            )}
          </List>

          <div style={{ flexGrow: 1 }} />

          <Flex className="gap-8">
            <Flex className="justify-start w-auto flex-shrink-0">
              <Text>运行 URL</Text>

              <Icon
                size="sm"
                color="slate"
                icon={QuestionMarkCircleIcon}
                tooltip="以编程的方式使用 HTTP POST 请求来运行管道的 URL"
              />
            </Flex>

            <TextInput
              title={getPipelineRunUrl(pipelineId)}
              value={getPipelineRunUrl(pipelineId)}
              readOnly
              icon={CopyUrlButton}
              className="flex-grow"
            />
          </Flex>
        </Card>

        <RunsStatusChart
          subject="Pipeline"
          query={runsQuery}
        />

        <RunsDurationChart query={runsQuery} />
      </Grid>

      <Grid
        numItems={1}
        numItemsSm={1}
        numItemsMd={1}
        numItemsLg={2}
        className="gap-6 mt-6"
      >
        <Col>
          <TriggersList pipeline={pipeline} />
        </Col>

        <Col>
          <RunsList
            query={runsQuery}
            pipelineId={pipelineId}
          />
        </Col>
      </Grid>
    </PageLayout>
  )
}

export default PipelineView
