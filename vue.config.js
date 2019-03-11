module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 10000,
        proxy: {
            //   '/admin': {
            '/admin': {
              target: 'https://www.4kb.cn',  // 请求本地 需要xboot后台项目
               // target:'http://kuang.4kb.cn',
                //  target:'http://www.pay.com/index.php',
                ws: true
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码        wxa00a53a6966dfc24
    productionSourceMap: false
}