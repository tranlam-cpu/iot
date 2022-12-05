const express = require('express');
const router = express.Router()

let io
setTimeout(()=>{
	io=require('../socket.js').get()
},1000)

/*http://localhost:5000/api/house?itensity=3&fan=true&lamp=true*/
router.get('/',async(req,res)=>{
	try{
		const itensity=req.query.itensity
		const fan=req.query.fan
		const rain=req.query.rain
		const temp=req.query.temp
		const humidity=req.query.humidity

		const data={
			'itensity':parseFloat(itensity,0),
			'fan':fan,
			'rain':rain,
			'temp':temp,
			'humidity':humidity
		}
		
		io.emit('HouseData',data)

		res.json({success: true,data:data})
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