'use strict';

import { Log } from './log.browser.js';

export function toConsole(options) {
    return new Log(options);
}