import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    statuses: [
        {
            type: String,
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

workflowSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

workflowSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;
