const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const publicPath = "/";

//生成HtmlWebpackPlugin 配置
const getHtmlConfig = (name,title)=>({
    template:'./src/view/'+name+'.html',
    filename:name+'.html',
    title:title,
    inject:true,
    hash:true,
    chunks:['common',name]
})

//导出配置
module.exports = {
	//模式
    mode:'development',
	// mode:'production',
	//指定多入口文件
	entry:{
        'common':'./src/pages/common/index.js',
        'index':'./src/pages/index/index.js',
        'user-login':'./src/pages/user-login/index.js',
        'user-register':'./src/pages/user-register/index.js',
        'user-center':'./src/pages/user-center/index.js',
        'user-update-password':'./src/pages/user-update-password/index.js',
        'result':'./src/pages/result/index.js'
    },
    //配置额外模块
    externals:{
        'jquery':'window.jQuery'
    },      	
	//指定多出口
	output:{
		//出口文件名称
		filename:'js/[name].js',
        publicPath: publicPath,
		//出口文件存储路径
		path:path.resolve(__dirname,'dist')
	},
    //配置别名
    resolve:{
        alias:{
            pages:path.resolve(__dirname,'./src/pages'),
            util:path.resolve(__dirname,'./src/util'),
            service:path.resolve(__dirname,'./src/service'),
            node_modules:path.resolve(__dirname,'./node_modules'),
            common:path.resolve(__dirname,'./src/common')
        }
    },
	//配置loader
    module: {
        rules: [
            //处理css文档的loader
            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                    }
                  },
                  "css-loader"
                ]
            },
              //处理图片loader
            {
                test: /\.(png|jpg|gif|ttf|woff|woff2|eot|svg)\??.*$/,
                use: [
                  {
                    loader: 'url-loader',
                    options:{
                       limit:100,
                       name:'resource/[name].[ext]'
                    }
                  }
                ]

            },
            {
                test:/\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','es2015','stage-3'],               
                    }
                }               
            },
            {
                test:/\.tpl$/,
                use: {
                    loader: 'html-loader',
                }               
            }              
        ]
  },
  plugins: [
  	new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')), 
    new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')), 
    new HtmlWebpackPlugin(getHtmlConfig('result','返回结果')), 
    new HtmlWebpackPlugin(getHtmlConfig('user-center','用户中心')), 
    new HtmlWebpackPlugin(getHtmlConfig('user-update-password','修改密码')),        
  	new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
        filename:'css/[name].css'
    })
  ],
  devServer: {
    contentBase: './dist',
    port:3002,
    //historyApiFallback:true
    proxy:{
        "/user":{
            target: 'http://127.0.0.1:3000',  //目标接口域名
            changeOrigin: true,  //是否跨域
        }
    }
  }
}