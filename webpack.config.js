var path=require('path');

module.exports = {
    entry: {
        lamda: path.join(__dirname,'src','app.ts'),
        lamda_test: path.join(__dirname,'src','lambda_test.ts'),
        device_list: path.join(__dirname,'src','list_devices.ts')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename:  '[name].js',
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'tslint-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },
    target: "node"
}