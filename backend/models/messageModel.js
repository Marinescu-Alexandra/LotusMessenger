import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true,
    },
    message: {
        text: {
            type: String,
            default: ''
        },
        image: {
            type: Array,
            default: []
        }

    },
    status: {
        type: String,
        default: 'undelivered'
    }
}, { timestamps: true });

export const MessageModel = mongoose.model('message', messageSchema);