import DateTimeFormat from 'format-date-time';
import utils from './utils';

// default browser text styles
const browserConsoleStyles = {
    debug: 'font-browserStyle: italic; color: #1B2B34;',
    info: 'color: #6699CC;',
    warning: 'font-weight: bold; color: #AB7967;',
    error: 'font-weight: bold; color: #E24825;',
    critical: 'font-weight: bold; color: #FAFAFA; padding: 3px; background: linear-gradient(#D33106, #571402);',
};

function Log(userOptions) {
    const { isBrowser, isNode, mergeOptions } = utils;
    let dateTimeFormatter;
    if (isNode) {
        dateTimeFormatter = new DateTimeFormat('HH:mm:ss');
    }
    const baseOptions = {
        level: 1, // info as default
        coloredOutput: true,
        logMethods: [
            {
                name: 'debug',
                level: 0,
                browserStyle: browserConsoleStyles.debug,
            },
            {
                name: 'info',
                level: 1,
                browserStyle: browserConsoleStyles.info,
            },
            {
                name: 'warning',
                level: 2,
                browserStyle: browserConsoleStyles.warning,
            },
            {
                name: 'error',
                level: 3,
                browserStyle: browserConsoleStyles.error,
            },
            {
                name: 'critical',
                level: 4,
                browserStyle: browserConsoleStyles.critical,
            },
        ],
        transport: [
            function finalLog(data) {
                if (isBrowser) {
                    if (baseOptions.coloredOutput) {
                        console.log(data.message, data.browserStyle);
                    } else {
                        console.log(data.message);
                    }
                } else {
                    console.log(data.message);
                }
            },
        ],
    };

    let options = baseOptions;
    let loggerDisabled = false;

    if (typeof userOptions === 'object') {
        options = mergeOptions(baseOptions, userOptions);
    } else if (typeof userOptions === 'string' && userOptions === 'no-color') {
        baseOptions.coloredOutput = false;
    }

    function log(logOptions, methodInfo, args) {
        if (loggerDisabled || methodInfo.level < logOptions.level) return;

        let message;

        if (isNode) {
            message = `${dateTimeFormatter.now()} <${methodInfo.name}> ${args}`;
        } else {
            message = `${utils.getTime()} <${methodInfo.name}> ${args}`;
        }


        if (logOptions.coloredOutput) {
            if (isBrowser) {
                message = `%c${message}`;
            } else if (isNode) {
                message = `${message}`;
            }
        }

        const data = {
            message,
            browserStyle: methodInfo.browserStyle,
            nodeStyle: methodInfo.nodeStyle,
        };

        logOptions.transport.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(data);
            } else {
                throw new Error('Transport item not a function');
            }
        });
    }

    options.logMethods.forEach((methodInfo) => {
        if (methodInfo.level >= options.level) {
            this[methodInfo.name] = (...args) => log(options, methodInfo, args);
        } else {
            this[methodInfo.name] = () => {};
        }
    });

    this.setLevel = (level) => {
        if (Number.isInteger(level)) {
            options.level = level;
        } else if (typeof level === 'string') {
            const methods = options.logMethods.filter(method => method.name === level);
            if (Array.isArray(methods) && methods.length) {
                options.level = methods[0].level;
            }
        } else {
            console.log(`setLevel() level ${level} was not found in LiLog instance`);
        }
    };

    this.disable = () => {
        loggerDisabled = true;
    };
}

export { Log as default };
