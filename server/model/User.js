import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin', 'developer', 'project_manager'],
        default: 'user'
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    preferences: {
        theme: { type: String, default: 'light' },
        language: { type: String, default: 'en' },
        notifications: { type: Boolean, default: true }
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    this.updatedAt = Date.now();
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addProject = function (projectId) {
    if (!this.projects.includes(projectId)) {
        this.projects.push(projectId);
    }
    return this.save();
};

userSchema.methods.removeProject = function (projectId) {
    this.projects = this.projects.filter((project) => project.toString() !== projectId.toString());
    return this.save();
};

userSchema.methods.addTask = function (taskId) {
    if (!this.tasks.includes(taskId)) {
        this.tasks.push(taskId);
    }
    return this.save();
};

userSchema.methods.removeTask = function (taskId) {
    this.tasks = this.tasks.filter((task) => task.toString() !== taskId.toString());
    return this.save();
};

userSchema.methods.updatePreferences = function (preferences) {
    Object.assign(this.preferences, preferences);
    return this.save();
};

userSchema.methods.updateLastLogin = function () {
    this.lastLogin = Date.now();
    return this.save();
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

userSchema.statics.findByUsername = function (username) {
    return this.findOne({ name: username });
};

userSchema.methods.getAssignedTasks = function () {
    return mongoose.model('Task').find({ assignedTo: this._id });
};

userSchema.methods.getProjectMemberships = function () {
    return mongoose.model('Project').find({ members: this._id });
};

userSchema.methods.changeRole = function (newRole) {
    if (['user', 'admin', 'developer', 'project_manager'].includes(newRole)) {
        this.role = newRole;
        return this.save();
    }
    throw new Error('Invalid role');
};

userSchema.methods.resetPassword = async function (newPassword) {
    this.password = newPassword;
    return this.save();
};

userSchema.methods.getActivityLog = function () {
    return mongoose.model('ActivityLog').find({ user: this._id }).sort({ timestamp: -1 });
};

userSchema.methods.getNotifications = function () {
    return mongoose.model('Notification').find({ user: this._id }).sort({ createdAt: -1 });
};

userSchema.methods.markNotificationAsRead = function (notificationId) {
    return mongoose.model('Notification').findByIdAndUpdate(notificationId, { read: true });
};

userSchema.methods.getWorkload = async function () {
    const tasks = await this.getAssignedTasks();
    return tasks.reduce((total, task) => total + (task.estimatedTime || 0), 0);
};

userSchema.methods.getProductivity = async function (startDate, endDate) {
    const completedTasks = await mongoose.model('Task').find({
        assignedTo: this._id,
        status: 'completed',
        completedAt: { $gte: startDate, $lte: endDate }
    });
    return completedTasks.length;
};

const User = mongoose.model('User', userSchema);

export default User;
