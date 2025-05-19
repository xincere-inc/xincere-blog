import { z } from 'zod';

// Zod schema for validating contact form
export const contactSchema = z.object({
  companyName: z.string().min(1, '会社名を入力してください'),
  contactName: z.string().min(1, '担当者名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z
    .string()
    .regex(/^[0-9-]{10,13}$/, '有効な電話番号を入力してください'),
  inquiry: z.string().min(1, '相談内容を入力してください'),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: 'プライバシーポリシーに同意してください' }),
  }),
});
