var path=require('path');

module.exports = {
    entry: {
        lambda: path.join(__dirname,'src','app.ts'),
        lambda_test: path.join(__dirname,'src','lambda_test.ts'),
        device_list: path.join(__dirname,'src','list_devices.ts'),
        s3_setup: path.join(__dirname,'src','s3_setup.ts'),
        publish_lambda: path.join(__dirname,'src','publish_lambda.ts')
    },
    externals: {'aws-sdk': 'aws-sdk'},
    output: {
        path: path.resolve(__dirname, 'build'),
        filename:  '[name].js',
        libraryTarget: "commonjs2"
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