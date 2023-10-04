import { useNavigate} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from '../Contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'


const ProtectedRoute = ({children})=>{
	const {authState: {authLoading, isAuthenticated}}= useContext(AuthContext)
	const navigate= useNavigate()
	if(authLoading){
		return (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	}


	if(!isAuthenticated){
		return navigate('/')
	}else return children

	
}

export default ProtectedRoute