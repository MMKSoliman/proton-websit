import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from passlib.context import CryptContext

# تحميل متغيرات البيئة من ملف .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "72.62.58.192")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db_connection():
    """إنشاء اتصال مباشر مع قاعدة بيانات PostgreSQL"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            cursor_factory=RealDictCursor # لرجوع البيانات في شكل JSON / Dict
        )
        return conn
    except Exception as e:
        print(f"❌ خطأ في الاتصال بقاعدة البيانات: {e}")
        raise e

def init_admin_user():
    """إنشاء حساب الأدمن الافتراضي (admin / 123456) إذا لم يكن موجوداً"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM admins WHERE username = %s;", ('admin',))
        existing_admin = cursor.fetchone()
        if not existing_admin:
            hashed_pw = pwd_context.hash("123456")
            cursor.execute(
                "INSERT INTO admins (username, password_hash) VALUES (%s, %s);",
                ('admin', hashed_pw)
            )
            conn.commit()
            print("✅ تم إنشاء حساب الأدمن الافتراضي بنجاح (admin / 123456)")
    except Exception as e:
        print(f"⚠️ تنبيه أثناء إنشاء الأدمن: {e}")
    finally:
        cursor.close()
        conn.close()