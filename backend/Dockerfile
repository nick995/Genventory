# base image is python 3.10
FROM python:3.10-slim

# install python library
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# install nginx
RUN apt update \
  && apt install -y nginx

# remove basic service
RUN rm -rf /etc/nginx/sites-enabled/default

# copying for gunicorn
COPY config/nginx.conf /etc/nginx/conf.d

WORKDIR /code
COPY . .

# set up backend port as 8000
EXPOSE 8000

# If container is exited, lead exit normally.
STOPSIGNAL SIGTERM

# django migration, start nginx, start gunicorn, 
CMD python manage_docker.py migrate \
  && service nginx start \
  && gunicorn --config config/gunicorn_config.py config.wsgi:application