var expect = require("expect");

var {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var nonStr = 464;
        expect(isRealString(nonStr)).toBe(false);
    });
    it('should reject strings with only spaces', () => {
        var spacyStr = " ";
        expect(isRealString(spacyStr)).toBe(false);
    });
    it('should allow string with non-space characters', () => {
        var realStr = "8ui  3kj&^%   ";
        expect(isRealString(realStr)).toBe(true);
    });
});

