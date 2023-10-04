import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import logoutIcon from '../assets/logout.svg'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from '../Contexts/AuthContext'

const Menu=()=>{

	const {logoutUser} = useContext(AuthContext)

	const logout=()=>logoutUser()

	return (
		
		<Navbar>
		    <Container>
		    	<Navbar.Brand>Internet Of Things</Navbar.Brand>
		        <Navbar.Toggle />

		        <Navbar.Collapse className="justify-content-start">
					<Nav className='mr-auto'>
						<Nav.Link className='titlemenu font-weight-bolder' to='/dashboard' as={Link}>
							Dashboard
						</Nav.Link>
						
						<Nav.Link className='titlemenu font-weight-bolder' to='/house' as={Link}>
							House
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>


		        <Navbar.Collapse className="justify-content-end">
		          <Navbar.Text className="titlename">
		            Signed in as: <a>Admin</a>
		          </Navbar.Text>
		          <Button variant='secondary' className='font-weight-bolder text-white' onClick={logout}>
					<img src={logoutIcon} alt='logout' width='29' height='29' className='mr-2'/>
					Logout
				  </Button>
		        </Navbar.Collapse>
		    </Container>
	    </Navbar>

	)
}
export default Menu