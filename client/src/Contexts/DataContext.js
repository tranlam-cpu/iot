import {createContext, useReducer, useEffect} from 'react'
import {DataReducer} from '../Reducer/DataReducer'
import {io} from 'socket.io-client'
import {SeverUrl} from './constans.js'

export const DataContext=createContext();

const DataContextProvider=({children})=>{
	const [dataState,dispatch]=useReducer(DataReducer,{
		itensity:null,
		fan:'false',
		rain:'false',
		temp:null,
		lamp:'false',
		humidity:null
	})


	//connect io
	const io_connection=()=>{
		const socket=io(SeverUrl)

		socket.on('connection',()=>{
			console.log('connected to server');
		})

		socket.on('HouseData',(data)=>{
			console.log(data);
			dispatch({type:'SET_DATA',payload:{itensity:data.itensity,fan:data.fan,rain:data.rain,temp:data.temp,humidity:data.humidity,lamp:data.lamp}})
		})


		socket.on('disconnect', () => {
	      console.log('Socket disconnecting');
	    })
	}

	useEffect(() => { io_connection() },[])

	//context data
	const DataValue={dataState}

	return(
		<DataContext.Provider value={DataValue}>
			{children}
		</DataContext.Provider>
	)
}

export default DataContextProvider