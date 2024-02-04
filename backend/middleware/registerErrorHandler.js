import { isEmail } from 'validator';

export async function registerErrorHandler(req, res, next) {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username) {
        errors.push('Please provide an user name.')
    }
    if (!email) {
        errors.push('Please provide an email.')
    }
    if (!password) {
        errors.push('Please provide a password.')
    }

    if (email && !isEmail(email)) {
        errors.push('Plese provide a valid email.')
    }
    if (errors.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: errors
            }
        })
    } else {
        next();
    }
}