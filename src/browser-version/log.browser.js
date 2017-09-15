'use strict';

function Log(userOptions) {
    const baseOptions = {
            level: 0, // info
            logMethods: ['debug', 'info', 'warning', 'error', 'critical'],
            transport(logObject) {
                console.log(logObject);
            },
        },
        _level = new Symbol();

    const options = userOptions ? userOptions : baseOptions;

    this[_level] = options.level;

    const message = args.join(' + ');

    options.logMethods.forEach((method, index) => {
        if (index >= this[_level]) {
            options.transport(message);
        }
    }).bind(this);
}

export { Log };