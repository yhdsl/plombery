<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Plombery</h3>

  <p align="center">
    带有舒适易用 Web UI 的 Python 任务调度程序
    <br />
    现已提供非官方的中文版本
    <br />
    <br />
    <a href="https://lucafaggianelli.github.io/plombery/"><strong>官方网站 (英文) »</strong></a>
    <br />
    <a href="https://yhdsl.github.io/plombery/"><strong>非官方网站 (中文) »</strong></a>
    <br />
    <br />
    <a href="https://github.com/yhdsl/plombery">GitHub</a>
    ·
    <a href="https://github.com/yhdsl/plombery/issues">报告错误</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## 关于 Plombery 项目

Plombery 是一个开源的 Python 任务调度程序，带有简洁易用的 Web UI 和 REST API。
如果你想重复执行 Python 脚本并监控运行状态，那么这便是适合你的工具！

<figure>
  <img src="https://github.com/yhdsl/plombery/raw/main/docs/assets/images/screenshot.png" alt="Plombery 屏幕截图">
</figure>

> Plombery 项目尚处于起步阶段，因此可以通过大家的反馈和帮助来改进和完善！
> 如果你喜欢它，请为原始的 Plombery 项目点点 Star 🌟!
> 如果你想要某个功能或发现错误，请提交 issue。

## 关于此中文项目

