var socket = io();
socket
    .on('connect', function() {
        console.log('connected to server');
    })
    .on('disconnect',  function() {
        console.log('disconnected from server');
    })
    .on('newMessage', function (msg) {
        var formattedTime = moment(msg.createdAt).format('h:mm a');
        var $source = $('#message-template').html();
        var template = Handlebars.compile($source);
        var html = template({
            text: msg.text,
            from: msg.from,
            createdAt: formattedTime
        })
        $('#messages').append(html);
    })
    .on('newLocationMessage', function(msg){
        var formattedTime = moment(msg.createdAt).format('h:mm a');
        var $source = $('#location-message-template').html();
        var template = Handlebars.compile($source);
        var html = template({
            url: msg.url,
            from: msg.from,
            createdAt: formattedTime
        })
        $('#messages').append(html);
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