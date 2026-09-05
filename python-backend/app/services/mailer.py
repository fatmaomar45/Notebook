import smtplib
from email.message import EmailMessage
from typing import Optional
from app.core.config import settings


async def send_reset_email(to: str, reset_url: str, ttl_minutes: int) -> dict:
    host = settings.smtp_host
    port = settings.smtp_port
    user = settings.smtp_user
    password = settings.smtp_pass

    if not host or not port or not user or not password:
        print(f"[RESET] (dev) Email to {to}: {reset_url} (expires in {ttl_minutes} min)")
        return {"delivered": False, "preview": reset_url}

    msg = EmailMessage()
    msg["Subject"] = "Reset your Notebook password"
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg.set_content(f"Reset your password using this link: {reset_url}\nThis link expires in {ttl_minutes} minutes.")
    msg.add_alternative(
        f"<p>Click the link below to reset your password:</p>"
        f"<p><a href=\"{reset_url}\">{reset_url}</a></p>"
        f"<p>This link expires in {ttl_minutes} minutes.</p>",
        subtype="html",
    )

    try:
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send_sync, msg, host, port, user, password)
    except Exception as error:
        print(f"[RESET] Email delivery failed, falling back to dev mode: {error}")
        print(f"[RESET] (dev) Email to {to}: {reset_url} (expires in {ttl_minutes} min)")
        return {"delivered": False, "preview": reset_url}

    return {"delivered": True}


def _send_sync(msg: EmailMessage, host: str, port: int, user: str, password: str) -> None:
    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
