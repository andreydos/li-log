import babel from 'rollup-plugin-babel';

export default {
    output: {
        format: 'umd',
        file: 'dist/li-log.browser.js'
    },
    name: 'LiLog',
    input: 'src/browser.js',
    plugins: [
        babel({
            exclude: ['node_modules/**']
        })
    ]
};