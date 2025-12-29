# نستخدم بايثون كأساس
FROM python:3.12-slim

# منع بايثون من كتابة ملفات pyc ومنع التخزين المؤقت للمخرجات
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# مجلد العمل داخل الحاوية
WORKDIR /app

# تثبيت متطلبات النظام (من أجل مكتبات قواعد البيانات)
RUN apt-get update && apt-get install -y libpq-dev gcc

# نسخ ملف المتطلبات وتثبيتها
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# نسخ باقي الكود
COPY . /app/
CMD [ "python","manage.py","runserver","0.0.0.0:8000" ]
