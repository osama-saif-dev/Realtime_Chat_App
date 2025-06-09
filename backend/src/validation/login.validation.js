import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string({
        invalid_type_error: 'Email must be string',
        required_error: 'Email is required'
    }).email({ message: 'Invalid email format' }).trim()
        .refine((email) => {
            const allwoedEmail = ['.com', '.net', '.org', '.edu'];
            return allwoedEmail.some((domain) => email.endsWith(domain))
        }, {
            message: 'Email must end with .com, .net, .org, or .edu only'
        }),

    password: z.string({
        invalid_type_error: 'Email must be string',
        required_error: 'Email is required'
    }).min(8, { message: 'Password must be at least 8 characters' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: 'Password must contain uppercase, lowercase and number'
        })
        .trim()
})