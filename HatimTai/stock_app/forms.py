from django import forms
from .models import User, Stocks


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone_number', 'CNIC']
