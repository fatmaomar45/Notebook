from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    secret_key: str
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    smtp_from: str = "no-reply@notebook.local"
    idle_timeout_minutes: int = 60
    absolute_timeout_hours: int = 1
    reset_token_ttl_minutes: int = 30


settings = Settings()  # type: ignore[call-arg]
