export const DataReducer=(state,action)=>{
	const {type,payload:{itensity,fan,rain,temp,humidity,lamp}}=action

	switch(type){
		case 'SET_DATA':
			return{
				...state,
				itensity,
				fan,
				rain,
				temp,
				lamp,
				humidity
			}
		default:
			return state
	}
}