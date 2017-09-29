import * as utils from './utils';

// default browser text styles
const browserConsoleStyles = {
    debug: "font-browserStyle: italic; color: #1B2B34;",
    info: "color: #6699CC;",
    warning: "font-weight: bold; color: #AB7967;",
    error: "font-weight: bold; color: #E24825;",
    critical: "font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);"
};

function Log(userOptions) {
    const {isBrowser, isNode, mergeOptions} = utils,
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
                    if (isBrowser) {
                        console.log(data.message, data.browserStyle);
                    }
                    if (isNode) {
                        console.log(data.message);
                    }
                }
            ],
        };

    const options = userOptions ? mergeOptions(baseOptions, userOptions) : baseOptions;

    let loggerDisabled = false;

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

    this.disable = function () {
        loggerDisabled = true;
    };

    function log(options, methodInfo, args) {
        if (loggerDisabled || methodInfo.level < options.level) return;

        let message = `<${methodInfo.name}> ${args}`;

        if (isBrowser) {
            message = `%c${message}`;
        } else if (isNode) {
            message = `|li-log| ${message}`;
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

export { Log };