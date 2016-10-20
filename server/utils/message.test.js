var expect = require("expect");

var {generateMessage, generateLocationMessage} = require('./message');

describe('generatemessage', () => {
    it('should generate correct message object', () => {
        var from = "sender Bob";
        var text = "don't make me come over there";
        var msgObj = generateMessage(from, text);

        expect(msgObj.createdAt).toBeA("number");
        expect(msgObj).toInclude({from, text});
    });
});

describe('generateLocationmessage', () => {
    it('should generate correct location message object', () => {
        var from = "Cookoo";
        var coords = {
            latitude:24,
            longitude:100
        };
        var url = `https://www.google.com/maps?q=24,100`;
        var msgObj = generateLocationMessage(from, coords);

        expect(msgObj.createdAt).toBeA("number");
        expect(msgObj).toInclude({from, url});
    });
});