from django.shortcuts import render
from .models import Enquiry


def program_list(request):
    return render(request, "program_list.html")


def program_detail(request):
    if request.method == "POST":
        Enquiry.objects.create(
            name=request.POST.get("name"),
            email=request.POST.get("email"),
            phone=request.POST.get("phone"),
            course=request.POST.get("course"),
            message=request.POST.get("message"),
        )

        return render(
            request,
            "program_detail.html",
            {"success": "Your enquiry has been submitted successfully!"}
        )

    return render(request, "program_detail.html")