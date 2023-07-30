import mimetypes
from pathlib import Path
from shutil import rmtree

from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .utils import get_files


class FileView(APIView):
    def get(self, request, path=""):
        path = path.lstrip("/")
        drive_path: Path = settings.DRIVE_PATH / path
        if not drive_path.exists():
            raise Http404
        if not drive_path.is_dir():
            return Response(
                dict(detail=f"{path} is not a directory"),
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(dict(files=get_files(drive_path)))

    def patch(self, request, path=""):
        path = path.lstrip("/")
        drive_path: Path = settings.DRIVE_PATH / path
        if not drive_path.exists():
            raise Http404
        drive_path = drive_path.rename(drive_path.parent / request.data["name"])
        return Response(
            dict(files=get_files(drive_path))
            if drive_path.is_dir()
            else dict(files=get_files(drive_path.parent))
        )

    def post(self, request, path=""):
        path = path.lstrip("/")
        drive_path: Path = settings.DRIVE_PATH / path
        for file_name, f in request.FILES.items():
            file_path = drive_path / file_name
            file_path.parent.mkdir(exist_ok=True, parents=True)
            with open(file_path, "wb+") as d:
                for chunk in f.chunks():
                    d.write(chunk)
        return Response(dict(files=get_files(drive_path)))

    def delete(self, request, path):
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


class DownloadView(APIView):
    def get(self, request, path):
        path = path.lstrip("/")
        file_path: Path = settings.DRIVE_PATH / path
        if not file_path.exists():
            raise Http404
        elif file_path.is_file():
            response = FileResponse(
                open(file_path, "rb"),
                filename="can_dir/myname",
                content_type="application/octet-stream",
            )
            return response
        # elif file_path.is_dir():
        #     return FileResponse(open(file_path, "rb"))
        return Response(
            dict(detail=f"directory does not support"),
            status=status.HTTP_400_BAD_REQUEST,
        )
