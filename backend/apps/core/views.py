from rest_framework import status, views, permissions, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model
from incubation.models import Project
from django.db.models import Sum
from .serializers import UserRegistrationSerializer, ChangePasswordSerializer, UserProfileSerializer

# نستدعي مودل المشاريع لعملية الربط
from incubation.models import Project 
from rest_framework.authtoken.models import Token # استدعاء مودل التوكن

User = get_user_model()

# --- دالة مساعدة لجلب الـ IP ---
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # --- الإضافة هنا: توليد التوكن فوراً ---
            token, created = Token.objects.get_or_create(user=user)
            
            # تسجيل بيانات التتبع (كما فعلنا سابقاً)
            user.last_login_ip = get_client_ip(request)
            user.save()

            # منطق التبني للمشروع (كما فعلنا سابقاً)
            project_uid = request.data.get('project_uid')
            if project_uid:
                try:
                    project = Project.objects.get(id=project_uid, owner__isnull=True)
                    project.owner = user
                    project.save()
                except Project.DoesNotExist:
                    pass

            # نرجع التوكن في الرد
            return Response({
                "message": "تم التسجيل والدخول بنجاح",
                "token": token.key, # هذا هو المفتاح الذي سيستخدمه الفرونت آند
                "user_id": user.id,
                "email": user.email
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# --- 2. فيو تغيير كلمة المرور ---

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated] # يجب أن يكون مسجلاً للدخول

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # التأكد من الباسورد القديم
        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["كلمة المرور القديمة غير صحيحة"]}, status=status.HTTP_400_BAD_REQUEST)
        
        # حفظ الجديد
        user.set_password(serializer.data.get("new_password"))
        user.save()
        
        return Response({"message": "تم تحديث كلمة المرور بنجاح"}, status=status.HTTP_200_OK)

# --- 3. فيو الملف الشخصي (Profile) ---
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



class DashboardStatsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(owner=user)
        
        total_projects = projects.count()
        # جمع المشتركين من كل المشاريع
        total_leads = sum(p.landing_page.current_signups for p in projects if hasattr(p, 'landing_page'))
        # جمع الزوار
        total_views = sum(p.landing_page.views_count for p in projects if hasattr(p, 'landing_page'))

        return Response({
            "total_projects": total_projects,
            "total_leads": total_leads,
            "total_views": total_views,
            "user_name": user.first_name or user.username
        })    
        


from rest_framework.permissions import IsAdminUser # 👈 صلاحية للادمن فقط
from django.contrib.auth import get_user_model
from incubation.models import Project
from launchpad.models import ProjectLead

User = get_user_model()
class AdminStatsView(views.APIView):
    permission_classes = [IsAdminUser] # حماية مشددة

    def get(self, request):
        return Response({
            "total_users": User.objects.count(),
            "total_projects": Project.objects.count(),
            "total_leads": ProjectLead.objects.count(),
            # آخر 5 مستخدمين سجلوا
            "recent_users": User.objects.order_by('-date_joined')[:5].values(
                'id', 'email', 'date_joined', 'is_active'
            )
        })        