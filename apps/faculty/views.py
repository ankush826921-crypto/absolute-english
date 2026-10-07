from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from .models import Faculty, Course,TrialBooking


class FacultyView(View):
    def get(self,request):
        return render(request, 'faculity/faculty.html')

class FacultyCoursesView(View):
    def get(self,request):
        return render(request, 'faculity/faculty-courses.html') 


class FacultyProfileView(View):
    def get(self,request):
        return render(request, 'faculity/faculty-profile.html')         


class TrialClassView(View):
    def get(self,request):
        return render(request, 'faculity/trial-class.html') 




# API: Faculty
class FacultyAPI(View):
    def get(self, request):
        faculty = Faculty.objects.first()

        if not faculty:
            return JsonResponse({
                "faculty": None
            })

        return JsonResponse({
            "faculty": {
                "id": faculty.id,
                "name": faculty.name,
                "designation": faculty.designation,
                "image": faculty.image.url if faculty.image else "",
                "experience": faculty.experience,
                "rating": float(faculty.rating),
                "students": faculty.students,
                "bio": faculty.bio,
                "methodology": faculty.methodology,
                "qualifications": faculty.qualifications,
                "certifications": faculty.certifications,
                "specializations": faculty.specializations,
                "availability": faculty.availability,
            }
        })


# API: Courses
class FacultyCoursesAPI(View):
    def get(self, request):
        courses = Course.objects.all()

        data = []

        for course in courses:
            data.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "english_type": course.english_type,
                "duration": course.duration,
                "level": course.level,
                "faculty": course.faculty.name,
            })

        return JsonResponse({
            "courses": data
        })


import json
from django.views import View
from django.http import JsonResponse
from .models import Faculty, Course, TrialBooking


class TrialBookingAPI(View):

    def post(self, request):
        try:
            data = json.loads(request.body)

            student_name = data.get("student_name")
            email = data.get("email")
            phone = data.get("phone")
            faculty_id = data.get("faculty")
            course_id = data.get("course")
            english_type = data.get("english_type")
            preferred_date = data.get("preferred_date")
            preferred_time = data.get("preferred_time")
            message = data.get("message", "")

            if not all([
                student_name,
                email,
                phone,
                faculty_id,
                english_type,
                preferred_date,
                preferred_time
            ]):
                return JsonResponse({
                    "success": False,
                    "message": "Please fill all required fields."
                }, status=400)

            faculty = Faculty.objects.get(id=faculty_id)

            course = None

            if course_id:
                course = Course.objects.get(id=course_id)

            booking = TrialBooking.objects.create(
                student_name=student_name,
                email=email,
                phone=phone,
                faculty=faculty,
                course=course,
                english_type=english_type,
                preferred_date=preferred_date,
                preferred_time=preferred_time,
                message=message
            )

            return JsonResponse({
                "success": True,
                "message": "Trial class booked successfully.",
                "booking_id": booking.id
            })

        except Faculty.DoesNotExist:
            return JsonResponse({
                "success": False,
                "message": "Faculty not found."
            }, status=404)

        except Course.DoesNotExist:
            return JsonResponse({
                "success": False,
                "message": "Course not found."
            }, status=404)

        except Exception as e:
            return JsonResponse({
                "success": False,
                "message": str(e)
            }, status=400)
