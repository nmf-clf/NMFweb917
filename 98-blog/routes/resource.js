const Router = require('express').Router;
const path = require('path');
const fs = require('fs');

const ResourceModel = require('../models/resource.js')
const pagination = require('../util/pagination.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/resource/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const router = Router();

//权限控制
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登录</h1>');
	}
})

//显示资源列表首页
router.get("/",(req,res)=>{
	 let options = {
        page: req.query.page,//需要显示的页码
        model:ResourceModel, //操作的数据模型
        query:{}, //查询条件
        projection:'-__v', //投影，
        sort:{_id:-1}, //排序
      }
      pagination(options)
      .then(data=>{
		 	res.render('admin/resource-list',{
				userInfo:req.userInfo,
				resources:data.docs,
				page:data.page,
				pages:data.pages,
				list:data.list
			});     	
      })

})

//显示添加资源页面
router.get("/add",(req,res)=>{
	console.log('hehehehe');
	res.render('admin/resource-add',{
		userInfo:req.userInfo
	});
})

//处理新增资源
router.post("/add",upload.single('file'),(req,res)=>{
    console.log('hahahahahah');
	new ResourceModel({
		name:req.body.name,
		path:'/resource/'+req.file.filename
	})
	.save()
	.then(resource=>{
		res.render('admin/success',{
			userInfo:req.userInfo,
			message:'添加资源成功',
			url:'/resource'
		})			
	})

})

module.exports = router;