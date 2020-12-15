module.exports = {
    filenameHashing:false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://sherp.cn/api',
                changeOrigin:true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    productionSourceMap:false
}
