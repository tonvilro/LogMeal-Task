FROM python:3.9
WORKDIR /usr/src/app
ADD requirements.txt /usr/src/app
ADD web.py /app
RUN pip install -r requirements.txt
CMD ["python", "web.py"]