const express = require('express');
const router = express.Router()
const requestPromise = require('request-promise');
const esp32 = require('../models/esp32')
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
		const lamp=req.query.lamp

		const data={
			'itensity':parseFloat(itensity,0),
			'fan':fan,
			'rain':rain,
			'temp':temp,
			'lamp':lamp,
			'humidity':humidity
		}

		//add mongo
		const newob=new esp32({
			nhietdo:temp,
			doam:humidity,
			mua:rain
		})

		await newob.save()


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

router.get('/chart',async(req,res)=>{
	try{
		const query=await esp32.find().sort({createdAt:-1}).limit(10);

		if(!query){
			return	res.status(400).json({success:false, message: 'nodata'})
		}


		// const getDayAverage = async (model, date) => {
		
		//   const _dateFormatted = new Date(date).toDateString();
		//   const average = await model.aggregate([
		//     { $match: { date: _dateFormatted } },
		//     { $group: { _id: null, average: { $avg: 'ppm' } } },
		//   ]).exec();


		const dataAvg = await esp32.aggregate([
			{$sort:{createdAt:-1}},
			{$limit:10},
		    { $group: { 
		    	_id: null, 
		    	avgTemp: { $avg: '$nhietdo'},
		    	avgHumidity:{$avg:'$doam'}
		    } },
		  ]).exec();




		res.json({success:true, query,avg:dataAvg})
	}catch(error){
		res.status(500).json({success:false, message: 'nodata'})
	}
	

})

const getCurrentJson=(data)=>{
	const messtext=`bả nói nhiệt độ là ${data.main.temp} ℃`;
	const messtext2=`em cảm thấy bầu trời hôm nay ${data.weather[0].main}... ${data.weather[0].description}😚`;

	let imgUrl=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
	return{
		messages:[
			{text: messtext},
			{attachment:{
				type:'image',
				payload:{
					url:imgUrl
				}
			}},
			{text:messtext2}
		]
	}
}

const failCurrentJson=()=>{
	const messtext='hàng xóm bảo không biết 😑';
	let imgUrl='https://i.pinimg.com/originals/b1/9b/7e/b19b7e48f4d0376da0c3fc94727a68ee.jpg';
	return{
		messages:[
			{text: messtext},
			{attachment:{
				type:'image',
				payload:{
					url:imgUrl
				}
			}},
		]
	}
}

router.get('/bot',async(req,res)=>{
	try{
		const city=req.query.city;

		const check=city.split(' ');
		
		if(check.length>1){
			const Url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cee343d33e41970dd63c44b39c8620ab`;
			const reqOption={
				url: Url,
				json:true
			};

			requestPromise(reqOption)
			.then((data)=>{
				const resData=getCurrentJson(data)
				res.status(200).json(resData)
			})
			.catch((error)=>{
				const resData=failCurrentJson()
				res.status(200).json(resData)
			})
		}else{
			const resData=failCurrentJson()
			res.status(200).json(resData)
		}

		


	}catch(error){
		
		res.status(500).json({success:false, message: "nodata"})
	}
	

})

const getCurrentTemp=(data)=>{
	const messtext=`nhà mình đang ${data[0].nhietdo} ℃ anh ạ`;
	
	let t=data[0].nhietdo;
	let messtext2='👌😊';
	let imgUrl='https://i.kym-cdn.com/photos/images/original/000/967/202/eb1.jpg'
	if(t>34){
		messtext2='mai sắm máy lạnh anh nhé.. 👉👈';
		imgUrl=`https://st.quantrimang.com/photos/image/2017/06/05/anh-che-nong-14.jpg`;
	}else if(t<20){
		messtext2='so cold..';
		imgUrl='https://cdn1.hoanghamobile.com/tin-tuc/wp-content/uploads/2018/01/winter-meme-generator-59d89e9f997fe.jpg';
	}

	
	return{
		messages:[
			{text: messtext},
			{text: messtext2},
			{attachment:{
				type:'image',
				payload:{
					url:imgUrl
				}
			}}
		]
	}
}

router.get('/nhietdo',async(req,res)=>{
	try{
		const data=await esp32.find().sort({createdAt:-1}).limit(1).select('nhietdo');
		const resData=getCurrentTemp(data)
		
		res.status(200).json(resData)
	}catch(error){
		res.status(500).json({success:false, message: "nodata"})
	}
})


let statuslamp='';

router.get('/lamp',async(req,res)=>{
	try{
		const lamp=req.query.lamp;

		if(lamp===statuslamp){
			let messtext='có bật đâu mà kiu tắt???';
			if(lamp=='true'){
				messtext='bật rồi mà kiu bật nửa là sao??';
			}
			return res.status(200).json({messages:[{text: messtext}]})
		}
		
		statuslamp=lamp
		if(lamp==='true'){
			let messtext='đèn đã được bật ạ';
			
			return res.status(200).json({messages:[{text: messtext}]})
		}else{
			let messtext='đèn đã được tắt ạ';
			
			return res.status(200).json({messages:[{text: messtext}]})
		}
		

		

	}catch(error){
		return res.status(500).json({success:false, message: "nodata"})
	}
})

router.get('/getlamp',async(req,res)=>{
	try{
		
		

		res.status(200).json({success:true,statuslamp})

	}catch(error){
		res.status(500).json({success:false, message: "nodata"})
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