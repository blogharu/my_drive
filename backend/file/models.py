from django.contrib.auth.models import AbstractUser
from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=50)


class CustomUser(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="users")
