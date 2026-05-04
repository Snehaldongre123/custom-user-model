from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("user", "User"),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")

    def __str__(self):
        return self.username