# User Model Documentation

## Overview

This file (`server/model/User.js`) defines the Mongoose schema and model for the User entity in the
project management application. It includes various methods for user authentication, project and
task management, and preference updates.

## Schema Definition

The `userSchema` defines the structure of a user document in the MongoDB database:

-   `email`: String (required, unique)
-   `password`: String (required, hashed)
-   `name`: String (unique)
-   `role`: String (enum: 'user', 'admin', 'developer', 'project_manager', default: 'user')
-   `projects`: Array of ObjectIds referencing Project documents
-   `tasks`: Array of ObjectIds referencing Task documents
-   `createdAt`: Date (default: current date)
-   `updatedAt`: Date (default: current date)
-   `lastLogin`: Date
-   `preferences`: Object
    -   `theme`: String (default: 'light')
    -   `language`: String (default: 'en')
    -   `notifications`: Boolean (default: true)

## Methods

### Pre-save Hook

```javascript
userSchema.pre('save', async function (next) { ... }
```

This hook runs before saving a user document. It hashes the password if modified and updates the
`updatedAt` timestamp.

### Instance Methods

#### comparePassword

```javascript
userSchema.methods.comparePassword = async function (candidatePassword) { ... }
```

Compares a candidate password with the stored hashed password.

-   **Parameters**: `candidatePassword` (String)
-   **Returns**: Promise<Boolean>

#### addProject

```javascript
userSchema.methods.addProject = function (projectId) { ... }
```

Adds a project to the user's projects array if not already present.

-   **Parameters**: `projectId` (ObjectId)
-   **Returns**: Promise<User>

#### removeProject

```javascript
userSchema.methods.removeProject = function (projectId) { ... }
```

Removes a project from the user's projects array.

-   **Parameters**: `projectId` (ObjectId)
-   **Returns**: Promise<User>

#### addTask

```javascript
userSchema.methods.addTask = function (taskId) { ... }
```

Adds a task to the user's tasks array if not already present.

-   **Parameters**: `taskId` (ObjectId)
-   **Returns**: Promise<User>

#### removeTask

```javascript
userSchema.methods.removeTask = function (taskId) { ... }
```

Removes a task from the user's tasks array.

-   **Parameters**: `taskId` (ObjectId)
-   **Returns**: Promise<User>

#### updatePreferences

```javascript
userSchema.methods.updatePreferences = function (preferences) { ... }
```

Updates the user's preferences.

-   **Parameters**: `preferences` (Object)
-   **Returns**: Promise<User>

#### updateLastLogin

```javascript
userSchema.methods.updateLastLogin = function () { ... }
```

Updates the user's last login timestamp.

-   **Returns**: Promise<User>

### Static Methods

#### findByEmail

```javascript
userSchema.statics.findByEmail = function (email) { ... }
```

Finds a user by their email address.

-   **Parameters**: `email` (String)
-   **Returns**: Promise<User|null>

#### findByUsername

```javascript
userSchema.statics.findByUsername = function (username) { ... }
```

Finds a user by their username.

-   **Parameters**: `username` (String)
-   **Returns**: Promise<User|null>

## Usage Examples

```javascript
// Create a new user
const newUser = new User({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'developer'
});
await newUser.save();

// Find a user by email
const user = await User.findByEmail('user@example.com');

// Compare password
const isMatch = await user.comparePassword('password123');

// Add a project to the user
await user.addProject(projectId);

// Update user preferences
await user.updatePreferences({ theme: 'dark', notifications: false });

// Update last login
await user.updateLastLogin();
```

## Role in the Project

This User model is a crucial part of the server-side implementation. It interacts with other models
like Project and Task, and is likely used in various parts of the application, including:

-   User authentication and authorization
-   Project management features
-   Task assignment and tracking
-   User preference management

The model provides a robust structure for managing user data and relationships within the project
management application.
