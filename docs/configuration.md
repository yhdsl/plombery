Plombery 可以通过环境变量、YAML 配置文件或者混合两者 (推荐) 进行配置。

!!! info "为什么建议使用混合配置?"

    项目所需的完整配置可能非常大，因此完全使用环境变量进行配置将难以维护，
    但一般配置文件都会与项目文件一同储存，对于某些机密配置，
    因此仍需要使用环境变量。

在项目的根目录中创建一个名为 `plombery.config.yaml` 的配置文件
(或者命名为 `plombery.config.yml` 如果你喜欢)，并在内设置你希望的选择，
建议将其提交至 git 内。

```yaml title="plombery.config.yaml"
frontend_url: https://pipelines.example.com

auth:
  client_id: $GOOGLE_CLIENT_ID
  client_secret: $GOOGLE_CLIENT_SECRET
  server_metadata_url: https://accounts.google.com/.well-known/openid-configuration

notifications:
  - pipeline_status:
      - failed
    channels:
      - $GMAIL_ACCOUNT
      - $MSTEAMS_WEBHOOK
```

此外将机密设置储存在 `.env` 文件、shell 或托管环境的环境变量中。


!!! tip

    默认情况下，Plombery 将加载任何在项目根目录下找到的任何 `.env` 文件。

!!! Warning

    不要将 `.env` 提交到 git 上，其中包含有机密设置!

```shell title=".env"
# Auth
GOOGLE_CLIENT_ID="ABC123"
GOOGLE_CLIENT_SECRET="DEF456"

# Notifications
GMAIL_ACCOUNT=mailto://myuser:mypass@gmail.com
MSTEAMS_WEBHOOK=msteams://TokenA/TokenB/TokenC/
```

## 软件配置

!!! tip

    如果你仅在本地运行 Plombery，大多数情况下并不需要修改这些配置

### `database_url`

Sqlite 数据库的 URI 或地址，默认为 `sqlite:///./plombery.db`。

### `allowed_origins`

配置允许的 CORS 标头 `Access-Control-Allow-Origin`，
默认为 `*` 以允许所有来源。

**如果将 Plombery 用于生产，请进行必要的修改**

### `frontend_url`

前端 URL 默认与后端相同，
如果前端在不同的 URL 上提供帮助 (例如正在进行前端开发)，
请进行相应的修改。

### `run_data_storage`

指定储存运行结果的文件夹，默认为项目根目录下的 `.data` 文件夹。

!!! warning

    这是中文版本单独添加的配置项，
    如果你使用的是原版 Plombery，
    这将不会有任何效果。

## 通知配置

Plombery 可以在管道运行结束后根据运行状态 (成功、失败等等) 发送通知。

通知配置在 YAML 中使用包含若干 [`NotificationRule`](#notificationrule) 的列表进行配置:

```yaml title="plombery.config.yaml"
notifications:
  # 仅在管道运行失败后发送通知
  - pipeline_status:
      - failed
    channels:
      # 将其发送至我的邮箱 (从我的邮箱内发送)
      # 最好将其移动至 env 内
      - mailto://myuser:mypass@gmail.com
  # 仅在管道运行成功或被取消后发送通知
  - pipeline_status:
      - completed
      - cancelled
    channels:
      # 将其发送至 MS Teams 频道内
      # 最好将其移动至 env 内
      - msteams://mychanneltoken
```

### `NotificationRule`

定义何时通知以及向谁发送通知的规则。

#### `pipeline_status`

包含若干个管道运行状态的列表:

  * `completed`: 成功
  * `failed`: 失败
  * `cancelled`: 取消

#### `channels`

包含若干个通知对象的列表。

每个 `channels` 都必需是合法的 *Apprise* URI 字符串，例如:

* **电子邮件** mailto://myuser:mypass@gmail.com
* **MS Teams** msteams://TokenA/TokenB/TokenC/
* **AWS SES** ses://user@domain/AccessKeyID/AccessSecretKey/RegionName/email1/

Plombery 在后端使用 [Apprise](https://github.com/caronc/apprise) 进行通知，
这是一个可以向众多通知服务发送通知的库，
因此请查看其文档以获取全部可用的通知对象，以及对应的Apprise URI。

## 身份验证配置

Plombery 有一个内置且开箱即用的基于 OAuth 的身份验证系统，
因此你可以接入企业身份验证，或者 Google、Github等身份验证服务。

仅需简单的配置便可以启用基于 OAuth 的身份验证系统。

!!! info "好消息"

    该身份验证系统基于 [Authlib](https://authlib.org/)

### `AuthSettings`

可配置的选项如下:

#### `client_id`

OAuth 客户端的 ID

#### `client_secret`

OAuth 客户端的机密 (secret)

#### `server_metadata_url`

这是一个特殊的 URL，其中包含 OAuth 服务提供商给出的特定元数据，
如果服务提供商未给出，或者你不知道该如何填写，
那么你还需要指定其它与 URL 有关的配置: `access_token_url`,
`authorize_url` 和 `jwks_uri`。

这里有一个元数据为 well known 的 URL :

| Provider | URL |
| -------- | --- |
| Google | https://accounts.google.com/.well-known/openid-configuration |

#### `access_token_url`

无描述

#### `authorize_url`

无描述

#### `jwks_url`

无描述

#### `client_kwargs`

在身份验证过程中传递给 OAuth 身份验证系统的额外参数，
以下为一个指定验证范围的例子:

```yaml
auth:
  client_kwargs:
    scope: openid email profile
```

#### `secret_key`

后端中间件所使用的密钥，
尽管有默认值，但用于生产时建议设置为一个更安全的值
