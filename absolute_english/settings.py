import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================================================
# .env LOAD KARO
# =========================================================
load_dotenv(BASE_DIR / '.env')


# =========================================================
# SECURITY
# =========================================================
SECRET_KEY = os.getenv(
    'SECRET_KEY',
    'django-insecure-1234567890abcdefghijklmnopqrstuvwxyz'  # Fallback for local
)

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.getenv(
    'ALLOWED_HOSTS',
    '127.0.0.1,localhost'
).split(',')

# Automatically allow Render domain
if not DEBUG:
    ALLOWED_HOSTS += ['.onrender.com']

CSRF_TRUSTED_ORIGINS = [
    'https://*.onrender.com',
]


# =========================================================
# APPLICATIONS
# =========================================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Your apps
    'apps.accounts',
    'apps.programs',
    'apps.faculty',
    'apps.testimonials',
    'apps.gallery',
    'apps.enquiries',
    'apps.chatbot',
    'apps.enroll',
]


# =========================================================
# MIDDLEWARE – Whitenoise add karo (position matters!)
# =========================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',   # ← MUST be after SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'absolute_english.urls'


# =========================================================
# TEMPLATES
# =========================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'absolute_english.wsgi.application'


# =========================================================
# DATABASE
# Local: SQLite fallback | Render: PostgreSQL via DATABASE_URL
# =========================================================
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# =========================================================
# EMAIL / SMTP
# =========================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER', '')


# =========================================================
# PASSWORD VALIDATORS
# =========================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# =========================================================
# INTERNATIONALIZATION
# =========================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# =========================================================
# STATIC FILES – Whitenoise optimized
# =========================================================
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Whitenoise compression + caching
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# =========================================================
# MEDIA FILES
# =========================================================
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# =========================================================
# DEFAULT PRIMARY KEY
# =========================================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
