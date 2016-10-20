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
    .on('newLocationMessage', function(locMsg){
        var $li = $('<li></li>');
        var $a = $('<a target="_blank">My current location</a>');
        $li.text(`${locMsg.from}: `);
        $a.attr('href', locMsg.url);
        $li.append($a);
        $('#messages').append($li);
    })

$('#message-form')
    .on('submit', function(e){
        e.preventDefault();
        var $msgTextbox = $('[name=message]');

        socket.emit(
            'createMessage',
            { from: 'User', text: $msgTextbox.val() },
            function(){ $msgTextbox.val('') }
        )
    })

var $locationButton = $('#send-location');

$locationButton
    .on('click', function(){
        if(!navigator.geolocation) {
            return alert('geolocation not supported by your browser');
        }

        $locationButton
            .attr('disabled','disabled')
            .text('Sending location...')

        navigator
            .geolocation
            .getCurrentPosition(
                function (position) {
                    $locationButton
                        .removeAttr('disabled')
                        .text('Send location...');

                    socket
                        .emit(
                            'createLocationMessage',
                            { latitude: position.coords.latitude,
                            longitude: position.coords.longitude }
                        );
                },
                function () {
                    $locationButton
                        .removeAttr('disabled')
                        .text('Send location...');
                    alert('unable to fetch location')
                }
            )
    })