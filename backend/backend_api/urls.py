from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


app_name = 'backend_api'
urlpatterns = [
    path('user', views.UserView.as_view(), name='user'),
    path('users/', views.UserRegister.as_view(), name='register'),
    path('users/login/', views.UserLogin.as_view(), name='login'),
    path('user/search/', views.UserSearchView.as_view(), name='search'),
    path('user/check/', views.CheckUser.as_view(), name='check'),
    path('users/profile/', views.CreateUserProfileView.as_view()),
    path('users/add_match/', views.MatchAddView.as_view()),
    path('users/remove_match/', views.MatchRemoveView.as_view()),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
