from django import forms
from django.core.validators import MaxValueValidator, MinValueValidator
from .models import Upload, FILTER_CHOICES

class UploadForm(forms.ModelForm):
    image = forms.ImageField(widget=forms.FileInput(attrs={"class": "imageInput"}))
    size = forms.CharField(widget=forms.TextInput(attrs={"readonly": "readonly"}))
    action = forms.ChoiceField(choices=FILTER_CHOICES, widget=forms.Select(attrs={"class": "filterSelect"}))
    cutoff_val = forms.DecimalField(
        widget=forms.NumberInput(attrs={"class": "cutoffInput", "step": "0.01"}),
        initial=0,
        validators=[MinValueValidator(0.00), MaxValueValidator(300.00)]
    )

    class Meta:
        model = Upload
        fields = ["image", "size", "action", "cutoff_val"]

    # def __init__(self, *args, **kwargs):
    #     super(UploadForm, self).__init__(*args, **kwargs)
    #     # Override logic...
