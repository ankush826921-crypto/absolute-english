from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import ContactMessageForm


def contact(request):
    form = ContactMessageForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Your message has been sent successfully. We will get back to you soon.')
        return redirect('contact')

    return render(request, 'contact.html', {'form': form})
