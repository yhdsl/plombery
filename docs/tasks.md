任务是一个使用 `task` 装饰器装饰过的普通的 Python 函数，
任务也可以使用 `async` 标记为协程，其中 Plumbery 会自动处理好一切:

```py
@task
def sync_task():
  pass

@task
async def async_task():
  pass
```

然后按预定的顺序将其在 `register_pipeline` 函数中进行声明:

```py
register_pipeline(
  tasks=[sync_task, async_task]
)
```

## 输入参数

如果管道中声明了输入参数:

```py
class InputParams(BaseModel):
  some_value: int

register_pipeline(
  # ...
  params=InputParams
)
```

那么任务函数将使用 `params` 参数接受这些管道输入:

```py
@task
async def my_task(params: InputParams):
  result = params.some_value + 8
```

## 输出数据

在 Plombery 内，管道按声明时的顺序执行任务函数，
并且任务的输出将做为位置参数传递给后面的任务函数:

```py
@task
def task_1():
  return 1

@task
def task_2(from_1):
  # from_1 = 1
  return from_1 + 1

@task
def task_3(from_1, from_2):
  # from_1 = 1
  # from_2 = 2
  return from_1 + from_2
```

## 记录日志

Plombery 将自动收集管道的日志内容，并显示在 Web UI 中:

<figure markdown>
  ![管道运行日志](assets/images/run-logs.png)
  <figcaption>管道运行日志</figcaption>
</figure>

要使用该功能，你需要使用 Plombery 的 `get_logger` 函数做为日志记录器:

```py
from plombery import get_logger

@task
def my_task():
  logger = get_logger()
  logger.debug("你好世界!")
```

!!! warning

    `get_logger` 是一个仅能在任务函数内部使用的特殊函数:
    不要在其他的地方使用它，这不会有任何意义!
    ```py
    # ❌ 不要这么做
    logger = get_logger()
    def my_task():
      logger.debug("你好世界!")
    ```
