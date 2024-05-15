from .base import *

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "44.193.183.98"]

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'genventory',
#         'USER': 'admin',
#         'PASSWORD': 'utah123',
#         'HOST': '35.169.115.116',
#         'PORT': '5432',
#     }
# }

CORS_ORIGIN_WHITELIST = (
    'http://172.28.58.240:5173',
    'http://localhost:5173'
)