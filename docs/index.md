---
hide:
  - toc
---

# Plombery

一个 ⚖️ 开源 (MIT协议) 的 Python 任务调度程序，带有简洁易用的 Web UI 和 REST API。

如果你想重复执行 Python 脚本并监控运行状态，那么这便是适合你的工具！

## 功能
* ⏰ 基于 [APScheduler](https://github.com/agronholm/apscheduler) 的任务调度功能 (支持 Interval， Cron 和 Date 触发器)
* 💻 内置 Web UI, 无需额外使用 HTML/JS/CSS 进行开发
* 👩‍💻🐍 仅用纯 Python 语法定义管道和任务
* 🎛️ 可以使用 [Pydantic](https://docs.pydantic.dev/) 为管道提供参数
* 👉 可以在 Web UI 中手动运行管道
* 🔐 可以设置 OAuth2 提供保护
* 🔍 通过日志和输出数据便捷调试每次运行
* 📩 对管道进行监控，并在出现问题时收到告警通知
* 💣 使用 REST API 进行集成开发

!!! info

    这里是 [Plombery](https://github.com/lucafaggianelli/plombery) 项目非官方的中文文档，
    虽然目前文档内的图片仍然是英文的，但我们已经对 Plombery 项目做了完全的中文化，
    请参考安装页面更换为中文版本

![Plombery Screen Shot](assets/images/screenshot.png)
