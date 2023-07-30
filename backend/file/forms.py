from django import forms


class FileUploadForm(forms.BaseForm):
    name = forms.CharField(max_length=255)
    file = forms.FileField()
