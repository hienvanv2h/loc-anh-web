# Generated by Django 4.1 on 2024-05-08 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("uploads", "0009_alter_upload_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="upload",
            name="image",
            field=models.ImageField(upload_to="images/"),
        ),
    ]