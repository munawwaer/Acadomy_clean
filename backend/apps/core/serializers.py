from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

# --- 1. سيريالايزر التسجيل (هنا يحدث السحر) ---
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    # هذا الحقل هو "المفتاح" لربط المشروع السابق
    # نجعله اختياري (required=False) لأن المستخدم قد يسجل دون أن ينشئ مشروعاً
    project_uid = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'password', 'password_confirm', 'project_uid')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "كلمات المرور غير متطابقة"})
        return attrs

    def create(self, validated_data):
        # 1. نستخرج رقم المشروع من البيانات القادمة (لأنه ليس جزءاً من جدول المستخدم)
        # هذا المتغير project_uid موجود الآن في الذاكرة (RAM) فقط
        project_uid = validated_data.pop('project_uid', None)
        
        # 2. نحذف تأكيد كلمة المرور أيضاً
        validated_data.pop('password_confirm', None)
        
        # 3. ننشئ المستخدم ونحفظه في قاعدة البيانات (بدون رقم المشروع)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name']
        )

        # 4. الآن تأتي لحظة الربط!
        if project_uid:
            try:
                # نستدعي مودل المشاريع
                from incubation.models import Project 
                
                # نبحث عن المشروع الذي يحمل هذا الرقم
                project = Project.objects.get(id=project_uid)
                
                # نقول للمشروع: "مالكك الجديد هو هذا المستخدم الذي أنشأناه للتو"
                project.user = user  # <--- هنا يتم الربط الفعلي
                
                # نحفظ التعديل في جدول المشاريع
                project.save()
                
            except Project.DoesNotExist:
                # إذا كان الرقم خطأ، نتجاهل الأمر ونكمل
                pass 

        return user

# --- 2. سيريالايزر عرض الملف الشخصي ---
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'avatar', 'plan_tier', 'is_verified')
        read_only_fields = ('email', 'plan_tier', 'is_verified')

# --- 3. سيريالايزر تغيير كلمة المرور ---
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])