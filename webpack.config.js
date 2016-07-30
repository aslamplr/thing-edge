require('webpack');
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;
const config = {
    entry: './client/app.jsx',
    output: {
        path: './client/bin',
        filename: 'app.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: '/node_modules/',
            loader: 'babel-loader?presets[]=react,presets[]=es2015'
        }, {
            test: require.resolve("react"),
            loader: "expose?React"
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    node: {
        console: true
    }
}

module.exports = config;
