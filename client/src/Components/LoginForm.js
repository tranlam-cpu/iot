import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {useState, useContext} from 'react'
import {AuthContext} from '../Contexts/AuthContext'
import AlertMessage from './AlertMessage'
import {useNavigate} from 'react-router-dom'
const LoginForm=()=>{

	//context
	const {loginUser}=useContext(AuthContext)

	//Router
	const navigate=useNavigate()

	//local state
	const [loginForm,setLoginForm]=useState({
		username: "",
		password: ""
	})

	const [alert,setAlert] = useState(null)

	const {username, password} = loginForm


	const onChangeLoginForm = event => setLoginForm({...loginForm, [event.target.name]: event.target.value})

	const login= async event =>{
		event.preventDefault()

		try{
			const loginData = await loginUser(loginForm)
			if(loginData.success){
				navigate('/dashboard')
			}else{
				setAlert({type: 'danger', message: loginData.message})
				setTimeout(()=>setAlert(null),5000)
			}
		}catch(error){
			console.log(error);
		}


		
	}
	return(
		<>
		<Form className="my-4" onSubmit={login}>
			<AlertMessage info={alert} />
			<Form.Group>
				<Form.Control type='text' placeholder="User name" name='username' value={username} onChange={onChangeLoginForm} required />
			</Form.Group>
			<Form.Group>
				<Form.Control type='password' placeholder="Password" name='password' value={password} onChange={onChangeLoginForm} required />
			</Form.Group>
			<Button variant='success' type='submit'>Login</Button>
		</Form>
		
		</>
	)
}

export default LoginForm