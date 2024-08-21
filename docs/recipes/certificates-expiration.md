!!! example
    可以在[此处](https://github.com/yhdsl/plombery/blob/main/examples/src/ssl_certificates.py)找到完整的代码

手动管理 SSL 证书的到期日期可能是一项具有挑战性且容易出错的任务，
尤其是在需要检查大量域名的环境中。

未能及时更新 SSL 证书可能会导致服务意外中断以及安全漏洞。
为了解决此问题，可以使用 Plombery 来自动监控 SSL 证书的到期日期
，并在证书即将到期时收到通知。

<figure markdown>
  ![检查 SSL 证书的管道](/plombery/assets/images/recipes/ssl_check.png)
  <figcaption>检查 SSL 证书的管道</figcaption>
</figure>

<figure markdown>
  ![带有日志的运行状态页面](/plombery/assets/images/recipes/ssl_check_run.png)
  <figcaption>带有日志的运行状态页面</figcaption>
</figure>

你也可以通过手动运行的方式动态的检查 SSL 证书:

<figure markdown>
  ![手动运行](/plombery/assets/images/recipes/ssl_check_manual.png)
  <figcaption>手动运行</figcaption>
</figure>

## 如何实现

定义一个包含待检查域名的列表，
并单独为每个域名创建一个触发器，
这样一旦运行失败， 你就能快速定位至故障的域名:

```py
--8<-- "examples/src/ssl_certificates.py:14:17"

--8<-- "examples/src/ssl_certificates.py:78:97"
```

该示例中的管道只有一个任务，
但你可以将额外检查 SSL 证书做为附加的任务:

```py
--8<-- "examples/src/ssl_certificates.py:57:75"
```
