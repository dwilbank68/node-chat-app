var socket = io();
socket
    .on('connect', function() {
        console.log('connected to server');
    })
    .on('disconnect',  function() {
        console.log('disconnected from server');
    })
    .on('newMessage', function (msg) {
        console.log('new msg', msg);
        var $li = $('<li></li>');
        $li.text(`${msg.from}: ${msg.text}`);
        $('#messages').append($li);
    })

$('#message-form')
    .on('submit', function(e){
        e.preventDefault();
        socket.emit(
            'createMessage',
            { from: 'User', text: $('[name=message]').val() },
            function(){  }
        )
    })