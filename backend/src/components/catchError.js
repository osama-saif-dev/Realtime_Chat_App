export default function catchError(res, error) {
    return res.status(500).json({
        success: false,
        error: 'server error',
        message: error.message
    });
}
