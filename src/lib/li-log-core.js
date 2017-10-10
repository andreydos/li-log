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

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

function Log(userOptions) {
    const { isBrowser, isNode, mergeOptions } = utils;
    const baseOptions = {
        level: 1, // info as default
        coloredOutput: true,
        outputMethodOnly: [],
        showStackData: true,
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
    let dateTimeFormatter;
    let options = baseOptions;
    let loggerDisabled = false;

    if (isNode) {
        dateTimeFormatter = new DateTimeFormat('HH:mm:ss');
    }

    if (typeof userOptions === 'object') {
        options = mergeOptions(baseOptions, userOptions);
    } else if (typeof userOptions === 'string' && userOptions === 'no-color') {
        baseOptions.coloredOutput = false;
    }

    function log(logOptions, methodInfo, args) {
        if (loggerDisabled
            || methodInfo.level < logOptions.level
            || (logOptions.outputMethodOnly.length
                && !logOptions.outputMethodOnly.includes(methodInfo.name))) return;

        let message;
        let stackInfo = '';
        const stack = {
            method: '',
            line: '',
            file: '',
        };

        if (logOptions.showStackData) {
            const stackMessage = new Error().stack.split('\n').slice(3);
            const stackDataString = stackMessage[0];
            const stackData = stackReg.exec(stackDataString) || stackReg2.exec(stackDataString);

            if (stackData && stackData.length === 5) {
                const [msg, method, path, line] = stackData;
                stack.message = msg;
                stack.method = method;
                stack.path = path;
                stack.line = line;
                stack.file = stack.path.split(/[\\/]/).pop();
                stack.stack = stackMessage.join('\n');
            }

            if (stack.method) {
                stackInfo = ` | Message from: ${stack.file} at ${stack.method}() line:${stack.line}`;
            } else {
                stackInfo = ` | Message from: ${stack.file} at line:${stack.line}`;
            }
        }

        if (isNode) {
            message = `${dateTimeFormatter.now()} <${methodInfo.name}> ${args}${stackInfo}`;
        } else {
            message = `${utils.getTime()} <${methodInfo.name}> ${args}${stackInfo}`;
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
            this[methodInfo.name] = () => {
            };
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

    this.outputOnly = (methods) => {
        if (Array.isArray(methods)) {
            options.outputMethodOnly = methods;
        } else if (typeof methods === 'string') {
            options.outputMethodOnly = [methods];
        }
    };

    this.disableOutputOnlyOption = () => {
        options.outputMethodOnly = [];
    };
}

export { Log as default };
