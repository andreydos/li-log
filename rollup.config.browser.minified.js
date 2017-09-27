import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default {
    output: {
        format: 'umd',
        file: 'dist/liLog.browser.min.js',
        sourceMap: true
    },
    name: 'LiLog',
    input: 'src/browser.js',
    plugins: [
        babel({
            exclude: ['node_modules/**']
        }),
        minify({
            comments: false
        })
    ]
};