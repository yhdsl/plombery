触发器是管道运行的入口，可以是一个调度计划，或者是一个外部事件，
并且可以在声明管道时为触发器添加输入参数。

## 管道触发器

当声明一个管道时，可以不指定触发器。系统会默认添加一个*管道触发器*，
以保证无需额外的工作便可运行管道。

该管道触发器会在 Web UI 上生成一个运行按钮，
以及一个 HTTP 接口以运行管道。

### HTTP 触发器

HTTP 触发器允许你通过 HTTP 使用 `POST` 请求来运行管道。
触发器的 URL 可以在管道详情页中找到:

<figure markdown>
  ![HTTP 触发器](assets/images/pipeline-page-tasks-card.png)
  <figcaption>通过 HTTP 使用 POST 请求来运行管道的 URL</figcaption>
</figure>

### 手动触发器

![手动运行按钮](assets/images/run-pipeline-button.png){align=right}

Web UI 上有一个*手动运行*按钮 (其基于 HTTP 触发器)。
你可以在主页或管道详情页中找到它。

### 输入参数

如果管道声明了输入参数，那么在点击手动运行按钮之后，
将会显示一个对话框来让你自定义输入参数:

<figure markdown>
  ![带有输入参数的手动运行按钮](assets/images/run-pipeline-dialog.png)
  <figcaption>带有输入参数的手动运行按钮</figcaption>
</figure>

由于在声明管道输入参数时使用了 Pydantic 的 `BaseModel`，
因此对话框中的表单会自动创建。

当你使用 HTTP 做为触发器的时候，也可以配置管道，
只需要在 HTTP 请求中将参数做为 JSON 发送即可。


## 调度

在使用 Plombery 时，你迫切希望可能是有计划的运行管道。
这非常简单，只需要在声明管道时设置若干个触发器即可，(注意 `triggers` 参数必需是一个列表，即使只有一个触发器)。
并通过 `schedule` 参数设置调度:

```py hl_lines="1 7-15"
from apscheduler.triggers.interval import IntervalTrigger
from plombery import register_pipeline, Trigger

register_pipeline(
    id="sales_pipeline",
    tasks=[get_sales_data],
    triggers=[
        Trigger(
            id="daily",
            description="每天运行管道",
            schedule=IntervalTrigger(
                days=1,
            ),
        ),
    ],
)
```

`schedule` 参数接受任何 APS 触发器，目前有如下的调度/APS 触发器可用:

* [`CronTrigger`](https://apscheduler.readthedocs.io/en/3.x/modules/triggers/cron.html#module-apscheduler.triggers.cron){target=_blank}
* [`DateTrigger`](https://apscheduler.readthedocs.io/en/3.x/modules/triggers/date.html#module-apscheduler.triggers.date){target=_blank}
* [`IntervalTrigger`](https://apscheduler.readthedocs.io/en/3.x/modules/triggers/interval.html#module-apscheduler.triggers.interval){target=_blank}
* [`Combining`](https://apscheduler.readthedocs.io/en/3.x/modules/triggers/combining.html#module-apscheduler.triggers.combining){target=_blank}

## 带有输入参数的触发器

向管道添加触发器不仅可以实现调度的目的，
还可以提供若干*备用的*带有自定义输入参数的运行入口。

如果一个管道声明了输入参数，那么触发器可以为其提供自定义输入:

```py hl_lines="3-5 13 21-24"
from pydantic import BaseModel

class InputParams(BaseModel):
    past_days: int
    convert_currency: bool = False

def get_sales_data(params: InputParams):
    print(params.past_days)

register_pipeline(
    id="sales_pipeline",
    tasks=[get_sales_data],
    params=InputParams,
    triggers=[
        Trigger(
            id="daily",
            description="获取过去 5 天的销售数据 (美元)",
            schedule=IntervalTrigger(
                days=1,
            ),
            params={
                "past_days": 5,
                "convert_currency": True,
            },
        ),
    ],
)
```

在触发器信息页中，可以看到触发器的相关参数，
包括 URL 和自定义的输入参数。

<figure markdown>
  ![触发器信息](assets/images/trigger-page-trigger-card.png)
  <figcaption>在触发器信息页中的触发器参数</figcaption>
</figure>


注意，运行触发器 (手动运行或使用 HTTP) 时无法单独提供自定义参数，
请确保在声明管道时为 `params` 参数提供的有效的内容。

![手动运行触发器](assets/images/run-trigger-button.png){align=right}

确实，如果点击*运行触发器*按钮，
不会弹出一个对话框以确认运行或自定义输入参数。


!!! info "为什么会这样?"

    这是一个设计选择。根据定义，触发器是一个具有明确定义的管道入口，
    无需额外的干预。即通过调度、还是使用手动运行按钮，
    均需要运行完全相同的触发器，
    因此触发器必需是*不可变的*。

因此，例如使用先前的代码，无法使用如下的代码声明触发器，
因为触发器的自定义参数中缺少输入参数 `InputParams` 中的必填项 `past_days`:

```py
Trigger(
    # ...
    params={
        "convert_currency": True,
    }
)
```

但你可以省略其它非必填项:

```py
Trigger(
    # ...
    params={
        "past_days": 3,
    }
)
```

如果你有一个特别复杂的输入参数，那么声明多个不带调度的触发器非常有用，
这可以为不熟悉代码但又希望手动运行管道的用户提供若干清晰的运行入口。
