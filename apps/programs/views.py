from django.shortcuts import render, get_object_or_404

from .models import Program, Enquiry


def program_list(request):

    programs = Program.objects.filter(
        is_active=True
    ).order_by("created_at")

    return render(
        request,
        "program_list.html",
        {
            "programs": programs
        }
    )


def program_detail(request, program_id):

    program = get_object_or_404(
        Program,
        id=program_id,
        is_active=True
    )

    # Database ke text ko list mein convert kar rahe hain
    highlights = program.highlights.splitlines()
    learning_outcomes = program.learning_outcomes.splitlines()
    curriculum = program.curriculum.splitlines()

    if request.method == "POST":

        Enquiry.objects.create(
            program=program,
            name=request.POST.get("name"),
            email=request.POST.get("email"),
            phone=request.POST.get("phone"),
            course=program.name,
            message=request.POST.get("message"),
        )

        return render(
            request,
            "program_detail.html",
            {
                "program": program,
                "highlights": highlights,
                "learning_outcomes": learning_outcomes,
                "curriculum": curriculum,
                "success": "Your enquiry has been submitted successfully!"
            }
        )

    return render(
        request,
        "program_detail.html",
        {
            "program": program,
            "highlights": highlights,
            "learning_outcomes": learning_outcomes,
            "curriculum": curriculum,
        }
    )