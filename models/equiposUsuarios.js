const { Schema, model } = require('mongoose');

const EquiposUsuariosSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    equipo: {
        type: Schema.Types.ObjectId,
        ref: 'Equipos'
    },
});


EquiposUsuariosSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('EquiposUsuarios', EquiposUsuariosSchema);