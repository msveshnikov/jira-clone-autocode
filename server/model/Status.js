import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        default: '#000000'
    },
    order: {
        type: Number,
        default: 0
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

statusSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Status = mongoose.model('Status', statusSchema);

export default Status;
