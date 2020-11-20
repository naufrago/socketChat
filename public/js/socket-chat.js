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
        renderizarUsuarios(res, false)
            // renderizarMensaje({ nombre: 'Admin', mensaje: `${usuario} Ingreso al Chat`, fecha: `${new Date().getTime()}` });
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});




// Escuchar información  para mostra mensajes
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);
    renderizarMensaje(mensaje, false);
    scrollBottom();


});

// Escuchar información para listar todas las personas
socket.on('listaPersonas', function(personas) {

    console.log('listaPersonas:', personas);
    renderizarUsuarios(personas)

});

//mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
})