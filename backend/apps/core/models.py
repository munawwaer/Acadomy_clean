import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# --- 1. المدراء (Managers) ---
class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('يجب إدخال البريد الإلكتروني'))
        email = self.normalize_email(email)
        # القيم الافتراضية للمستخدم العادي
        extra_fields.setdefault('plan_tier', 'FREE') 
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('plan_tier', 'PREMIUM') # المشرف دائماً بريميوم

        return self.create_user(email, password, **extra_fields)

# --- 2. النموذج الأب ---
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    class Meta:
        abstract = True

# --- 3. المستخدم الشامل (The Master User) ---
class User(AbstractUser, BaseModel):
    # --- أ. تنظيف الجدول (إلغاء القديم) ---
    username = None
    first_name = None
    last_name = None

    # --- ب. الهوية الأساسية ---
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_('الاسم الكامل'), max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # --- ج. الملف الشخصي ---
    avatar = models.ImageField(upload_to='users/avatars/', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)

    # --- د. البيزنس والفلوس (هام جداً للمستقبل) ---
    class PlanTier(models.TextChoices):
        FREE = 'FREE', 'مجاني (زائر)'
        PREMIUM = 'PREMIUM', 'مدفوع (عميل)'
        ENTERPRISE = 'ENTERPRISE', 'شركات'

    plan_tier = models.CharField(max_length=20, choices=PlanTier.choices, default=PlanTier.FREE)
    
    # هل جاء من طرف أحد؟ (نظام الإحالة)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals')
    
    # معرف الدفع (للمستقبل عند الربط مع Stripe أو PayTabs)
    payment_customer_id = models.CharField(max_length=100, blank=True, null=True)

    # --- هـ. الأمن والتجسس (Tracking) ---
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    current_location = models.CharField(max_length=100, blank=True, null=True)
    device_info = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    # الإعدادات التقنية
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.email} ({self.plan_tier})"
    
