(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.LiLog = factory());
}(this, (function () { 'use strict';

function mergeOptions(baseOptions, userOptions) {
    "use strict";
    const resultOptions = copyDeep(baseOptions),
        keys = Object.keys(userOptions);

    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];

        resultOptions[key] = userOptions[key];
    }

    return resultOptions;
}

function copyDeep(baseObj) {
    function cloneObject(obj) {
        const clone = {};

        const objKeys = Object.keys(obj);

        for (let i = objKeys.length - 1; i >= 0; i--) {
            const key = objKeys[i];
            
            if(typeof(obj[key])==="object" && obj[key] !== null) {
                clone[key] = cloneObject(obj[key]);
            } else {
                clone[key] = obj[key];
            }
        }

        return clone;
    }

    const newObj = {},
        keys = Object.keys(baseObj);

    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i],
            current = baseObj[key];
        if (Array.isArray(current)) {
            newObj[key] = current.slice(0);
        } else if (typeof current === 'object') {
            newObj[key] = cloneObject(current);
        } else {
            newObj[key] = current;
        }
    }

    return newObj;
}

// default styles
const styles = {
    debug: "font-style: italic; color: #1B2B34;",
    info: "color: #6699CC;",
    warning: "font-weight: bold; color: #AB7967;",
    error: "font-weight: bold; color: #E24825;",
    critical: "font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);"
};

function Log(userOptions) {
    const baseOptions = {
            level: 1, // info as default
            logMethods: [
                {
                    name: 'debug',
                    level: 0,
                    style: styles.debug
                },
                {
                    name: 'info',
                    level: 1,
                    style: styles.info
                },
                {
                    name: 'warning',
                    level: 2,
                    style: styles.warning
                },
                {
                    name: 'error',
                    level: 3,
                    style: styles.error
                },
                {
                    name: 'critical',
                    level: 4,
                    style: styles.critical
                }
            ],
            transport: [
                function (data) {
                    console.log(data.text, data.style);
                }
            ],
        };

    const options = userOptions ? mergeOptions(baseOptions, userOptions) : baseOptions;

    options.logMethods.forEach((methodInfo) => {
        if (methodInfo.level >= options.level) {
            this[methodInfo.name] = function (...args) {
                return log(options, methodInfo, args);
            };
        } else {
            this[methodInfo.name] = function () {};
        }
    });

    this.setLevel = function (level) {
        if (Number.isInteger(level)) {
            options.level = level;
        } else if (typeof level === 'string') {
            const methods = options.logMethods.filter((method) => {
                return method.name === level;
            });
            if (Array.isArray(methods) && methods.length) {
                options.level = methods[0].level;
            }
        } else {
            console.log(`setLevel() level ${level} was not found in LiLog instance`);
        }
    };

    function log(options, methodInfo, args) {
        debugger;
        if (methodInfo.level < options.level) return;

        const data = {
            text: `%c${methodInfo.name} ${args}`,
            style: methodInfo.style
        };

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
//# sourceMappingURL=liLog.browser.js.map
