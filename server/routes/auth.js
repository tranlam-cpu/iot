const express = require('express');
const router = express.Router()

const jwt=require('jsonwebtoken')
const verifyToken= require('../middleware/auth')





router.get('/',verifyToken, async(req,res)=>{
	try{
		const user = req.userId;
		if (user!="admin") return res.status(400).json({success: false, message: 'User not found'})

		res.json({success: true, user})
	}catch(error){
		console.log(error);
		res.status(500).json({success:false, message: error})
	}
})



// route api/auth/login
router.post('/login',async(req,res)=>{
	const {username,password}=req.body

	if(!username || !password){
		return res
		.status(400)
		.json({success: false, message: 'Missing username and password'})
	}

	try{
		//check for exits user
		
		if (username!="admin"){
			return res.status(400).json({success: false, message: 'Incorrect user name and password'})
		}

		//username found
	
		
		if(password!="admin"){
			return res.status(400).json({success: false, message: 'Incorrect user name and password'})
		}

		// all good
		// return token
		const accessToken = jwt.sign({userId: username}, process.env.ACCESS_TOKEN_SECRET)
		res.json({success:true, message: 'logged in successfully', accessToken})

	}catch (error){
		console.log(error);
		res.status(500).json({success:false, message: 'error'})
	}
})
module.exports = router