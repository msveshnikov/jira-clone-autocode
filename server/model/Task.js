import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'codereview', 'readytotest', 'qa', 'done'],
        default: 'todo'
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    attachments: [
        {
            name: String,
            url: String
        }
    ],
    comments: [
        {
            text: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprint'
    },
    order: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date
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

taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

taskSchema.methods.addComment = function (text, author) {
    this.comments.push({ text, author });
    return this.save();
};

taskSchema.methods.addAttachment = function (name, url) {
    this.attachments.push({ name, url });
    return this.save();
};

taskSchema.methods.updateStatus = function (newStatus) {
    this.status = newStatus;
    return this.save();
};

taskSchema.methods.assignTo = function (userId) {
    this.assignedTo = userId;
    return this.save();
};

taskSchema.methods.logTime = function (time) {
    this.timeSpent += time;
    return this.save();
};

taskSchema.methods.updateOrder = function (newOrder) {
    this.order = newOrder;
    return this.save();
};

taskSchema.statics.findByProject = function (projectId) {
    return this.find({ project: projectId }).sort('order');
};

taskSchema.statics.findBySprint = function (sprintId) {
    return this.find({ sprint: sprintId }).sort('order');
};

taskSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort('order');
};

taskSchema.statics.findByAssignee = function (userId) {
    return this.find({ assignedTo: userId }).sort('order');
};

const Task = mongoose.model('Task', taskSchema);

export default Task;
