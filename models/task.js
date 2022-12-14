const { Schema, model } = require('mongoose');

const TaskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    equipo: {
        type: Schema.Types.ObjectId,
        ref: 'Equipos'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    deadline: {
        type: Date,
        required: true
    },
});

TaskSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Task', TaskSchema);