# Generated by Django 4.1 on 2024-05-06 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("uploads", "0006_alter_upload_cutoff_val"),
    ]

    operations = [
        migrations.AddField(
            model_name="upload",
            name="size",
            field=models.CharField(default="", max_length=20),
        ),
    ]
