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

const isBrowser = (new Function("try {return this===window;}catch(e){ return false;}"))();
const isNode = (new Function("try {return this===global;}catch(e){return false;}"))();




var utils = Object.freeze({
	mergeOptions: mergeOptions,
	isBrowser: isBrowser,
	isNode: isNode
});

// default browser text styles
const browserConsoleStyles = {
    debug: "font-browserStyle: italic; color: #1B2B34;",
    info: "color: #6699CC;",
    warning: "font-weight: bold; color: #AB7967;",
    error: "font-weight: bold; color: #E24825;",
    critical: "font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);"
};

function Log(userOptions) {
    const {isBrowser: isBrowser$$1, isNode: isNode$$1, mergeOptions: mergeOptions$$1} = utils,
        baseOptions = {
            level: 1, // info as default
            logMethods: [
                {
                    name: 'debug',
                    level: 0,
                    browserStyle: browserConsoleStyles.debug
                },
                {
                    name: 'info',
                    level: 1,
                    browserStyle: browserConsoleStyles.info
                },
                {
                    name: 'warning',
                    level: 2,
                    browserStyle: browserConsoleStyles.warning
                },
                {
                    name: 'error',
                    level: 3,
                    browserStyle: browserConsoleStyles.error
                },
                {
                    name: 'critical',
                    level: 4,
                    browserStyle: browserConsoleStyles.critical
                }
            ],
            transport: [
                function (data) {
                    if (isBrowser$$1) {
                        console.log(data.message, data.browserStyle);
                    }
                    if (isNode$$1) {
                        console.log(data.message);
                    }
                }
            ],
        };

    const options = userOptions ? mergeOptions$$1(baseOptions, userOptions) : baseOptions;

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
        if (methodInfo.level < options.level) return;

        let message = `${methodInfo.name} ${args}`;

        if (isBrowser$$1) {
            message = `%c${message}`;
        } else if (isNode$$1) {
            message = `NODEJS ${message}`;
        }

        const data = {
            message,
            browserStyle: methodInfo.browserStyle,
            nodeStyle: methodInfo.nodeStyle
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

export default Log;
