const express = require('express');
const router = express.Router()

let io
setTimeout(()=>{
	io=require('../socket.js').get()
},1000)


router.get('/',async(req,res)=>{
	try{
		const itensity=req.query.itensity
		console.log(itensity);
		io.emit('HouseData',parseFloat(itensity,0))

		res.json({success: true,message:parseFloat(itensity,0)})
	}catch(error){
		console.log(error);
		res.status(500).json({success:false, message: error})
	}
})

router.get('/data',async(req,res)=>{
	try{	
		let data=require('../index.js')
		res.json({success: true,data})
	}catch(error){
		res.status(500).json({success:false, message: 'nodata'})
	}
})

/*router.post('/', async(req,res)=>{

	try{
		const {itensity}=req.body
		
		io.emit('HouseData',itensity)
		res.json({success: true,message:'succesed'})
	}catch(error){
		console.log(error);
		res.status(500).json({success:false, message: error})
	}
})*/





module.exports = router