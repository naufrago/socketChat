var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');




// referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');



// funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    console.log(personas);
    let html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (let index = 0; index < personas.length; index++) {
        html += '<li>';
        html += '<a  data-id="' + personas[index].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[index].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

// escuchas de los click en la lista de  usuarios
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }

});

// escucha el envio de el form de enviar mensaje
formEnviar.on('submit', function(e) {
    // evita que se  recargue la pagina
    e.preventDefault();
    // captura el valor del input del mensaje
    let mensaje = txtMensaje.val();
    if (mensaje.trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje
    }, function(resp) {
        console.log('respuesta server: ', resp);
        // se renderiza el mensaje
        renderizarMensaje(resp, true);
        txtMensaje.val('').focus();
        scrollBottom();
    });
});

function renderizarMensaje(mensaje, yo) {
    var html = '';
    console.log(mensaje.fecha);
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes() + '    ' + fecha.getSeconds() + 'seg';

    var adminClass = 'info';
    if (mensaje.nombre === 'Admin') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li>';
        if (mensaje.nombre !== 'Admin') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';

        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }




    // se crear el html y se agrega
    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}