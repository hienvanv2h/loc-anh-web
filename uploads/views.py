from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.core import serializers
from .models import Upload
from .forms import UploadForm

def upload_list_view(request):
  if request.method == "POST":
    form = UploadForm(request.POST, request.FILES)
    if form.is_valid():
      instance = form.save()
      query = Upload.objects.filter(pk=instance.pk)
      data = serializers.serialize("json", query)
      return JsonResponse({"data": data})
    else:
      return HttpResponseBadRequest("Form không hợp lệ")
  else:
    form = UploadForm()
  context = {
    "form": form
  }
  return render(request, "uploads/main.html", context)

def load_upload_data(request):
  query_set = Upload.objects.all().order_by("-created")
  data = serializers.serialize("json", query_set)
  return JsonResponse({"data": data})

def upload_detail(request, **kwargs):
  pk = kwargs.get("pk")
  upload_obj = Upload.objects.get(pk=pk)
  form = UploadForm()
  context = {
    "upload_obj": upload_obj,
    "form" : form
  }
  return render(request, "uploads/detail.html", context)

def load_upload_detail(request, **kwargs):
    pk = kwargs.get("pk")
    upload_obj = Upload.objects.get(pk=pk)
    data = {
      "id": upload_obj.pk,
      "image_url": upload_obj.image.url,
      "image_name": upload_obj.image.name.split("/")[-1],
      "action": upload_obj.action,
      "cutoff_val": upload_obj.cutoff_val,
      "created": upload_obj.created,
      "updated": upload_obj.updated,
    }
    return JsonResponse({"data": data})

def modify_upload(request, **kwargs):
    pk = kwargs.get("pk")
    upload_obj = Upload.objects.get(pk=pk)
    if request.method == "POST":
      form = UploadForm(request.POST, request.FILES, instance=upload_obj)
      if form.is_valid():
        instance = form.save()
        data = {
          "id": instance.pk,
          "image_url": instance.image.url,
          "image_name": instance.image.name.split("/")[-1],
          "action": instance.action,
          "cutoff_val": instance.cutoff_val,
          "created": instance.created,
          "updated": instance.updated,
        }
        return JsonResponse({"data": data})
      else:
        return HttpResponseBadRequest("Form không hợp lệ")
    return HttpResponseNotAllowed(["POST"])

def delete_upload(request, **kwargs):
  pk = kwargs.get("pk")
  upload_obj = Upload.objects.get(pk=pk)
  if request.method == "POST":
    upload_obj.delete()
    return JsonResponse({"deleted": pk})
  return JsonResponse({})