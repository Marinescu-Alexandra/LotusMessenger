import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
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
    profileImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Hello, I am using Lotus Messenger :)'
    },
    theme: {
        type: String,
        default: 'sunset'
    }
}, { timestamps: true });

export const User = mongoose.model('user', userSchema);