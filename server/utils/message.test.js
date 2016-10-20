var expect = require("expect");

var {generateMessage} = require('./message');

describe('generatemessage', () => {
    it('should generate correct message object', () => {
        var from = "sender Bob";
        var text = "don't make me come over there";
        var msgObj = generateMessage(from, text);

        expect(msgObj.createdAt).toBeA("number");
        expect(msgObj).toInclude({from, text});
    });
});