// models/Dispositivo.js
const TipoDato = require('./TipoDato');

class Dispositivo {
    constructor(id, nombre, usuario, tipoDatos) {
        this.id = id;
        this.nombre = nombre;
        const [userId, userName, userLevel] = usuario.split(',');
        this.usuario = {
            id: userId,
            nombre: userName,
            nivel: parseInt(userLevel)
        };
        this.tipoDatos = tipoDatos.map(dato => new TipoDato(dato.nombre, dato.unidad, dato.tipo));
    }
}

module.exports = Dispositivo;
