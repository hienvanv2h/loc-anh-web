from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.files.base import ContentFile
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from decimal import Decimal
from PIL import Image
from io import BytesIO
from .utils import get_filtered_image
import os
import uuid
import time


FILTER_CHOICES = (
  ("NO_FILTER", "Không lọc"),
  ("IDEAL_LP", "Lọc thông thấp Ideal"),
  ("GAUSSIAN_LP", "Lọc thông thấp Gaussian"),
  ("BUTTERWORTH_LP", "Lọc thông thấp Butterworth"),
  ("IDEAL_HP", "Lọc thông cao Ideal"),
  ("GAUSSIAN_HP", "Lọc thông cao Gaussian"),
  ("BUTTERWORTH_HP", "Lọc thông cao Butterworth"),
)

def custom_image_path(instance, filename):
  # Lấy phần mở rộng của tệp
  extension = os.path.splitext(filename)[1]
  # Tạo tên tệp mới bằng cách kết hợp ID của đối tượng và phần mở rộng
  original_filename = filename.split('/')[-1]
  if instance.pk:
    new_filename = f"{original_filename.split('.')[0]}_{instance.pk}{extension}"
  else:
    new_filename = f"{original_filename.split('.')[0]}_{uuid.uuid4()}{extension}"

  return os.path.join('images', new_filename)

class Upload(models.Model):
  image = models.ImageField(upload_to=custom_image_path)
  size = models.CharField(max_length=20, default="")
  action = models.CharField(max_length=50, choices=FILTER_CHOICES)
  cutoff_val = models.DecimalField(
    default = Decimal("0.00"),
    max_digits=5,
    decimal_places=2,
    validators=[
      MinValueValidator(0.00),
      MaxValueValidator(300.00)
    ]
  )
  updated = models.DateTimeField(auto_now=True)
  created = models.DateTimeField(auto_now_add=True)

  def __str__(self) -> str:
    return f"Hình {self.pk}"
  
  def save(self, *args, **kwargs) -> None:
    # Open image as grayscale
    img = Image.open(self.image)
    gray_img = img.convert("L")

    filtered_img = get_filtered_image(gray_img, self.action, self.cutoff_val)
    # Save
    buffer = BytesIO()
    filtered_img.save(buffer, format="png")
    img_png = buffer.getvalue()

    self.image.name = self.image.name.split("/")[-1]
    self.image.save(self.image.name, ContentFile(img_png), save=False)
    super().save(*args, **kwargs)