[Plombery](https://github.com/lucafaggianelli/plombery) 是一个允许定时执行 Python 脚本的项目，
并且自带一个美观的 Web UI 进行可视化控制

相比于其它开源调度项目，
Plombery 构造语法简单，并且没有其它复杂的设计或概念，
并且**完全**开源，不需要考虑任何付费内容

但由于 Plombery 项目并不支持 i18n，
我手动修改了项目内硬编码的文本，
将 Web UI 和邮件文本更改为中文页面

此外，Plombery 项目的文档也进行了汉化，
其中补充说明了本中文项目额外添加的配置项

## 功能

- ⏰ 基于 [APScheduler](https://github.com/agronholm/apscheduler) 的任务调度功能 (支持 Interval， Cron 和 Date 触发器)
- 💻 内置 Web UI, 无需额外使用 HTML/JS/CSS 进行开发
- 👩‍💻🐍 仅用纯 Python 语法定义管道和任务
- 🎛️ 可以使用 [Pydantic](https://docs.pydantic.dev/) 为管道提供参数
- 👉 可以在 Web UI 中手动运行管道
- 🔐 可以设置 OAuth2 提供保护
- 🔍 通过日志和输出数据便捷调试每次运行
- 📩 对管道进行监控，并在出现问题时收到告警通知
- 💣 使用 REST API 进行集成开发

什么时候不该使用:

- 你需要很高的可扩展性，并且希望在分布式系统上运行
- 你想要一个无代码工具，或者你不想使用 Python 进行编写

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

### 开发语言

[![Python][Python]][Python-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- GETTING STARTED -->

## 🚀 快速开始

单击进入 👉 [中文文档](https://yhdsl.github.io/plombery/) 快速入门 Plombery。

## 🎮 在 GitHub Codespaces 上尝试

在 GitHub Codespaces 上使用演示管道尝试 Plombery:

<figure align="center">
  <img src="https://github.com/yhdsl/plombery/raw/main/docs/assets/images/codespaces.png" alt="在 GitHub Codespaces 上尝试">
</figure>

Codespaces 是一个运行在云中的开发环境，因此你无需克隆、安装依赖等便可以运行，
操作流程如下:

- 前往 [yhdsl/plombery](https://github.com/yhdsl/plombery) GitHub 页面
- 点击右上角绿色的 **Code** 按钮
- 选择 **Codespaces** 页面
- 点击 *create new codespace from main* 或使用已有的代码空间
- 接下来会打开一个 `github.dev` 页面, 请等待环境搭建
- 当代码空间准备完成后，你会看到一个类似 VSCode 的页面
- 一些代码将在终端内执行以构建前端页面等，请耐心等待
- 如果一切顺利，一个 Plombery 页面将在新标签页中打开
- 任何对 Python 代码的更改均会实时相应在 Plombery 页面内，就像在你本地的笔记本电脑上开发一样

## 🧐 向我展示代码！

这是一个极简的管道代码:

<figure align="center">
  <img src="https://github.com/yhdsl/plombery/raw/main/docs/assets/images/minimal-code.png" alt="极简管道代码" width="80%">
  <figcaption>我知道你想看看!</figcaption>
</figure>

<!-- ROADMAP -->

## 🛣 路线图

查看 [open issues](https://github.com/yhdsl/plombery/issues) 获取完整的建议的功能 (和已知的错误) 清单。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- CONTRIBUTING -->

## 👩‍💻 贡献

正是诸多贡献者的努力让开源社区成为了学习、启发和创造的绝佳场所。
我们**非常感谢**你的任何贡献。

如果你有任何改进的建议，请 fork 原始的 Plombery 仓库并为其创建 pull request。
你也可以直接创建一个带有 "enhancement" 标签的 issue。
别忘了给原始的 Plombery 项目点点 Star！再次感谢！

1. Fork 项目
2. 创建你的新功能分叉 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 向分支推送修改 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

### 开发

克隆此 repo 的一个分支并设置开发环境。

创建一个 python 虚拟环境:

```sh
python -m venv .venv
# 使用 Mac/Linux 操作系统
source .venv/bin/activate
# 使用 Win 操作系统
.venv/Script/activate
```

并安装依赖项:

```sh
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

> 本中文项目已经补齐了原始的 Plombery 仓库中丢失的 `requirements.txt` 文件
> 当前你也可以从 `pyproject.toml` 中安装

出于开发的目的，运行示例程序将很有帮助:

```sh
cd examples/

# 为示例程序创建一个虚拟环境
python -m venv .venv
source .venv/bin/activate
pip install -r requirements

./run.sh
# 或者在 Win 操作系统上使用 ./run.ps1
```

React 前端位于 `frontend/` 文件夹下，
进入该文件夹并安装依赖:

```sh
cd frontend/
# 原始的 Plombery 仓库使用 yarn 做为包管理器
# 接下来的命令将安装依赖项
# 如果你是克隆的本中文仓库
# 请改用下面的 npm 命令
yarn
```

```sh
cd frontend/
# 如果你是克隆的本中文仓库
# 请改用 npm 命令
npm install
```

运行开发服务器:

```sh
yarn dev
```

```sh
npm run dev
```

构建前端

```sh
yarn run build
```

```sh
npm run build
```

### 文档

文档网站基于 MkDocs Material 开发，
其中源代码位于 `docs/` 文件夹下，
而配置储存在 `mkdocs.yml` 文件内。

要运行本地开发服务器，请执行:

```
mkdocs serve
```

### 测试

测试套件基于 `pytest`编写，因此仅需执行:

```sh
pytest
```

为了获取测试覆盖率，请执行:

```sh
coverage run -m pytest
coverage report -m
```

<!-- LICENSE -->

## 开源协议

本中文项目与原始的 Plombery 仓库一样， 采用 MTL 协议发布。
请参阅本中文项目和原始 Plombery 仓库下的 `LICENSE.txt` 文件获取更多信息。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- CONTACT -->

## 链接

- 原始 Plombery 项目: [https://github.com/lucafaggianelli/plombery](https://github.com/lucafaggianelli/plombery)
- 本中文项目: [https://github.com/yhdsl/plombery](https://github.com/yhdsl/plombery)

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## 致谢

Plombery 建立在以下令人惊叹的技术之上:

- [FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://docs.pydantic.dev/)
- [APScheduler](https://apscheduler.readthedocs.io/)
- [Apprise](https://github.com/caronc/apprise)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tremor](https://www.tremor.so/)

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Python]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=yellow
[Python-url]: https://www.python.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
