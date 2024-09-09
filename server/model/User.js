import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
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
    return this.findOne({ username });
};

const User = mongoose.model('User', userSchema);

export default User;
