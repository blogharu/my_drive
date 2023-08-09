from django.urls import path

from .views import DownloadView

urlpatterns = [
    path("", DownloadView.as_view()),
    path("<path:path>", DownloadView.as_view()),
]
