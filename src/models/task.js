const mongose = require('mongoose')

const taskSchema = new mongose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongose.model('Task', taskSchema)

module.exports = Task