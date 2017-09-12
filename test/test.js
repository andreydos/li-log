'use strict';

var expect = require('chai').expect;
var logger = require('../index');

describe('#logger initial test', function() {
    it('should convert string to uppercase and prepend with LOG word', function() {
        var result = logger ('test');
        expect(result).to.equal('LOG TEST');
    });
});