// models/ActivityLog.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema({
    // ID Pengguna yang melakukan tindakan
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        // Ini asumsikan Anda punya koleksi 'User'
        // ref: 'User' 
    },
    // ID Tugas yang terpengaruh
    taskId: {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: 'Task'
    },
    // ID Proyek (opsional, untuk filtering)
    projectId: {
        type: Schema.Types.ObjectId,
        required: false,
        // ref: 'Project'
    },
    // Jenis tindakan (Contoh: 'TASK_CREATED', 'STATUS_UPDATED')
    actionType: {
        type: String,
        required: true,
        enum: ['TASK_CREATED', 'STATUS_UPDATED', 'DUE_DATE_CHANGED', 'ASSIGNEE_CHANGED', 'DETAILS_UPDATED']
    },
    // Deskripsi singkat yang mudah dibaca (e.g., "mengubah status ke Done")
    description: {
        type: String,
        required: true
    },
    // Detail tambahan (e.g., nilai lama dan nilai baru)
    details: {
        type: Object, // Menggunakan Object untuk menyimpan data JSON
        required: false
    }
}, { 
    timestamps: true // Otomatis menambahkan 'createdAt' dan 'updatedAt'
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema, 'activity_logs');