# li-log

[![Build Status](https://travis-ci.org/andreydos/li-log.svg?branch=master)](https://travis-ci.org/andreydos/li-log)
[![Coverage Status](https://coveralls.io/repos/github/andreydos/li-log/badge.svg?branch=master)](https://coveralls.io/github/andreydos/li-log?branch=master)

# Little Logger

Little tiny logger. Can be used in browser and node environment. Add useful data to message and some pretty styles in browser.

## Getting Started
**Browser usage** please look at examples directory (browser version available locally in project 'dist/li-log.min.js').

Browser minified version: [link](https://raw.githubusercontent.com/andreydos/li-log/master/dist/li-log.min.js) 

Use:
```
var logger = new LiLog();
logger.warning('Hello warning!');
```

**Node usage**:

* Define logger with default setting:

```
var liLog = require("li-log")

var logger = new liLog();

logger.info('Info');
```

* Define logger with custom setting (log level - 3. Methods: debug, info, warning will be skipped, messages with methods: error, critical will be printed in the console):


```
var liLog = require("li-log")

var logger = new liLog({ level: 3});

logger.info('Info'); // will be skipped
logger.error('Error) // you'll see in console
```

_Here will be described another setting options in the future._

* Disable color output(with user options):

```
var logger = new liLog({
    coloredOutput: false,
    ... otherOptions
});
```

or with single string argument 

```
var logger = new liLog('no-color');

```

* Disable stack info:

```
var logger = new liLog({ showStackData : false });
```

* Output only specified log methods:

```
logger.outputOnly(['critical']);

logger.disableOutputOnlyOption(); // to disable this feature
```

* Disable logger:

```
logger.disable();
```


## Running the tests

Run test:

```
npm run test
```

Run test on Windows machine

```
npm run testWin
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. 

## Authors

* **Andrii Dotsia** - *Initial work* - [andreydos](https://github.com/andreydos)

See also the list of [contributors](https://github.com/andreydos/li-log/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details