import LoginForm from '../Components/LoginForm'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../Contexts/AuthContext'
import {useContext} from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Auth = () =>{
	const {authState: {authLoading, isAuthenticated}}= useContext(AuthContext)
	const navigate=useNavigate()


	let body

	if(authLoading){
		body = (
			<div className="d-flex justify-content-center mt-2">
				<Spinner animation='border' variant='info' />
			</div>
		)
	}
	else if(isAuthenticated) return navigate('/dashboard')
	else{
		body=(
			<>
			  {<LoginForm />}
			</>
		)
		
	}
	return (
		<div className="ctmain">
			<div className="overlay">
				<div className="login">
					<h1>IOT house</h1>
					<h4>vui lòng đăng nhập vào ngôi nhà của bạn</h4>
					{body}
				</div>
			</div>
		</div>
	)

}

export default Auth