import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: {
        type: String,
        enum: ['planning', 'active', 'completed'],
        default: 'planning'
    },
    goal: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

sprintSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

sprintSchema.methods.addTask = function (taskId) {
    if (!this.tasks.includes(taskId)) {
        this.tasks.push(taskId);
    }
    return this.save();
};

sprintSchema.methods.removeTask = function (taskId) {
    this.tasks = this.tasks.filter((task) => task.toString() !== taskId.toString());
    return this.save();
};

sprintSchema.methods.getTaskCount = function () {
    return this.tasks.length;
};

sprintSchema.methods.getTotalPoints = async function () {
    const tasks = await mongoose.model('Task').find({ _id: { $in: this.tasks } });
    return tasks.reduce((total, task) => total + (task.points || 0), 0);
};

sprintSchema.methods.getCompletedTaskCount = async function () {
    const tasks = await mongoose.model('Task').find({ _id: { $in: this.tasks }, status: 'done' });
    return tasks.length;
};

sprintSchema.methods.getProgress = async function () {
    const totalTasks = await this.getTaskCount();
    const completedTasks = await this.getCompletedTaskCount();
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
};

sprintSchema.methods.start = function () {
    if (this.status === 'planning') {
        this.status = 'active';
        this.startDate = Date.now();
        return this.save();
    }
    throw new Error('Sprint can only be started from planning status');
};

sprintSchema.methods.complete = function () {
    if (this.status === 'active') {
        this.status = 'completed';
        this.endDate = Date.now();
        return this.save();
    }
    throw new Error('Sprint can only be completed from active status');
};

sprintSchema.statics.getActiveSprint = function (projectId) {
    return this.findOne({ project: projectId, status: 'active' });
};

sprintSchema.statics.getUpcomingSprints = function (projectId) {
    return this.find({ project: projectId, status: 'planning' }).sort('startDate');
};

sprintSchema.statics.getCompletedSprints = function (projectId) {
    return this.find({ project: projectId, status: 'completed' }).sort('-endDate');
};

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
