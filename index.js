(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('format-date-time')) :
	typeof define === 'function' && define.amd ? define(['format-date-time'], factory) :
	(global.LiLog = factory(global['format-date-time']));
}(this, (function (DateTimeFormat) { 'use strict';

DateTimeFormat = DateTimeFormat && DateTimeFormat.hasOwnProperty('default') ? DateTimeFormat['default'] : DateTimeFormat;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function copyDeep(baseObj) {
    function cloneObject(obj) {
        var clone = {};
        var objKeys = Object.keys(obj);
        var i = objKeys.length;

        while (i) {
            var key = objKeys[i];

            if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
                clone[key] = cloneObject(obj[key]);
            } else {
                clone[key] = obj[key];
            }

            i -= 1;
        }

        return clone;
    }

    var newObj = {};
    var keys = Object.keys(baseObj);

    var j = keys.length;

    while (j) {
        var key = keys[j];
        var current = baseObj[key];

        if (Array.isArray(current)) {
            newObj[key] = current.slice(0);
        } else if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) === 'object') {
            newObj[key] = cloneObject(current);
        } else {
            newObj[key] = current;
        }

        j -= 1;
    }

    return newObj;
}

function mergeOptions(baseOptions, userOptions) {
    var resultOptions = copyDeep(baseOptions);
    var keys = Object.keys(userOptions);

    var i = keys.length;

    while (i) {
        var key = keys[i];

        resultOptions[key] = userOptions[key];

        i -= 1;
    }

    return resultOptions;
}

var isBrowser = function () {
    try {
        return Boolean(window);
    } catch (e) {
        return false;
    }
}();

var isNode = function () {
    try {
        return Boolean(global);
    } catch (e) {
        return false;
    }
}();

function getTime() {
    var date = new Date();
    var hours = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());

    return hours + ':' + minutes + ':' + seconds;
}

function pad(val) {
    var length = 2;
    var value = String(val);

    while (value.length < length) {
        value = '0' + val;
    }
    return value;
}

var utils = {
    mergeOptions: mergeOptions,
    isBrowser: isBrowser,
    isNode: isNode,
    getTime: getTime
};

// default browser text styles
var browserConsoleStyles = {
    debug: 'font-browserStyle: italic; color: #1B2B34;',
    info: 'color: #6699CC;',
    warning: 'font-weight: bold; color: #AB7967;',
    error: 'font-weight: bold; color: #E24825;',
    critical: 'font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);'
};

function Log(userOptions) {
    var _this = this;

    var isBrowser = utils.isBrowser,
        isNode = utils.isNode,
        mergeOptions = utils.mergeOptions;

    var baseOptions = {
        level: 1, // info as default
        coloredOutput: true,
        outputMethodOnly: [],
        logMethods: [{
            name: 'debug',
            level: 0,
            browserStyle: browserConsoleStyles.debug
        }, {
            name: 'info',
            level: 1,
            browserStyle: browserConsoleStyles.info
        }, {
            name: 'warning',
            level: 2,
            browserStyle: browserConsoleStyles.warning
        }, {
            name: 'error',
            level: 3,
            browserStyle: browserConsoleStyles.error
        }, {
            name: 'critical',
            level: 4,
            browserStyle: browserConsoleStyles.critical
        }],
        transport: [function finalLog(data) {
            if (isBrowser) {
                if (baseOptions.coloredOutput) {
                    console.log(data.message, data.browserStyle);
                } else {
                    console.log(data.message);
                }
            } else {
                console.log(data.message);
            }
        }]
    };
    var dateTimeFormatter = void 0;
    var options = baseOptions;
    var loggerDisabled = false;

    if (isNode) {
        dateTimeFormatter = new DateTimeFormat('HH:mm:ss');
    }

    if ((typeof userOptions === 'undefined' ? 'undefined' : _typeof(userOptions)) === 'object') {
        options = mergeOptions(baseOptions, userOptions);
    } else if (typeof userOptions === 'string' && userOptions === 'no-color') {
        baseOptions.coloredOutput = false;
    }

    function log(logOptions, methodInfo, args) {
        if (loggerDisabled || methodInfo.level < logOptions.level || logOptions.outputMethodOnly.length && !logOptions.outputMethodOnly.includes(methodInfo.name)) return;

        var message = void 0;

        if (isNode) {
            message = dateTimeFormatter.now() + ' <' + methodInfo.name + '> ' + args;
        } else {
            message = utils.getTime() + ' <' + methodInfo.name + '> ' + args;
        }

        if (logOptions.coloredOutput) {
            if (isBrowser) {
                message = '%c' + message;
            } else if (isNode) {
                message = '' + message;
            }
        }

        var data = {
            message: message,
            browserStyle: methodInfo.browserStyle,
            nodeStyle: methodInfo.nodeStyle
        };

        logOptions.transport.forEach(function (fn) {
            if (typeof fn === 'function') {
                fn(data);
            } else {
                throw new Error('Transport item not a function');
            }
        });
    }

    options.logMethods.forEach(function (methodInfo) {
        if (methodInfo.level >= options.level) {
            _this[methodInfo.name] = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return log(options, methodInfo, args);
            };
        } else {
            _this[methodInfo.name] = function () {};
        }
    });

    this.setLevel = function (level) {
        if (Number.isInteger(level)) {
            options.level = level;
        } else if (typeof level === 'string') {
            var methods = options.logMethods.filter(function (method) {
                return method.name === level;
            });

            if (Array.isArray(methods) && methods.length) {
                options.level = methods[0].level;
            }
        } else {
            console.log('setLevel() level ' + level + ' was not found in LiLog instance');
        }
    };

    this.disable = function () {
        loggerDisabled = true;
    };

    this.outputOnly = function (methods) {
        if (Array.isArray(methods)) {
            options.outputMethodOnly = methods;
        } else if (typeof methods === 'string') {
            options.outputMethodOnly = [methods];
        }
    };

    this.disableOutputOnlyOption = function () {
        options.outputMethodOnly = [];
    };
}

return Log;

})));
