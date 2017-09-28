import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default {
    output: {
        format: 'umd',
        file: 'dist/li-log.min.js',
        sourceMap: true
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
    ]
};