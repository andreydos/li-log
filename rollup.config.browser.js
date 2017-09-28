import babel from 'rollup-plugin-babel';

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
    ]
};