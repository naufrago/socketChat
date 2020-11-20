const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuario = new Usuarios();

io.on('connection', (client) => {


    client.on('entrarChat', (data, callback) => {
        // console.log(data, ' Conectado');
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'el nombre/sala de necesario'
            })
        }
        // lo une a la sala 
        client.join(data.sala)

        // crear el usuario y agregarlo al arreglo
        let personas = usuario.agregarPersona(client.id, data.nombre, data.sala);
        // console.log(personas);
        // emite el mensaje a la sala donde se unio la persona
        client.broadcast.to(data.sala).emit('listaPersonas', usuario.getPersonasPorSala(data.sala));
        // / hace el collback con el arreglo de los usuarios en la sala
        callback(usuario.getPersonasPorSala(data.sala));
    });


    client.on('disconnect', () => {
        let personaBorrada = usuario.borraPersona(client.id);
        // console.log(personaBorrada);
        // emite el mensaje en la sala donde estaba la persona
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salio del chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuario.getPersonasPorSala(personaBorrada.sala));
    })

    client.on('crearMensaje', (data) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        // emite el mensaje en la sala donde esta la persona
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })


    // mensajes privados

    client.on('mensajePrivado', data => {
        let persona = usuario.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })



});