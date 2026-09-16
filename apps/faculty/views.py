from django.views import View
from django.shortcuts import render


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