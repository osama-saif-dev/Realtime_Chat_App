export default function validationSchemaResult(res, schema, data) {
    const validationFields = schema.safeParse(data);
    if (!validationFields.success) {
        res.status(401).json({
            success: false,
            errors: validationFields.error.flatten().fieldErrors
        });
        return null;
    }
    return validationFields.data;
}