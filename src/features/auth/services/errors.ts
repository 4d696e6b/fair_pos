import { FirebaseError } from "firebase/app";

export class AuthError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

const MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "อีเมลนี้ถูกลงทะเบียนแล้ว",
  "auth/invalid-email": "กรุณากรอกอีเมลให้ถูกต้อง",
  "auth/weak-password": "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
  "auth/user-not-found": "ไม่พบบัญชีที่ใช้อีเมลนี้",
  "auth/wrong-password": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-disabled": "บัญชีนี้ถูกระงับการใช้งาน",
  "auth/too-many-requests": "พยายามหลายครั้งเกินไป กรุณาลองใหม่ภายหลัง",
  "auth/network-request-failed": "เครือข่ายมีปัญหา กรุณาตรวจสอบการเชื่อมต่อ",
  "auth/requires-recent-login": "กรุณาเข้าสู่ระบบอีกครั้งเพื่อทำรายการนี้",
  "auth/expired-action-code": "ลิงก์นี้หมดอายุแล้ว กรุณาขอลิงก์ใหม่",
  "auth/invalid-action-code": "ลิงก์นี้ไม่ถูกต้องหรือถูกใช้ไปแล้ว",
  "auth/missing-password": "กรุณากรอกรหัสผ่าน",
  "auth/missing-username": "กรุณากรอกชื่อผู้ใช้",
  "auth/operation-not-allowed": "วิธีเข้าสู่ระบบนี้ยังไม่ได้เปิดใช้งาน",
  "auth/popup-closed-by-user": "ยกเลิกการเข้าสู่ระบบ",
  "auth/cancelled-popup-request": "ยกเลิกการเข้าสู่ระบบ",
  "auth/popup-blocked": "เบราว์เซอร์บล็อกหน้าต่างเข้าสู่ระบบ กรุณาอนุญาตป๊อปอัป",
  "auth/unauthenticated": "กรุณาเข้าสู่ระบบก่อน",
  "auth/profile-not-found": "ไม่พบข้อมูลโปรไฟล์ของบัญชีนี้",
};

export function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  if (error instanceof FirebaseError) {
    return new AuthError(
      MESSAGES[error.code] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      error.code,
    );
  }

  return new AuthError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", "unknown");
}
