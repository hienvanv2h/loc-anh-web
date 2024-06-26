# Generated by Django 4.1 on 2024-04-01 13:44

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("uploads", "0002_remove_upload_cutoff_val"),
    ]

    operations = [
        migrations.AddField(
            model_name="upload",
            name="cutoff_val",
            field=models.DecimalField(
                decimal_places=2,
                default=Decimal("0.00"),
                max_digits=3,
                validators=[
                    django.core.validators.MinValueValidator(0.0),
                    django.core.validators.MaxValueValidator(200.0),
                ],
            ),
        ),
    ]
