from django.contrib import admin

from .models import CustomUser, Group


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email"]


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ["name"]
