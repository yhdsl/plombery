管道是一个按照顺序执行的任务列表。

只需要使用 `register_pipeline` 便可以声明一个管道，
其中只有 `id` 和 `tasks` 两个参数是必需的:

```py
from plombery import register_pipeline, task

class InputParams(BaseModel):
  some_value: int

@task
def get_sales_data():
  pass

register_pipeline(
    # (必填) 识别一个管道的唯一 ID
    id="sales_pipeline_2345",
    # (必填) 待有序执行的任务列表
    tasks=[get_sales_data],
    # 可以通过输入参数对管道进行配置
    params=InputParams,
    # 名称是可选的，如果未提供，将自动使用 id 生成
    name="销售管道",
    description="""一个没什么用处的管道""",
    # 带有调度的触发器
    triggers=[
        Trigger(
            id="daily",
            name="每日",
            description="每天运行管道",
            # 仅作用于该触发器的输入参数
            params=InputParams(some_value=2),
            schedule=IntervalTrigger(
                days=1,
            ),
        )
    ],
)
```

## 输入参数

如果在声明管道是使用 `params` 参数设置输入，那么该管道可进行配置:

```py
register_pipeline(
  # ...
  params=InputParams
)
```

其中 `InputParams` 是一个 [Pydantic 模型](https://docs.pydantic.dev/latest/usage/models/):

```py
class InputParams(BaseModel):
  some_value: int
```

如果管道拥可配置，那么在手动点击运行按钮时，
会弹出一个带有表单的对话框让你自定义输入的参数:

<figure markdown>
  ![手动运行时输入自定义参数](assets/images/run-pipeline-dialog.png)
  <figcaption>手动运行时输入自定义参数</figcaption>
</figure>

由于在声明管道输入参数时使用了 Pydantic 的 `BaseModel`，
因此对话框中的表单会自动创建。

当你使用 HTTP 做为触发器的时候，也可以配置管道，
只需要在 HTTP 请求中将参数做为 JSON 发送即可。
