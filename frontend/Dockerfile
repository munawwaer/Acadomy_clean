# frontend/Dockerfile

# نستخدم صورة Node.js خفيفة
FROM node:22-alpine

# نحدد مجلد العمل
WORKDIR /app

# ننسخ ملف الحزم أولاً (للاستفادة من الكاش)
COPY package.json package-lock.json ./

# نثبت المكتبات
RUN npm install

# ننسخ باقي ملفات المشروع
COPY . .

# نفتح المنفذ 3000
EXPOSE 5173

# أمر التشغيل
CMD ["npm", "run","dev"]
