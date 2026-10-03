from django import forms

from .models import ContactMessage


class ContactMessageForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['full_name', 'email', 'phone', 'subject', 'message', 'consent']

    def clean_full_name(self):
        value = self.cleaned_data['full_name'].strip()
        if not value:
            raise forms.ValidationError('Please enter your full name.')
        return value

    def clean_phone(self):
        value = self.cleaned_data['phone'].strip()
        if value and not all(char.isdigit() or char in '+-() ' for char in value):
            raise forms.ValidationError('Please enter a valid phone number.')
        return value

    def clean_message(self):
        value = self.cleaned_data['message'].strip()
        if not value:
            raise forms.ValidationError('Please enter your message.')
        return value

    def clean_consent(self):
        value = self.cleaned_data['consent']
        if not value:
            raise forms.ValidationError(
                'Please agree to be contacted via email or phone.'
            )
        return value
