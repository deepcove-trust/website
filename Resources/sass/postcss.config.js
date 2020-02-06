module.exports = ({ options }) => {
    const plugins = [];
    if (options.env === 'production') plugins.push(require('cssnano'));
    plugins.push(require('postcss-preset-env'))
    return {
        plugins: plugins
    };
};