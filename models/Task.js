const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    projectId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'Project' 
    },
    status: { 
        type: String, 
        default: 'To Do', 
        enum: ['To Do', 'In Progress', 'Done', 'Review'] 
    },
    assigneeId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    ownerId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    dueDate: { type: Date },
}, { 
    timestamps: true // createdAt & updatedAt otomatis
});

module.exports = mongoose.model('Task', TaskSchema);
