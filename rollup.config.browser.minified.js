import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import builtinModules from "builtin-modules"

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

export default {
    output: {
        format: 'umd',
        file: 'dist/li-log.min.js',
        sourcemap: true
    },
    name: 'LiLog',
    input: 'src/index.js',
    plugins: [
        babel({
            exclude: ['node_modules/**']
        }),
        minify({
            comments: false
        })
    ],
    external,
    globals: {
        'format-date-time': 'format-date-time'
    }
};