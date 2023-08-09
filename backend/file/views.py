from pathlib import Path
from shutil import rmtree
from uuid import uuid4

from django.conf import settings
from django.http import FileResponse, Http404
from drf_social_oauth2.authentication import SocialAuthentication
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import get_files


class FileView(APIView):
    authentication_classes = [SocialAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, path=""):
        try:
            request.user.groups.get(name__contains="r")
            path = path.lstrip("/")
            drive_path: Path = settings.DRIVE_PATH / path
            if not drive_path.exists():
                raise Http404
            if not drive_path.is_dir():
                raise Http404
            return Response(dict(files=get_files(drive_path)))
        except:
            return Response(
                dict(detail="You don't have permission to read!"), status=400
            )

    def patch(self, request, path=""):
        try:
            request.user.groups.get(name__contains="rwx")
            path = path.lstrip("/")
            drive_path: Path = settings.DRIVE_PATH / path
            if not drive_path.exists():
                raise Http404
            drive_path = drive_path.rename(
                drive_path.parent / request.data["name"]
            )
            return Response(
                dict(files=get_files(drive_path))
                if drive_path.is_dir()
                else dict(files=get_files(drive_path.parent))
            )
        except:
            return Response(
                dict(detail="You don't have permission to rename!"), status=400
            )

    def post(self, request, path=""):
        try:
            print(request.user.groups.get(name__contains="rwx"))
            path = path.lstrip("/")
            drive_path: Path = settings.DRIVE_PATH / path
            if dir_name := request.query_params.get("dir", None):
                dir_path = drive_path / dir_name
                try:
                    dir_path.mkdir(parents=True)
                except:
                    return Response(
                        dict(detail=f"Folder {dir_name} already exists!"),
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                for file_name, f in request.FILES.items():
                    file_path = drive_path / file_name
                    file_path.parent.mkdir(exist_ok=True, parents=True)
                    with open(file_path, "wb+") as d:
                        for chunk in f.chunks():
                            d.write(chunk)
            return Response(dict(files=get_files(drive_path)))
        except:
            if dir_name := request.query_params.get("dir"):
                return Response(
                    dict(
                        detail="You don't have permission to create directory!"
                    ),
                    status=400,
                )
            return Response(
                dict(detail="You don't have permission to upload files!"),
                status=400,
            )

    def delete(self, request, path):
        try:
            request.user.groups.get(name__contains="rwx")
            path = path.lstrip("/")
            drive_path: Path = settings.DRIVE_PATH / path
            if not drive_path.exists():
                raise Http404
            if drive_path.is_file():
                drive_path.unlink()
            elif drive_path.is_dir():
                rmtree(drive_path)
            else:
                return Response(
                    dict(detail="unkown file type"),
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(dict(files=get_files(drive_path.parent)))
        except:
            return Response(
                dict(detail="You don't have permission to remove files!"),
                status=400,
            )


class DownloadView(APIView):
    def get(self, request, path):
        try:
            request.user.groups.get(name__contains="rwx")
            path = path.lstrip("/")
            file_path: Path = settings.DRIVE_PATH / path
            if not file_path.exists():
                raise Http404
            elif file_path.is_file():
                response = FileResponse(
                    open(file_path, "rb"),
                    filename=file_path.name,
                    content_type="application/octet-stream",
                )
                return response
            return Response(
                dict(detail=f"Dir does not support"),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except:
            return Response(
                dict(detail="You don't have permission to download files!"),
                status=400,
            )
