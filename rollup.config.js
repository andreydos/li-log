import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
// import formatterFriendly from 'eslint-friendly-formatter';
import builtinModules from "builtin-modules"

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

export default {
    output: {
        format: 'umd',
        file: 'index.js'
    },
    name: 'LiLog',
    input: 'src/index.js',
    plugins: [
        // eslint({
        //     exclude: ['node_modules/**'],
        //     include: 'src/**/*.js',
        //     throwOnError: true,
        //     formatter: formatterFriendly
        // }),
        babel({
            exclude: ['node_modules/**']
        })
    ],
    external,
    globals: {
        'format-date-time': 'format-date-time'
    }
};