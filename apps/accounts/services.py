import os
import logging
import requests
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def send_email_otp(email, otp_code, purpose="password_reset"):
    """Sends OTP verification code to user's email address and prints it in terminal."""
    # Prominently print OTP in terminal for instant dev testing
    print("\n" + "=" * 60)
    print(f"  [EMAIL OTP DISPATCH TO: {email}]")
    print(f"  >>> VERIFICATION CODE: {otp_code} <<<")
    print("=" * 60 + "\n")

    subject = "Your Absolute English Verification Code"
    if purpose == "password_reset":
        subject = "Absolute English — Password Reset OTP"
    elif purpose == "registration":
        subject = "Absolute English — Phone/Email Verification OTP"

    message = (
        f"Hello,\n\n"
        f"Your verification code for Absolute English is: {otp_code}\n\n"
        f"This code is valid for 10 minutes. Please do not share this code with anyone.\n\n"
        f"Regards,\n"
        f"Absolute English Team"
    )

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@absoluteenglish.com'),
            recipient_list=[email],
            fail_silently=True,
        )
        logger.info(f"OTP Email sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        return False


def send_sms_otp(phone, otp_code, purpose="registration"):
    """
    Sends OTP to phone number via real SMS Provider (Fast2SMS / Twilio).
    Always prints the OTP prominently in the terminal for dev testing.
    """
    # Prominently print OTP in terminal for instant dev testing
    print("\n" + "=" * 60)
    print(f"  [SMS OTP DISPATCH TO PHONE: {phone}]")
    print(f"  >>> VERIFICATION CODE: {otp_code} <<<")
    print("=" * 60 + "\n")

    sms_text = f"Your Absolute English verification code is {otp_code}. Valid for 10 mins."

    # 1. Fast2SMS Provider (popular Indian SMS API)
    fast2sms_key = getattr(settings, 'FAST2SMS_API_KEY', os.getenv('FAST2SMS_API_KEY'))
    if fast2sms_key:
        try:
            clean_phone = ''.join(filter(str.isdigit, str(phone)))[-10:]
            url = "https://www.fast2sms.com/dev/bulkV2"
            payload = {
                "variables_values": otp_code,
                "route": "otp",
                "numbers": clean_phone
            }
            headers = {'authorization': fast2sms_key}
            res = requests.post(url, data=payload, headers=headers, timeout=5)
            logger.info(f"Fast2SMS API response: {res.text}")
        except Exception as e:
            logger.error(f"Fast2SMS error: {str(e)}")

    # 2. Twilio Provider
    twilio_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', os.getenv('TWILIO_ACCOUNT_SID'))
    twilio_auth = getattr(settings, 'TWILIO_AUTH_TOKEN', os.getenv('TWILIO_AUTH_TOKEN'))
    twilio_number = getattr(settings, 'TWILIO_PHONE_NUMBER', os.getenv('TWILIO_PHONE_NUMBER'))
    if twilio_sid and twilio_auth and twilio_number:
        try:
            from twilio.rest import Client
            client = Client(twilio_sid, twilio_auth)
            msg = client.messages.create(body=sms_text, from_=twilio_number, to=phone)
            logger.info(f"Twilio SMS sent SID: {msg.sid}")
        except Exception as e:
            logger.error(f"Twilio SMS error: {str(e)}")

    return True
