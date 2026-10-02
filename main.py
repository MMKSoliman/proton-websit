from fastapi import FastAPI, HTTPException, Status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import os
from database import get_db_connection, init_admin_user, pwd_context, load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "proton_super_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

app = FastAPI(
    title="Proton Backend API",
    description="نظام لوحة التحكم وربط العملاء والخدمات مع PostgreSQL",
    version="1.0.0"
)

# السماح للواجهة الأمامية (CORS) بالاتصال بالـ API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تشغيل دالة تهيئة الأدمن عند بدء التطبيق
@app.on_event("startup")
def startup_event():
    init_admin_user()

# ----------------------------------------------------
# 📌 نماذج البيانات (Pydantic Models)
# ----------------------------------------------------

class ClientRegisterSchema(BaseModel):
    client_name: str
    phone: str
    email: EmailStr
    password: str
    preferred_language: Optional[str] = "ar"

class LoginSchema(BaseModel):
    username_or_email: str
    password: str

class ToggleStatusSchema(BaseModel):
    is_active: bool

class UpdateServicesSchema(BaseModel):
    auto_posts_enabled: Optional[bool] = None
    reels_enabled: Optional[bool] = None
    comments_enabled: Optional[bool] = None
    messages_enabled: Optional[bool] = None
    subscription_days: Optional[int] = None
    monthly_price: Optional[float] = None

# ----------------------------------------------------
# 🔑 مسارات التوثيق وتسجيل الدخول (Auth)
# ----------------------------------------------------

@app.post("/api/client/register", summary="تسجيل حساب عميل جديد")
def register_client(data: ClientRegisterSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # التأكد من عدم تكرار البريد الإلكتروني
        cursor.execute("SELECT client_id FROM clients WHERE email = %s;", (data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="البريد الإلكتروني مُسجل بالفعل")

        hashed_password = pwd_context.hash(data.password)
        
        # إضافة العميل في جدول clients
        cursor.execute(
            """
            INSERT INTO clients (client_name, phone, email, password_hash, preferred_language, is_active, payment_status)
            VALUES (%s, %s, %s, %s, %s, true, 'pending')
            RETURNING client_id, client_name, email, created_at;
            """,
            (data.client_name, data.phone, data.email, hashed_password, data.preferred_language)
        )
        new_client = cursor.fetchone()
        conn.commit()
        
        return {
            "status": "success",
            "message": "تم تسجيل العميل بنجاح",
            "data": new_client
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.post("/api/auth/login", summary="تسجيل دخول الأدمن أو العميل")
def login(data: LoginSchema):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. فحص ما إذا كان الحساب للأدمن
        cursor.execute("SELECT * FROM admins WHERE username = %s;", (data.username_or_email,))
        admin = cursor.fetchone()
        if admin and pwd_context.verify(data.password, admin['password_hash']):
            token = jwt.encode({
                "sub": admin['username'],
                "role": "admin",
                "exp": datetime.utcnow() + timedelta(hours=24)
            }, SECRET_KEY, algorithm=ALGORITHM)
            return {"status": "success", "token": token, "role": "admin", "username": admin['username']}

        # 2. فحص ما إذا كان الحساب لعميل
        cursor.execute("SELECT * FROM clients WHERE email = %s;", (data.username_or_email,))
        client = cursor.fetchone()
        if client and client['password_hash'] and pwd_context.verify(data.password, client['password_hash']):
            if not client['is_active']:
                raise HTTPException(status_code=403, detail="حسابك معطل حالياً. يرجى التواصل مع الإدارة")
            
            token = jwt.encode({
                "sub": str(client['client_id']),
                "role": "client",
                "exp": datetime.utcnow() + timedelta(hours=24)
            }, SECRET_KEY, algorithm=ALGORITHM)
            return {
                "status": "success", 
                "token": token, 
                "role": "client", 
                "client_id": client['client_id'],
                "client_name": client['client_name']
            }

        raise HTTPException(status_code=401, detail="بيانات الدخول غير صحيحة")
    finally:
        cursor.close()
        conn.close()

# ----------------------------------------------------
# 👑 مسارات لوحة التحكم للأدمن (Admin Dashboard APIs)
# ----------------------------------------------------

@app.get("/api/admin/clients", summary="جلب كافة العملاء والمنصات المربوطة")
def get_all_clients_with_accounts():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # جلب بيانات العملاء وحسابات المنصات المربوطة بهم
        query = """
            SELECT 
                c.client_id,
                c.client_name,
                c.phone,
                c.email,
                c.is_active,
                ca.account_id,
                ca.platform,
                ca.page_name,
                COALESCE(ca.auto_posts_enabled, true) AS auto_posts_enabled,
                COALESCE(ca.reels_enabled, true) AS reels_enabled,
                COALESCE(ca.comments_enabled, true) AS comments_enabled,
                COALESCE(ca.messages_enabled, true) AS messages_enabled,
                COALESCE(ca.subscription_days, 30) AS subscription_days,
                COALESCE(ca.monthly_price, 0.00) AS monthly_price
            FROM clients c
            LEFT JOIN client_accounts ca ON c.client_id = ca.client_id
            ORDER BY c.client_id DESC;
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        return {"status": "success", "data": rows}
    finally:
        cursor.close()
        conn.close()

@app.patch("/api/admin/clients/{client_id}/toggle-status", summary="تغيير حالة العميل (تفعيل / تجميد)")
def toggle_client_status(client_id: int, payload: ToggleStatusSchema):
    """
    عند إلغاء تفعيل العميل (is_active = false)،
    تظل جميع الخدمات المحددة في جدول client_accounts كما هي وبدون مسح، 
    ولكن يُمنع العميل من الدخول وتتوقف الأتمتة.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE clients SET is_active = %s WHERE client_id = %s RETURNING client_id, is_active;",
            (payload.is_active, client_id)
        )
        updated_client = cursor.fetchone()
        if not updated_client:
            raise HTTPException(status_code=404, detail="العميل غير موجود")
        
        conn.commit()
        return {
            "status": "success",
            "message": "تم تحديث حالة العميل وتجميد/تفعيل خدماته بنجاح",
            "data": updated_client
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@app.patch("/api/admin/accounts/{account_id}/update-services", summary="تحديث مباشر ومستمر للخدمات ومدة الاشتراك (Auto-Save)")
def update_account_services(account_id: int, payload: UpdateServicesSchema):
    """
    يقوم بالتحديث المباشر للخدمات فوراً بمجرد تغييرها في الواجهة بدون زر حفظ
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # بناء استعلام التحديث الديناميكي
        update_data = payload.dict(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="لم يتم تقديم أي بيانات للتحديث")

        set_clause = ", ".join([f"{key} = %s" for key in update_data.keys()])
        values = list(update_data.values())
        values.append(account_id)

        query = f"UPDATE client_accounts SET {set_clause} WHERE account_id = %s RETURNING *;"
        cursor.execute(query, values)
        updated_account = cursor.fetchone()

        if not updated_account:
            raise HTTPException(status_code=404, detail="حساب المنصة غير موجود")

        conn.commit()
        return {
            "status": "success",
            "message": "تم الحفظ المباشر للتعديلات بنجاح",
            "data": updated_account
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# ----------------------------------------------------
# 🚀 تشغيل التطبيق محلياً
# ----------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)