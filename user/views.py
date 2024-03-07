from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import User
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .serializers import UserSerializer
# Create your views here.

class UserAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username')
            if not username:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            user = User.objects.filter(username=username).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            User.objects.create(
                user=user,
            )
            return JsonResponse({'success': True, 'msg': "user created"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

          
class SignUp(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_authenticated:
                return JsonResponse({'success': False, 'msg': "You are already authenticated. Refresh the page"})
            username = request.data.get('username').strip()
            first_name = request.data.get('first_name').strip()
            last_name = request.data.get('last_name').strip()
            password = request.data.get('password').strip()
            email = request.data.get('email').strip()
            verify_pass = request.data.get('verifyPassword').strip()
            print(username, first_name, last_name, password, email, verify_pass)
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'msg': "Username/email already registered. Please try with another username."})

            if not username.isalnum():
                return JsonResponse({'success': False, 'msg': "Username should be alpha numeric"})

            if password != verify_pass:
                return JsonResponse({'success': False, 'msg': "Both passwords should match"})

            user = User.objects.create_user(
                username=username,
                last_name=last_name,
                first_name=first_name,
                password=password,
                email=email
            )

            authenticate(request, username=username, password=password)
            print(user)
            if user:
                login(request, user)
                return JsonResponse({'success': True, 'msg': "User Created", user: UserSerializer(user).data})
            
            return JsonResponse({'success': False, 'msg': "Failed to authenticate user."})
            
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

            
class SignIn(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            print(user)
            if user.is_authenticated:
                return JsonResponse({'success': False, 'msg': "You are already authenticated. Refresh the page"})
            username = request.data.get('username')
            password = request.data.get('password')
            if not User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'msg': "Username is not registered. Please Sign up first."})
            user = authenticate(request, username=username, password=password)
            print(user)
            if user:
                login(request, user)
                return JsonResponse({'success': True, 'msg': "Sign up successful!"})
            return JsonResponse({'success': True, 'msg': "Couldn't signin due to an error. Please try again later"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

            
          
class SignOut(APIView):
    def post(self, request, *args, **kwargs):
        try:
            logout(request)
            return JsonResponse({'success': True, 'msg': "Couldn't signin due to an error. Please try again later"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

            