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





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

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
        var key = keys[j - 1];
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
        var key = keys[i - 1];

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

function pad(val) {
    var length = 2;
    var value = String(val);

    while (value.length < length) {
        value = '0' + val;
    }
    return value;
}

function getTime() {
    var date = new Date();
    var hours = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());

    return hours + ':' + minutes + ':' + seconds;
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

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
var stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

function Log(userOptions) {
    var _this = this;

    var isBrowser = utils.isBrowser,
        isNode = utils.isNode,
        mergeOptions = utils.mergeOptions;

    var baseOptions = {
        level: 1, // info as default
        coloredOutput: true,
        outputMethodOnly: [],
        showStackData: true,
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
        var stackInfo = '';
        var stack = {
            method: '',
            line: '',
            file: ''
        };

        if (logOptions.showStackData) {
            var stackMessage = new Error().stack.split('\n').slice(3);
            var stackDataString = stackMessage[0];
            var stackData = stackReg.exec(stackDataString) || stackReg2.exec(stackDataString);

            if (stackData && stackData.length === 5) {
                var _stackData = slicedToArray(stackData, 4),
                    msg = _stackData[0],
                    method = _stackData[1],
                    path = _stackData[2],
                    line = _stackData[3];

                stack.message = msg;
                stack.method = method;
                stack.path = path;
                stack.line = line;
                stack.file = stack.path.split(/[\\/]/).pop();
                stack.stack = stackMessage.join('\n');
            }

            if (stack.method) {
                stackInfo = ' | Message from: ' + stack.file + ' at ' + stack.method + '() line:' + stack.line;
            } else {
                stackInfo = ' | Message from: ' + stack.file + ' at line:' + stack.line;
            }
        }

        if (isNode) {
            message = dateTimeFormatter.now() + ' <' + methodInfo.name + '> ' + args + stackInfo;
        } else {
            message = utils.getTime() + ' <' + methodInfo.name + '> ' + args + stackInfo;
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
        if (methodInfo.level >= (options.level || 0)) {
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
