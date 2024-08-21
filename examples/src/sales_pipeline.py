import enum

from asyncio import sleep
from datetime import datetime
from typing import Optional

import numpy as np
import pandas as pd

from apscheduler.triggers.interval import IntervalTrigger
from dateutil import tz
from pydantic import BaseModel, Field

from plombery import register_pipeline, task, Trigger, get_logger


class StoreLocations(enum.Enum):
    Brussels = "BRU"
    Milan = "MIL"
    Rio = "RIO"


class InputParams(BaseModel):
    """展示 Plombery 中所有可用的输入类型"""

    pick_a_number: int
    iterations: int = Field(ge=0, le=10, default=5, description="迭代多少次数?")
    notes: Optional[str] = None
    store: StoreLocations = StoreLocations.Milan
    some_flag: bool = True


@task
async def get_sales_data(params: InputParams) -> pd.DataFrame:
    """按商店和 SKU 获取原始的销售数据"""

    logger = get_logger()

    logger.info("Pipeline called with some_value=%d", params.pick_a_number)

    for i in range(params.iterations):
        await sleep(1 + np.random.random() / 2)
        logger.debug("Iteration %d", i)

    logger.warning("Nothing serious but you should fix this")

    data = pd.DataFrame(
        {
            "price": np.random.randint(1, 1000, 50),
            "store_id": np.random.randint(1, 10, 50),
            "date": datetime.today(),
            "sku": np.random.randint(1, 50, 50),
        }
    )

    if np.random.random() > 0.75:
        raise ValueError("I decided to fail :P")

    return data


register_pipeline(
    id="sales_pipeline",
    description="""一个没什么用处的管道""",
    tasks=[get_sales_data],
    triggers=[
        Trigger(
            id="daily",
            name="每日",
            description="每天运行管道",
            params=InputParams(pick_a_number=2, store=StoreLocations.Milan),
            schedule=IntervalTrigger(
                days=1,
                start_date=datetime(
                    2023, 1, 1, 22, 30, tzinfo=tz.gettz("Europe/Brussels")
                ),
            ),
        )
    ],
    params=InputParams,
)
