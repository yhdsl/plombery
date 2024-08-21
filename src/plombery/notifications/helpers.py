from typing import Dict

from plombery.schemas import PipelineRunStatus


_PIPELINE_STATUS_TO_VERB: Dict[PipelineRunStatus, str] = {
    PipelineRunStatus.RUNNING: "已开始运行",
    PipelineRunStatus.COMPLETED: "已成功完成",
    PipelineRunStatus.FAILED: "运行失败",
    PipelineRunStatus.CANCELLED: "被取消运行",
}


def get_pipeline_status_verb(run_status: PipelineRunStatus) -> str:
    return _PIPELINE_STATUS_TO_VERB[run_status]
