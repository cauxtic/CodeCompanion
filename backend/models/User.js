const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    platforms: {
        codeforces: {
            type: String,
            default: ''
        },
        codechef: {
            type: String,
            default: ''
        },
        leetcode: {
            type: String,
            default: ''
        },
        gfg: {
            type: String,
            default: ''
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
