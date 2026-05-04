from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ["username", "email", "role", "is_staff"]
    search_fields = ["username", "email"]
    ordering = ["username"]

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("email", "phone_number", "bio", "profile_picture")}),
        ("Role", {"fields": ("role",)}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "role"),
        }),
    )