const { AppError } = require('./errors')

module.exports.errorHandler = async (error, request, response, next) => {
    if (error instanceof AppError) {
        let errors = error.message.split(',')
        response.status(error.status).json({
            error: {
                errorMessage: errors
            }
        });
    }
    else {
        response.status(500).json({
            error: {
                errorMessage: ['Internal server error']
            }
        });
    }
}
