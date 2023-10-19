import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import (
	AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

class UserProfile(models.Model):
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'

    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True)
    age = models.CharField(max_length=255, blank=True)
    age_year = models.CharField(max_length=255, blank=True)
    sex = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    interests_array = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to="photos/%Y/%m/%d/", max_length=100, blank=True)
    social_media_vk = models.CharField(max_length=255, blank=True)
    social_media_tg = models.CharField(max_length=255, blank=True)
    social_media_wa = models.CharField(max_length=255, blank=True)
    social_media_ok = models.CharField(max_length=255, blank=True)
    social_media_ig = models.CharField(max_length=255, blank=True)
    audio_1 = models.FileField(upload_to="audio1/%Y/%m/%d/", max_length=100, blank=True)
    audio_2 = models.FileField(upload_to="audio2/%Y/%m/%d/", max_length=100, blank=True)
    audio_3 = models.FileField(upload_to="audio3/%Y/%m/%d/", max_length=100, blank=True)
    audio_4 = models.FileField(upload_to="audio4/%Y/%m/%d/", max_length=100, blank=True)
    audio_5 = models.FileField(upload_to="audio5/%Y/%m/%d/", max_length=100, blank=True)
    factors_array = models.TextField(blank=True)
    parameter_array = models.CharField(max_length=255, blank=True)
    likes_count = models.PositiveSmallIntegerField(default=999)
    likes_user_list = models.JSONField(blank=True, default=list) 
    age_filter = models.CharField(max_length=100, blank=True)
    city_filter = models.CharField(max_length=100, blank=True)
    country_filter = models.CharField(max_length=100, blank=True)
    match_user_list = models.JSONField(blank=True, default=list)
    is_profile_complete = models.BooleanField(default=False) 

    def __str__(self):
        return self.user.email
