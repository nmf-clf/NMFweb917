//用React的语法解析文件
import React from 'react'; // const React = require('react')

//ReactDOM就是用来把组件挂载到DOM节点上
import ReactDOM from 'react-dom';

//注意:自己定义的组件必须首字母大写
import App from './App'

ReactDOM.render(<App />,document.getElementById('root'))