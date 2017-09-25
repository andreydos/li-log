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

        for(let i in obj) {
            if(typeof(obj[i])==="object" && obj[i] !== null)
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
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

export {
    mergeOptions
}