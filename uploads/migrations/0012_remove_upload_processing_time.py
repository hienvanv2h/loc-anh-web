# Generated by Django 4.1 on 2024-05-08 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("uploads", "0011_alter_upload_image"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="upload",
            name="processing_time",
        ),
    ]
