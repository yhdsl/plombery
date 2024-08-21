# 创建你的第一个管道

在你的项目根目录内创建一个新文件夹，
并在其中新建一个 `app.py` 文件 (或其他你喜欢的名称)，
注意该文件必需位于最顶层的包内。

你的文件夹结构应该类似如下:

``` { .sh .no-copy }
.
├─ .venv/ # 虚拟环境文件夹
└─ src/
   ├─ __init__.py # 一个用于声明 Python 包的空文件
   └─ app.py # 项目入口
```

## 词汇表

在开始之前，先让我们了解一些名词，以免造成困扰！

* **任务**: 执行某项工作的 Python 函数，它是构建管道的基础部分
* **管道**: 一个或多个*工作*的有序序列，管道可以通过调度或手动的方式运行
* **触发器**: 是管道运行的入口，一个触发器可以是调度、webhook 或 Web UI 上的按钮
* **管道运行状态**: (有时简称为*运行状态*) 是一个管道运行的结果

## 一个简单的管道

### 创建任务

*任务*是 Plombery 中的基础部分，它只是一个执行简单操作的 Python 函数，
例如利用 HTTP API 下载一些数据，或者在 DB 上进行查询等。

!!! info

    注意是如何使用 `@task` 装饰器声明任务的

```py title="src/app.py"
from datetime import datetime
from random import randint

from apscheduler.triggers.interval import IntervalTrigger
from plombery import task, get_logger, Trigger, register_pipeline


@task
async def fetch_raw_sales_data():
    """获取当天最新的 50 条销售记录"""

    # 使用 Plombery 的 logger 储存你的日志
    # 并可在 Web UI 中实时查看
    logger = get_logger()

    logger.debug("获取销售记录...")

    sales = [
        {
            "price": randint(1, 1000),
            "store_id": randint(1, 10),
            "date": datetime.today(),
            "sku": randint(1, 50),
        }
        for _ in range(50)
    ]

    logger.info("已获取 %s 行销售记录", len(sales))

    # 返回任务运行结果进行储存
    # 并可在 Web UI 中实时查看
    # 如果随后还有其他的任务
    # 那么该输出将会被传递
    return sales
```

### 创建管道

*管道*包含了一系列的任务，以及若干个触发器，
在你的 `app.py` 中添加如下内容:

```py title="src/app.py"
register_pipeline(
    id="sales_pipeline",
    description="汇总全国所有门店的销售活动",
    tasks = [fetch_raw_sales_data],
    triggers = [
        Trigger(
            id="daily",
            name="每日",
            description="每天运行管道",
            schedule=IntervalTrigger(days=1),
        ),
    ],
)
```

最后通过添加以下内容启动程序:

```py title="src/app.py"
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("plombery:get_app", reload=True, factory=True)
```

现在你的 `src/app.py` 应该看起来如下:

??? Example "单击查看 src/app.py 文件的完整内容"

    ```py title="src/app.py"
    from datetime import datetime
    from random import randint

    from apscheduler.triggers.interval import IntervalTrigger
    from plombery import task, get_logger, Trigger, register_pipeline


    @task
    async def fetch_raw_sales_data():
        """获取当天最新的 50 条销售记录"""

        # 使用 Plombery 的 logger 储存你的日志
        # 并可在 Web UI 中实时查看
        logger = get_logger()

        logger.debug("获取销售记录...")

        sales = [
            {
                "price": randint(1, 1000),
                "store_id": randint(1, 10),
                "date": datetime.today(),
                "sku": randint(1, 50),
            }
            for _ in range(50)
        ]

        logger.info("已获取 %s 行销售记录", len(sales))
    
        # 返回任务运行结果进行储存
        # 并可在 Web UI 中实时查看
        # 如果随后还有其他的任务
        # 那么该输出将会被传递
        return sales


    register_pipeline(
        id="sales_pipeline",
        description="汇总全国所有门店的销售活动",
        tasks = [fetch_raw_sales_data],
        triggers = [
            Trigger(
                id="daily",
                name="每日",
                description="每天运行管道",
                schedule=IntervalTrigger(days=1),
            ),
        ],
    )

    if __name__ == "__main__":
        import uvicorn

        uvicorn.run("plombery:get_app", reload=True, factory=True)

    ```

### 运行程序

Plombery 是基于 FastAPI 开发的， 
因此你可以使用 `uvicorn` (如本例所示) 或其他的 ASGI web 服务器以将其做为一个普通的 FastAPI
程序运行

安装 `uvicorn` 并运行程序:

```sh
pip install uvicorn
python src/app.py
```

接下来访问 [http://localhost:8000](http://localhost:8000){target=_blank} 并尽情享受吧!
