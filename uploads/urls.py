from django.urls import path
from .views import (
  upload_list_view,
  load_upload_data,
  upload_detail,
  load_upload_detail,
  modify_upload,
  delete_upload
)

app_name = "uploads"

urlpatterns = [
  path("", upload_list_view, name="upload-home"),
  path("upload/<int:pk>/", upload_detail, name="upload-detail"),

  path("data/", load_upload_data, name="upload-data"),
  path("upload/<int:pk>/data/", load_upload_detail, name="upload-detail-data"),
  path("upload/<int:pk>/modify/", modify_upload, name="upload-modify"),
  path("upload/<int:pk>/delete/", delete_upload, name="upload-delete"),
]
