import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    sprints: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sprint'
        }
    ],
    backlog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    workflow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
});

projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

projectSchema.methods.addMember = function (userId) {
    if (!this.members?.includes(userId)) {
        if (!this.members) {
            this.members = [];
        }
        this.members.push(userId);
    }
    return this.save();
};

projectSchema.methods.removeMember = function (userId) {
    this.members = this.members.filter((member) => member.toString() !== userId.toString());
    return this.save();
};

projectSchema.methods.addSprint = function (sprintId) {
    if (!this.sprints.includes(sprintId)) {
        this.sprints.push(sprintId);
    }
    return this.save();
};

projectSchema.methods.removeSprint = function (sprintId) {
    this.sprints = this.sprints.filter((sprint) => sprint.toString() !== sprintId.toString());
    return this.save();
};

projectSchema.methods.addTaskToBacklog = function (taskId) {
    if (!this.backlog.includes(taskId)) {
        this.backlog.push(taskId);
    }
    return this.save();
};

projectSchema.methods.removeTaskFromBacklog = function (taskId) {
    this.backlog = this.backlog.filter((task) => task.toString() !== taskId.toString());
    return this.save();
};

projectSchema.methods.setWorkflow = function (workflowId) {
    this.workflow = workflowId;
    return this.save();
};

projectSchema.methods.archive = function () {
    this.status = 'archived';
    return this.save();
};

projectSchema.methods.activate = function () {
    this.status = 'active';
    return this.save();
};

projectSchema.methods.addCustomField = function (key, value) {
    if (!this.customFields) {
        this.customFields = new Map();
    }
    this.customFields.set(key, value);
    return this.save();
};

projectSchema.methods.removeCustomField = function (key) {
    if (this.customFields) {
        this.customFields.delete(key);
        return this.save();
    }
    return this;
};

projectSchema.statics.findByMember = function (userId) {
    return this.find({ members: userId });
};

projectSchema.statics.findByOwner = function (ownerId) {
    return this.find({ owner: ownerId });
};

projectSchema.statics.findActive = function () {
    return this.find({ status: 'active' });
};

projectSchema.statics.findArchived = function () {
    return this.find({ status: 'archived' });
};

projectSchema.statics.search = function (query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    });
};

projectSchema.methods.getActiveSprint = async function () {
    return mongoose.model('Sprint').findOne({ project: this._id, status: 'active' });
};

projectSchema.methods.getUpcomingSprints = async function () {
    return mongoose.model('Sprint').find({ project: this._id, status: 'planning' });
};

projectSchema.methods.getCompletedSprints = async function () {
    return mongoose.model('Sprint').find({ project: this._id, status: 'completed' });
};

projectSchema.methods.getTasks = async function () {
    return mongoose.model('Task').find({ project: this._id });
};

projectSchema.methods.getTasksByStatus = async function (status) {
    return mongoose.model('Task').find({ project: this._id, status });
};

projectSchema.methods.getMembers = async function () {
    return mongoose.model('User').find({ _id: { $in: this.members } });
};

projectSchema.methods.getOwner = async function () {
    return mongoose.model('User').findById(this.owner);
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
