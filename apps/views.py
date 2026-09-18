from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def languages(request):
    return render(request, 'languages.html')

def courses(request):
    return render(request, 'courses.html')

def about(request):
    return render(request, 'about.html')

def trainers(request):
    return render(request, 'trainers.html')

def gallery(request):
    return render(request, 'gallery.html')

def contact(request):
    return render(request, 'contact.html')

def book_demo(request):
    return render(request, 'book_demo.html')

def enroll(request):
    return render(request, 'enroll.html')

def american(request):
    return render (request,'american.html')

def british(request):
    return render(request,'british.html')

