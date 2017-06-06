import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/main/client/app/main-aot.js',
    format: 'iife',
    plugins: [
        nodeResolve({ jsnext: true, main: true, module: true }),
        commonjs({
            include: ['node_modules/rxjs/**']
        })
    ],
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') { return; }

        // console.warn everything else
        console.warn(warning.message);
    }
};