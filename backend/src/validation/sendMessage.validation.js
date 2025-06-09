import { z } from 'zod';
export const sendMessageSchema = z.object({
    text: z.string({
        invalid_type_error: 'Message is must be string',
        required_error: 'Message is required'
    }).trim(),

    reciverId: z.string({
        required_error: 'Reciver is required'
    }).trim(),

    image: z.instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: "Image size must be less than 5MB",
        })
        .refine((image) => image.type == '/image', {
            messaeg: 'File must be image'
        })
        .refine((image) => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(image), {
            message: "Unsupported image type. Supported types: JPEG, PNG, GIF, WebP",
        })
        .optional()
        .nullable()
})