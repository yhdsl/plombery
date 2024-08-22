import ssl
import socket

from datetime import datetime, timezone

from apscheduler.triggers.interval import IntervalTrigger
from pydantic import BaseModel, Field

from plombery import register_pipeline
from plombery.logger import get_logger
from plombery.pipeline import task
from plombery.pipeline.trigger import Trigger


EXPIRATION_WARNING_THRESHOLD = 30
hostnames = [
    "google.com",
    "velvetlab.tech",
]


def _tuple_to_dict(items: tuple):
    return {item[0][0]: item[0][1] for item in items}


ssl_dateformat = r"%b %d %H:%M:%S %Y %Z"


def _parse_datetime(date: str):
    return datetime.strptime(date, ssl_dateformat)


def get_certificate_info(hostname):
    ctx = ssl.create_default_context()

    with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
        s.connect((hostname, 443))
        cert = s.getpeercert()

        return dict(
            subject=_tuple_to_dict(cert["subject"]),
            issuer=_tuple_to_dict(cert["issuer"]),
            version=cert.get("version"),
            serialNumber=cert.get("serialNumber"),
            notBefore=_parse_datetime(cert["notBefore"]),
            notAfter=_parse_datetime(cert["notAfter"]),
            subjectAltName=cert.get("subjectAltName"),
            caIssuers=cert.get("caIssuers"),
            crlDistributionPoints=cert.get("crlDistributionPoints"),
        )


class InputParams(BaseModel):
    hostname: str = Field(
        description="无前缀的域名，例如 google.com"
    )


@task
async def check_certificate_expiration(params: InputParams):
    logger = get_logger()
    now = datetime.now()

    info = get_certificate_info(params.hostname)
    expiration: datetime = info.get("notAfter")

    if expiration <= now:
        raise Exception(f"The certificate expired on {expiration}")

    expires_in = expiration - now

    if expires_in.days < EXPIRATION_WARNING_THRESHOLD:
        raise Exception(f"Attention, the certificate expires in {expires_in.days} days")

    logger.info(
        f"All good, the certificate expires in {expires_in.days} days on the {expiration}"
    )


register_pipeline(
    id="check_ssl_certificate",
    name="检查 SSL 证书",
    description="""检查网站的 SSL 证书是否已过期""",
    tasks=[check_certificate_expiration],
    triggers=[
        # 为每个主机单独创建一个触发器来运行检查
        Trigger(
            id=f"check-{host}",
            name=host,
            description="每周运行管道",
            params=InputParams(hostname=host),
            schedule=IntervalTrigger(
                weeks=1,
            ),
        )
        for host in hostnames
    ],
    params=InputParams,
)


if __name__ == "__main__":
    check_certificate_expiration.run()
