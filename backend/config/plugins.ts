export default () => ({
    'marketing-metrics': {
        enabled: true,
        resolve: './src/plugins/marketing-metrics'
    },
    'structured-data-generator': {
        enabled: true,
        resolve: './src/plugins/structured-data-generator',
    },
    communications: {
    enabled: true,
    resolve: './src/plugins/communications',
    },
});
