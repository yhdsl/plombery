import { Flex, Text } from '@tremor/react'
import { Link } from 'react-router-dom'
import React from 'react'

import { Pipeline, PipelineRun, Trigger } from '../types'

interface Props {
  pipeline: Pipeline
  trigger?: Trigger
  run?: PipelineRun
  className?: string
}

const Separator = () => <Text>/</Text>

const Breadcrumbs: React.FC<Props> = ({
  pipeline,
  trigger,
  run,
  className,
}) => {
  if (run && !trigger) {
    throw new Error()
  }

  return (
    <Flex className={`gap-x-2 justify-start flex-wrap ${className || ''}`}>
      <Text>
        <Link to="/">管道</Link>
      </Text>
      <Separator />
      <Text>
        {trigger ? (
          <Link to={`/pipelines/${pipeline.id}`}>{pipeline.name}</Link>
        ) : (
          pipeline.name
        )}
      </Text>

      {trigger && (
        <>
          <Separator />
          <Text>触发器</Text>
          <Separator />
          <Text>
            {run ? (
              <Link to={`/pipelines/${pipeline.id}/triggers/${trigger.id}`}>
                {trigger.name}
              </Link>
            ) : (
              trigger.name
            )}
          </Text>
        </>
      )}

      {run && trigger && (
        <>
          <Separator />
          <Text>运行</Text>
          <Separator />
          <Text>#{run.id}</Text>
        </>
      )}
    </Flex>
  )
}

export default Breadcrumbs
