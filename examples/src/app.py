#!/usr/bin/python3

"""
改用 run.sh 或 run.ps1 脚本运行
"""

from plombery import get_app  # noqa: F401

import sales_pipeline  # noqa: F401
import sync_pipeline  # noqa: F401
import ssl_certificates  # noqa: F401


if __name__ == "__main__":
    import uvicorn

    # `reload_dirs` 用于在 plombery 包本身发生变化时重新加载全部内容
    # 这在开发过程中很有帮助，但通常不应该使用
    uvicorn.run("plombery:get_app", reload=True, factory=True, reload_dirs="..")
