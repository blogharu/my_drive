from django.urls import path

from .api_views import DownloadView

urlpatterns = [
    path("<path:path>", DownloadView.as_view()),
]
