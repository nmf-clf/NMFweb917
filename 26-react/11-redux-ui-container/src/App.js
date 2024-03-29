/*
* @Author: TomChen
* @Date:   2018-08-16 17:14:09
* @Last Modified by:   TomChen
* @Last Modified time: 2018-08-20 15:48:59
*/
import React,{ Component } from 'react';

import { Input,Button,Row,Col,List } from 'antd';

import store from './store';

import { chageValueAction,addItemAction,deleteItemAction } from './store/actionCreator.js'

import AppUI from './AppUI.js'
//引入css
import './App.css';

//处理业务逻辑 - 容器组件
class App extends Component{
	constructor(props){
		super(props);
		//从store中获取初始化数据
		this.state = store.getState();
		
		//当store里面的state发送改变时执行subscribe里面的函数
		store.subscribe(()=>{
			this.setState(store.getState())
		});
		this.handleChange = this.handleChange.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}
	handleChange(e){
		const action = chageValueAction(e.target.value)
		store.dispatch(action)
	}
	handleAdd(){
		const action = addItemAction();
		store.dispatch(action);
	}
	handleDelete(index){
		const action = deleteItemAction(index);
		store.dispatch(action)
	}
	render(){
		return(
			<AppUI
				value = {this.state.value}
				list = {this.state.list}
				handleChange = {this.handleChange}
				handleAdd = {this.handleAdd}
				handleDelete = {this.handleDelete}
			 />
		)
	}
}
export default App;