from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout
from django.utils import timezone
from django.db.models import Q
from decouple import config

from .validations import (
    custom_validation,
    validate_email,
    validate_password,
)
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserProfileSerializer,
)
from .models import (
    User,
    UserProfile,
)
from .ML import ml


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.create(clean_data)
                if user:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as error:
            return Response({"message": error.message}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class CheckUser(APIView):
    def get(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])
        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)
        serializer = UserProfileSerializer(profile_instance, context={"request": request})
        response_data = {
            'authenticated_user': serializer.data,
            'authenticated_user_email': profile_instance.user.email,
        }

        return Response(response_data)


class UserSearchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])
        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)

        profiles_all = UserProfile.objects.all()
        profiles_base = profiles_all.exclude(Q(user=authenticated_user) | Q(sex=profile_instance.sex) | ~Q(is_profile_complete=profile_instance.is_profile_complete))

        if profile_instance.age_filter and profile_instance.city_filter and profile_instance.country_filter:
            profiles_all_filters = profiles_base.exclude(Q(age_year__lt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[0]) |
                                                         Q(age_year__gt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[1]) |
                                                         ~Q(city=profile_instance.city_filter) | ~Q(country=profile_instance.country_filter))
            profiles = profiles_all_filters.union(profiles_base.exclude(id__in=profiles_all_filters.values_list('id', flat=True)))

        elif profile_instance.city_filter and profile_instance.country_filter:
            profiles_place = profiles_base.exclude(~Q(city=profile_instance.city_filter) | ~Q(country=profile_instance.country_filter))
            profiles = profiles_place.union(profiles_base.exclude(id__in=profiles_place.values_list('id', flat=True)))

        elif profile_instance.age_filter and profile_instance.city_filter:
            profiles_age_and_city = profiles_base.exclude(Q(age_year__lt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[0]) |
                                                          Q(age_year__gt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[1]) |
                                                          ~Q(city=profile_instance.city_filter))
            profiles = profiles_age_and_city.union(profiles_base.exclude(id__in=profiles_age_and_city.values_list('id', flat=True)))

        elif profile_instance.age_filter and profile_instance.country_filter:
            profiles_age_and_country = profiles_base.exclude(Q(age_year__lt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[0]) |
                                                             Q(age_year__gt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[1]) |
                                                             ~Q(country=profile_instance.country_filter))
            profiles = profiles_age_and_country.union(profiles_base.exclude(id__in=profiles_age_and_country.values_list('id', flat=True)))

        elif profile_instance.age_filter:
            profiles_age = profiles_base.exclude(Q(age_year__lt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[0]) |
                                                 Q(age_year__gt=profile_instance.age_filter.replace("[", "").replace("]", "").split(',')[1]))
            profiles = profiles_age.union(profiles_base.exclude(id__in=profiles_age.values_list('id', flat=True)))
        elif profile_instance.city_filter:
            profiles_city = profiles_base.exclude(~Q(city=profile_instance.city_filter))
            profiles = profiles_city.union(profiles_base.exclude(id__in=profiles_city.values_list('id', flat=True)))
        elif profile_instance.city_filter:
            profiles_country = profiles_base.exclude(~Q(country=profile_instance.country_filter))
            profiles = profiles_country.union(profiles_base.exclude(id__in=profiles_country.values_list('id', flat=True)))

        else:
            profiles = profiles_base

        serializer = UserProfileSerializer(profiles, many=True, context={"request": request})
        serializer_user = UserProfileSerializer(profile_instance, context={"request": request})
        response_data = {
            'profiles': serializer.data,
            'authenticated_user_photo': config('BASE_URL') + profile_instance.photo.url,
            'authenticated_user_likes_count':  profile_instance.likes_count,
            'authenticated_user_like_list': profile_instance.likes_user_list,
            'authenticated_parameter_array': profile_instance.parameter_array,
            'authenticated_user_age': profile_instance.age,
            'authenticated_user_age_filter': profile_instance.age_filter,
            'authenticated_user_id': profile_instance.user.id,
            'authenticated_user_email': profile_instance.user.email,
            'authenticated_user': serializer_user.data,
        }
        return Response(response_data)


class CreateUserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])
        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)
        serializer = UserProfileSerializer(profile_instance)
        response_data = {
            'profiles': serializer.data,
            'authenticated_user_photo': config('BASE_URL') + profile_instance.photo.url,
        }
        return Response(response_data)

    def post(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])

        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)

        if profile_instance.audio_1 and profile_instance.audio_2 and profile_instance.audio_3 and profile_instance.audio_4 and profile_instance.audio_5 and not profile_instance.factors_array:
            list_audio = [profile_instance.audio_1, profile_instance.audio_2, profile_instance.audio_3, profile_instance.audio_4, profile_instance.audio_5]
            profile_instance.factors_array = ml.get_factors(list_audio)

        profile_serializer = UserProfileSerializer(instance=profile_instance, data=request.data, partial=True)

        if profile_serializer.is_valid(raise_exception=True):
            profile_serializer.save(user=authenticated_user)
            return Response(profile_serializer.data)

        return Response(profile_serializer.errors)


class MatchAddView(APIView):
    def post(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])
        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)

        profile_match_instance, created = UserProfile.objects.get_or_create(user_id=profile_instance.match_user_list[-1])

        profile_serializer = UserProfileSerializer(instance=profile_match_instance, data=request.data, partial=True)

        match_user_list = profile_match_instance.match_user_list

        match_user_list.append(profile_instance.user_id)

        if profile_serializer.is_valid(raise_exception=True):
            profile_serializer.save(match_user_list=match_user_list)
            return Response(profile_serializer.data)

        return Response(profile_serializer.errors)


class MatchRemoveView(APIView):
    def post(self, request):
        authenticated_user = User.objects.get(pk=request.auth.payload['user_id'])
        profile_instance, created = UserProfile.objects.get_or_create(user=authenticated_user)

        profile_match_instance, created = UserProfile.objects.get_or_create(
            user_id=profile_instance.match_user_list[-1])

        profile_serializer = UserProfileSerializer(instance=profile_match_instance, data=request.data, partial=True)

        match_user_list = profile_match_instance.match_user_list

        matched_user_id = profile_instance.user_id

        if matched_user_id in match_user_list:
            match_user_list.remove(matched_user_id)

        # Check if the authenticated user liked the matched user
        if matched_user_id in profile_instance.likes_user_list:
            profile_instance.likes_user_list.remove(matched_user_id)

        if profile_serializer.is_valid(raise_exception=True):
            profile_serializer.save(match_user_list=match_user_list)
            profile_instance.save()  # Save the changes to the authenticated user's likes_user_list
            return Response(profile_serializer.data)

        return Response(profile_serializer.errors)
