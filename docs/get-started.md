## 前置条件

为了运行 Plombery， 你需要提前安装 Python (v3.8 或更高)，如果尚未安装，请前往
[Python官网](https://www.python.org/downloads/) 下载并安装。

## 安装

为每一个项目单独设置一个虚拟环境，并在其中安装项目特定的依赖是一个很好的做法。

许多代码编辑器 (IDE) 提供了单独的创建虚拟环境的方法，
你也可以采用以下的方式使用 shell 来创建一个。

创建虚拟环境:

```bash
# 在你的项目根目录下运行
python -m venv .venv
```

激活虚拟环境:

```bash
# 使用 Mac/Linux 操作系统
source .venv/bin/activate
```

```sh
# 使用 Win 操作系统
.venv/Script/activate
```

接下来安装 Plombery:

!!! warning

    如果你先前已经安装了原版的 plombery，
    请在继续下面的步骤前将其卸载
    ```sh
    pip uninstall plombery
    ```

```sh
pip install plombery-chinese
```

现在你已经准备好去跳进第一个管道内了！

## 🎮 在 GitHub Codespaces 上尝试

如果你不想在本地创建项目但又希望了解 Plombery 及其工作原理，
那么你可以尝试一下 GitHub Codespaces:

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
