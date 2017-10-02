import babel from 'rollup-plugin-babel';
import builtinModules from "builtin-modules"

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

export default {
    output: {
        format: 'umd',
        file: 'dist/li-log.js'
    },
    name: 'LiLog',
    input: 'src/index.js',
    plugins: [
        babel({
            exclude: ['node_modules/**']
        })
    ],
    external,
    globals: {
        'format-date-time': 'format-date-time'
    }
};