var socket = io();

function scrollToBottom () {
    // selectors

    var $messages = $('#messages');
    var $latestMessage = $messages.children('li:last-child');

    // heights

    var clientHeight = $messages.prop('clientHeight');
    var scrollTop = $messages.prop('scrollTop');
    var scrollHeight = $messages.prop('scrollHeight');
    var latestMsgHeight = $latestMessage.innerHeight();
    var prevMsgHeight = $latestMessage.prev().innerHeight();

    if (clientHeight + scrollTop + latestMsgHeight + prevMsgHeight >= scrollHeight) {
        $messages.scrollTop(scrollHeight);
    }
}

socket
    .on('connect', function() {
        var params = $.deparam(window.location.search);

        socket.emit('join', params, function(err){
            if (err) {
                alert(err);
                window.location.href = '/';
            } else {
                console.log('no error');
            }
        });
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
        scrollToBottom();
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
        scrollToBottom();
    })
    .on('updateUserList', function(users){
        var $ol = $('<ol></ol>');
        users.forEach(function(user){
            $ol.append($('<li></li>').text(user));
        })
        $('#users').html($ol);
        console.log('users',users);
    })
    .on('disconnect',  function() {
        console.log('disconnected from server');
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