from django.urls import path

from . import views

app_name = "oauth"

urlpatterns = [path("", views.get_user, name="get_user")]
