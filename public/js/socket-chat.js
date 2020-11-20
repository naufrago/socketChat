var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('el nombre y sala son necesario');
}


var usuario = params.get('nombre');
var sala = params.get('sala');

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // activa cuando una persona entra al chat
    socket.emit('entrarChat', { nombre: usuario, sala }, function(res) {
        console.log('usuarios conectados ', res);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información  para mostra mensajes
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar información para listar todas las personas
socket.on('listaPersonas', function(personas) {

    console.log('listaPersonas:', personas);

});

//mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
})