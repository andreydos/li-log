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

export {
    mergeOptions
}