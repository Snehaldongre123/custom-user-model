from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json

User = get_user_model()


@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"message": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"message": "Invalid data"}, status=400)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"message": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"message": "User already exists"}, status=400)

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return JsonResponse({"message": "User created successfully"})


@csrf_exempt
def user_login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Only POST allowed"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"message": "Invalid data"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"message": "Username and password required"}, status=400)

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user:
        login(request, user)
        request.session.save()
        return JsonResponse({"message": "Login successful"})

    return JsonResponse({"message": "Invalid credentials"}, status=401)


@csrf_exempt
def profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "Unauthorized"}, status=401)

    if request.method == "GET":
        return JsonResponse({
            "username": request.user.username,
            "email": request.user.email,
            "phone_number": request.user.phone_number,
            "bio": request.user.bio,
            "role": request.user.role,
            "profile_picture": request.user.profile_picture.url if request.user.profile_picture else None
        })

    if request.method == "POST":
        request.user.email = request.POST.get("email", request.user.email)
        request.user.phone_number = request.POST.get("phone_number", request.user.phone_number)
        request.user.bio = request.POST.get("bio", request.user.bio)

        # 🔥 DELETE IMAGE
        if request.POST.get("remove_image") == "true":
            if request.user.profile_picture:
                request.user.profile_picture.delete(save=False)
                request.user.profile_picture = None

        # 🔥 UPLOAD IMAGE
        if request.FILES.get("profile_picture"):
            request.user.profile_picture = request.FILES.get("profile_picture")

        request.user.save()

        return JsonResponse({"message": "Profile updated"})

    return JsonResponse({"message": "Invalid request"}, status=400)


@csrf_exempt
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})