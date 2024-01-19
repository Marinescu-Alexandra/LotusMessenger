const { model, Schema } = require('mongoose')

const registerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        select: false
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = model('user', registerSchema)