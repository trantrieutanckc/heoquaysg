import * as z from "zod"

// Dùng cho login — chỉ validate format, không kiểm tra độ phức tạp
export const userAuthSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

// Dùng khi tạo user mới hoặc đổi mật khẩu
export const strongPasswordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
  .regex(/[0-9]/, "Phải có ít nhất 1 chữ số")
  .regex(/[^A-Za-z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt (!@#$...)")
