import React, { Suspense } from 'react'
import { Button, Text } from '@tremor/react'
import { useQuery } from '@tanstack/react-query'

import { getRunData } from '@/repository'
import Dialog from './Dialog'

interface Props {
  runId: number
  taskId: string
  open: boolean
  onClose: () => any
}

const HotTable = React.lazy(() => import('./HandsonTable.js'))

const DataViewerDialog: React.FC<Props> = ({
  runId,
  taskId,
  open,
  onClose,
}) => {
  const query = useQuery({
    ...getRunData(runId, taskId),
    enabled: open,
  })

  return (
    <>
      <Dialog
        title={taskId}
        subtitle="任务数据"
        isOpen={open}
        footer={
          <Button variant="secondary" color="indigo" onClick={() => onClose()}>
            关闭
          </Button>
        }
        onClose={onClose}
      >
        {!query.isLoading && !query.isError && (
          <Suspense fallback={<div>加载中...</div>}>
            <HotTable
              data={query.data}
              rowHeaders={true}
              colHeaders={Object.keys(query.data[0])}
              height="70vh"
              width="700px"
              licenseKey="non-commercial-and-evaluation"
            />
          </Suspense>
        )}

        {query.isError &&
          (query.error.response.status === 404 ? (
            <Text>该任务无数据输出</Text>
          ) : (
            <Text color="rose">
              获取数据时出错: {query.error.message}
            </Text>
          ))}
      </Dialog>
    </>
  )
}

export default DataViewerDialog
