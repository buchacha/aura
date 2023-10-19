from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import User, UserProfile

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(
            email=clean_data['email'], password=clean_data['password'])
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(
            username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise Exception('user not found')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email')


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'name', 'age', 'age_year', 'sex', 'country', 'city', 'interests_array',
                  'photo', 'social_media_vk', 'social_media_tg', 'social_media_wa',
                  'social_media_ok', 'social_media_ig', 'audio_1', 'audio_2', 'audio_3',
                  'audio_4', 'audio_5', 'age_filter', 'city_filter', 'country_filter',
                  'parameter_array', 'factors_array', 'likes_count', 'likes_user_list', 'match_user_list', 'is_profile_complete']

        read_only_fields = ['user']

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
