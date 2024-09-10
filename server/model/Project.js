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
        ref: 'User'
        // required: true
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
    }
});

projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

projectSchema.methods.addMember = function (userId) {
    if (!this.members.includes(userId)) {
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

projectSchema.statics.findByMember = function (userId) {
    return this.find({ members: userId });
};

projectSchema.statics.findByOwner = function (ownerId) {
    return this.find({ owner: ownerId });
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
