# Generated by Django 4.1 on 2024-04-01 13:42

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Upload",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="images")),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("NO_FILTER", "Không lọc"),
                            ("IDEAL_LP", "Lọc thông thấp Ideal"),
                            ("GAUSSIAN_LP", "Lọc thông thấp Gaussian"),
                            ("BUTTERWORTH_LP", "Lọc thông thấp Butterworth"),
                            ("IDEAL_HP", "Lọc thông cao Ideal"),
                            ("GAUSSIAN_HP", "Lọc thông cao Gaussian"),
                            ("BUTTERWORTH_HP", "Lọc thông cao Butterworth"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "cutoff_val",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0.00"),
                        max_digits=3,
                        validators=[
                            django.core.validators.MinValueValidator(0.0),
                            django.core.validators.MaxValueValidator(200.0),
                        ],
                    ),
                ),
                ("updated", models.DateTimeField(auto_now=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
