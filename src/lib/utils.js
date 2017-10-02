function copyDeep(baseObj) {
    function cloneObject(obj) {
        const clone = {};
        const objKeys = Object.keys(obj);
        let i = objKeys.length;

        while (i) {
            const key = objKeys[i];

            if (typeof (obj[key]) === 'object' && obj[key] !== null) {
                clone[key] = cloneObject(obj[key]);
            } else {
                clone[key] = obj[key];
            }

            i -= 1;
        }

        return clone;
    }

    const newObj = {};
    const keys = Object.keys(baseObj);

    let j = keys.length;

    while (j) {
        const key = keys[j];
        const current = baseObj[key];

        if (Array.isArray(current)) {
            newObj[key] = current.slice(0);
        } else if (typeof current === 'object') {
            newObj[key] = cloneObject(current);
        } else {
            newObj[key] = current;
        }

        j -= 1;
    }

    return newObj;
}

function mergeOptions(baseOptions, userOptions) {
    const resultOptions = copyDeep(baseOptions);
    const keys = Object.keys(userOptions);

    let i = keys.length;

    while (i) {
        const key = keys[i];

        resultOptions[key] = userOptions[key];

        i -= 1;
    }

    return resultOptions;
}

const isBrowser = (() => {
    try {
        return Boolean(window);
    } catch (e) {
        return false;
    }
})();

const isNode = (() => {
    try {
        return Boolean(global);
    } catch (e) {
        return false;
    }
})();

function getTime() {
    const date = new Date();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
}

function pad(val) {
    const length = 2;
    let value = String(val);

    while (value.length < length) {
        value = '0' + val;
    }
    return value;
}

const utils = {
    mergeOptions,
    isBrowser,
    isNode,
    getTime,
};

export default utils;
