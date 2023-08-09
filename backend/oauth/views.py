from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer


@api_view(["GET"])
def get_user(request):
    return Response(UserSerializer(request.user).data)
