//kQuery的基本结构是一个闭包
(function(window, undefined){
var 
	//kQuery的构造函数
	kQuery = function(selector){
		return new kQuery.fn.init(selector);
	};
//kQuery的原型对象
kQuery.fn = kQuery.prototype = {
	constructor:kQuery,
	//核心函数
	init:function(selector){
		selector = kQuery.trim(selector);
		//布尔值是假的情况返回空的jquery对象
		if(!selector){
			return this;
		}
		//如是函数的话返回有document的jquery对象,当页面所有的DOM节点加载完毕后执行传入的函数
		else if(kQuery.isFunction(selector)){
			document.addEventListener('DOMContentLoaded',function(){
				selector();
			});
			this[0] = document;
			this.length = 1;
		//处理字符串	
		}else if(kQuery.isString(selector)){
			//HTML代码处理
			if(kQuery.isHTML(selector)){
				var tmpDom = document.createElement('div');
				tmpDom.innerHTML = selector;
				// console.log(tmpDom.children);
				/*
				for(var i = 0;i<tmpDom.children.length;i++){
					this[i] =  tmpDom.children[i];
				}
				this.length = tmpDom.children.length;
				*/
				[].push.apply(this,tmpDom.children);
			//选择器处理	
			}else{
				var doms = document.querySelectorAll(selector);
				// console.log(doms);
				/*
				for(var i = 0;i<doms.length;i++){
					this[i] = doms[i];
				}
				this.length = doms.length;
				*/
				[].push.apply(this,doms);
			}	
		}
		else if(kQuery.isArray(selector)){
			//由于apply转伪数组有兼容问题(IE8以下不兼容),所以把所有传入的数组转换成真数组
			var tmpArr = [].slice.call(selector);
			
			//把转换后的真数组转换成伪数组
			[].push.apply(this,tmpArr);
		}else{
			this[0] = selector;
			this.length = 1;
		}
		return this;
	},
	selector: "",
	length: 0,
	jquery:'1.0.0',
	//以下方法在调用时是kquery对象调用,所以方法内部的this指向调用的kquery对象
	push: [].push,
	sort: [].sort,
	splice: [].splice,
	toArray:function(){
		return [].slice.call(this);
	},
	get:function(num){
		if(arguments.length == 1){
			//正数
			if(num>=0){
				return this[num];
			//负数	
			}else{
				// -1 4 = 3
				// -2 4 = 2
				return this[this.length + num]
			}
		}else{
			return this.toArray();
		}
	},
	eq:function(num){
		if(arguments.length == 1){
			return kQuery(this.get(num));
		}else{
			return new kQuery();
		}
	},
	first:function(){
		return this.eq(0);
	},
	last:function(){
		return this.eq(-1);
	},
	each:function(fn){
		return kQuery.each(this,fn);
	},
	map:function(fn){
		return kQuery(kQuery.map(this,fn));
	}	
}

kQuery.extend = kQuery.fn.extend  = function(obj){
	for(key in obj){
		this[key] = obj[key];
		//kQuery['isFunction'] = 	function(str){
		// 	return typeof str === 'function';
		// },
	}
}

//kQuery的静态方法
kQuery.extend({
	isFunction:function(str){
		return typeof str === 'function';
	},
	isString:function(str){
		return typeof str === 'string';
	},
	isHTML:function(str){
		return str.charAt(0) == '<' && str.charAt(str.length-1) == '>' && str.length >= 3;
	},
	isArray:function(str){
		return kQuery.isObject(str) && length in str 
	},
	isObject:function(str){
		return typeof str === 'object';
	},
	trim:function(str){
		if(kQuery.isString(str)){
			//用正则去掉字符串的前后空格
			return str.replace(/^\s+|\s+$/g,'');
		}else{
			return str;
		}	
	},
	each:function(arr,fn){
		if(kQuery.isArray(arr)){
			for(var i = 0;i<arr.length;i++){
				// console.log(i,arr[i]);
				var res = fn.call(arr[i],i,arr[i]);
				if(res == false){
					break;
				}else if(res == true){
					continue;
				}
			}
		}else{
			for(key in arr){
				// console.log(key,arr[key]);
				var res = fn.call(arr[key],key,arr[key]);
				if(res == false){
					break;
				}else if(res == true){
					continue;
				}				
			}
		}
		return arr;
	},
	map:function(arr,fn){
		var retArr = [];
		if(kQuery.isArray(arr)){
			for(var i = 0;i<arr.length;i++){
				var res = fn(arr[i],i);
				if(res){
					retArr.push(res);
				}
			}
		}else{
			for(key in arr){
				var res = fn(arr[key],key);
				if(res){
					retArr.push(res);
				}
			}
		}
		return retArr;
	},
	toWords:function(str){
		return str.match(/\b\w+\b/g);
	},
	addEvent:function(dom,eventName,fn){
		if(dom.addEventListener){
			dom.addEventListener(eventName,fn);
		}else{
			dom.attachEvent('on'+eventName,fn);
		}
	}

});

//kquery对象上的属性相关的操作方法
kQuery.fn.extend({
	html:function(content){
		if(content){
			//设置所有DOM原始的innerHTML
			this.each(function(){
				this.innerHTML = content;
			})
			return this;
		}else{
			return this[0].innerHTML;
		}
	},
	text:function(content){
		if(content){
			this.each(function(){
				this.innerText = content;
			});
			return this;
		}else{
			var str = '';
			this.each(function(){
				str += this.innerText;
			});
			return str;
		}
	},
	attr:function(arg1,arg2){
		if(kQuery.isObject(arg1)){//是对象的情况
			//设置所有的DOM属性值为对象中的所有值
			this.each(function(){
				var dom = this;
				kQuery.each(arg1,function(attr,val){
					dom.setAttribute(attr,val);
				})
			})

		}else{
			if(arguments.length == 1){//传递一个参数的情况
				//获取第一个DOM节点的属性值
				return this[0].getAttribute(arg1);

			}else if(arguments.length == 2){//传递两个参数的情况
				//设置所有DOM的属性值
				this.each(function(){
					this.setAttribute(arg1,arg2);
				});
			}
		}
		return this;
	},
	removeAttr:function(attr){
		if(attr){
			this.each(function(){
				this.removeAttribute(attr);
			})	
		}
		return this;
	},
	val:function(val){
		if(val){
			this.each(function(){
				this.value = val;
			});
			return this;
		}else{
			return this[0].value;
		}
	},
	css:function(arg1,arg2){
		if(kQuery.isString(arg1)){//是字符串的情况
			if(arguments.length == 1){
				//获取第一个元素对应的样式值
				// return this[0].style[arg1];
				
				if(this[0].currentStyle){//兼容低级浏览器
					return this[0].currentStyle[arg1];
				}else{
					return getComputedStyle(this[0],false)[arg1];
				}
				
			}else if(arguments.length == 2){
				this.each(function(){
					this.style[arg1] = arg2;
				});
			}
		}else if(kQuery.isObject(arg1)){
			this.each(function(){
				for(key in arg1){
					this.style[key] = arg1[key];
				}
			});
		}
		return this;
	},
	hasClass:function(str){
		var res = false;
		if(str){
			var reg = eval('/\\b'+str+'\\b/');
			this.each(function(){
				if(reg.test(this.className)){
					res = true;
					return false;
				}
			})
		}
		return res;
	},
	addClass:function(str){
		this.each(function(){
			var $this = kQuery(this);
			if(!$this.hasClass(str)){
				this.className =this.className + ' ' + str;
			}
		})
		return this;
	},
	removeClass:function(str){	
	},
	toggleClacss:function(str){
	}
});
//kquery对象上的DOM相关的操作方法
kQuery.fn.extend({
    empty:function(){
       this.each(function(){
            this.innerHTML = '';
       });
       return this;
    },
	remove:function(selector){
		if(selector){
			//获取选择器选中的所有DOM节点
			var doms = document.querySelectorAll(selector);
			this.each(function(){
				for(var i = 0;i<doms.length;i++){
					if(doms[i] == this){
						//删除
						var parentNode = this.parentNode;
						parentNode.removeChild(this);
					}
				}
			});
		}else{//没有传参
			this.each(function(){
				//parentNode.removeChild(sonNode)
				var parentNode = this.parentNode;
				parentNode.removeChild(this);
			});
		}
		return this;
	},
	/*append:function(source){
       if(source){
       	  var $source = kQuery(source);
          this.each(function(index,value){
          	 var parentNode = this;
          	 if(index == 0){
                 $source.each(function(){
          	 	 parentNode.appendChild(this);
          	   })
          	 }else{
          	 	$source.each(function(){
          	 		var dom = this.cloneNode(true);
          	 		parentNode.appendChild(dom);
          	 	})
          	 }
          })
       }
	},*/
	prepend:function(source){
		 if(source){
       	  var $source = kQuery(source);
          this.each(function(index,value){
          	 var parentNode = this;
          	 if(index == 0){
                 $source.each(function(){
          	 	 parentNode.insertBefore(this,parentNode.firstChild);
          	   })
          	 }else{
          	 	$source.each(function(){
          	 		var dom = this.cloneNode(true);
          	 		parentNode.insertBefore(dom,parentNode.firstChild);
          	 	})
          	 }
          })
       }
       return this;
	}/*,         
	clone:function(bcopy){
          var res = [];
          this.each(function(){
          	   if(bcopy){
          	//复制事件
             }else{
                 
             }
          });
       





          return kQuery(res);
	}*/

});

//kquery对象事件上相关的方法
kQuery.fn.extend({
	on:function(eventName,fn){
		this.each(function(){
			if(!this.bucketEvent){
				this.bucketEvent = {};
			}		
			if(!this.bucketEvent.eventName){
                this.bucketEvent.eventName = [];
                this.bucketEvent.eventName.push(fn);
                kQuery.addEvent(this,eventName,function(){
                	kQuery.each(this.bucketEvent.eventName,function(){
                       this();
                	})
                })
			}else{
                this.bucketEvent.eventName.push(fn);
			}
			// this.addEventListener(eventName,fn);
			//kQuery.addEvent(this,eventName,fn);
		})	
	},
    off:function(eventName,fnName){
        if(arguments == 0){
            
        }else if(arguments == 1){

        }else if(arguments == 2){

        }
    }

});




kQuery.fn.init.prototype = kQuery.fn;


window.kQuery = window.$ = kQuery;

})(window);