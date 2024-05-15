from .base import *

ALLOWED_HOSTS = ["localhost", "xxx.xxx.xxx.xxx(Public IP)"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'genventory_prd',
        'USER': 'admin',
        'PASSWORD': 'utah123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

CORS_ORIGIN_WHITELIST = [
    'http://localhost:5500',
    'http://172.28.58.240:5500',

]
