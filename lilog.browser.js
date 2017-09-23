(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LiLog = factory());
}(this, (function () { 'use strict';

function Log(userOptions) {
    const baseOptions = {
            level: 1, // debug
            logMethods: [
                {
                    name: 'debug',
                    level: 0
                },
                {
                    name: 'info',
                    level: 1
                },
                {
                    name: 'warning',
                    level: 2
                },
                {
                    name: 'error',
                    level: 3
                },
                {
                    name: 'critical',
                    level: 4
                }
            ],
            transport: [
                function (logObject) {
                    console.log(logObject);
                }
            ],
        };

    const options = userOptions ? userOptions : baseOptions;

    options.logMethods.forEach((methodInfo) => {
        if (methodInfo.level >= options.level) {
            this[methodInfo.name] = function (...args) {
                return log(options, methodInfo, args);
            };
        } else {
            this[methodInfo.name] = function () {};
        }
    });

    function log(options, methodInfo, args) {
        const data = `${methodInfo.name} ${args}`;

        // trans the final result
        options.transport.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(data);
            } else {
                throw new Error('Transport item not a function');
            }
        });

        return data;
    }
}

function toConsole(options) {
    return new Log(options);
}

Log.console = toConsole;

return Log;

})));
