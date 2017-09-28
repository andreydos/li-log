import babel from 'rollup-plugin-babel';

export default {
    output: {
        format: 'umd',
        file: 'index.js'
    },
    name: 'LiLog',
    input: 'src/index.js',
    plugins: [
        babel({
            exclude: ['node_modules/**']
        })
    ]
};