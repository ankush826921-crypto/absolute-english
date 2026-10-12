from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Enrollment


def enroll_view(request):
    if request.method == 'POST':
        # 1. Form ka data lo
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        language = request.POST.get('language')
        level = request.POST.get('level')
        address = request.POST.get('address')
        agree_terms = request.POST.get('agree_terms') == 'on'

        # 2. Database mein save karo
        Enrollment.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            language=language,
            level=level,
            address=address,
            agree_terms=agree_terms,
        )

        # 3. User ko Thank You Email bhejo
        subject = "🎉 Thanks for Enrolling - Absolute English"
        text_content = f"Hi {first_name}, Thanks for enrolling with Absolute English!"

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #2563eb; text-align: center;">🎉 Thanks for Enrolling!</h2>
                <p>Hi <b>{first_name} {last_name}</b>,</p>
                <p>Thank you for enrolling with <b>Absolute English</b>!</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p><b>📚 Language:</b> {language}</p>
                <p><b>📊 Level:</b> {level}</p>
                <p><b>📧 Email:</b> {email}</p>
                <p><b>📱 Phone:</b> {phone}</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p>Our team will contact you soon to confirm your enrollment.</p>
                <p>Best regards,<br><b>Absolute English Team</b></p>
            </div>
        </body>
        </html>
        """

        try:
            email_msg = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            email_msg.attach_alternative(html_content, "text/html")
            email_msg.send()
            print(f"✅ Email sent to {email}")
        except Exception as e:
            print(f"❌ Email failed: {e}")

        # 4. Success message + home par redirect
        messages.success(request, "✅ Enrollment Successful! Check your email.")
        return redirect('home')

    return render(request, 'enroll.html')