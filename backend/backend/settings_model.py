from functools import lru_cache

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseModel(BaseModel):
    ENGINE: str
    HOST: str
    PORT: str
    NAME: str
    USER: str
    PASSWORD: str


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_nested_delimiter="__"
    )

    DEBUG: bool
    SECRET_KEY: str
    DATABASE: DatabaseModel
    DRIVE_PATH: str

    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY: str
    SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET: str

    ALLOWED_HOSTS: list[str]
    CORS_ALLOWED_ORIGINS: list[str]

@lru_cache
def get_settings() -> Settings:
    return Settings()
