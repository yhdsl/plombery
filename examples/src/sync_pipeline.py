import time

from pydantic import BaseModel

from plombery import register_pipeline, task, get_logger


class InputParams(BaseModel):
    what: str


@task
def sync_task():
    """
    这个任务不是异步的，
    但不会阻塞程序
    """
    get_logger().debug("Im going to sleep for 10secs")
    time.sleep(10)


register_pipeline(
    id="sync_pipeline",
    description="包含同步任务的管道",
    tasks=[sync_task],
    params=InputParams,
)
