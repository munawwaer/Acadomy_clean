import google.generativeai as genai
import os

# تأكد من وضع مفتاح الـ API الخاص بك هنا أو في متغيرات البيئة
api_key = "AIzaSyB_CcYUDAmfnKp2ogCf_X7QVWTmtsf5bbY"
genai.configure(api_key=api_key)

print("List of available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)