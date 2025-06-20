const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (config) => {
            config.resolve.fallback = {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer/'),
            };
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                })
            );
            return config;
        },
    },
};
