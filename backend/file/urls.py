from django.urls import path

from .api_views import FileView

urlpatterns = [
    path("", FileView.as_view(), name="file_list"),
    path("<path:path>", FileView.as_view(), name="file_list"),
]
