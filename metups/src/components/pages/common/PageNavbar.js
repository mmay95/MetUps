import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Importing authentication
import { userIsAuthenticated } from '../../../auth/helpers'

// Importing Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { useToast } from '@chakra-ui/react'

const PageNavbar = () => {
  const navigate = useNavigate()
  const toast = useToast()
  // This just gets rid of the token, logs the user out and directs them to the homepage
  const handleLogout = () => {
    window.localStorage.removeItem('metups-login-token')
    navigate('/')
  }



  return (
    <>
      <Navbar variant='light' expand='md'>
        <Container fluid>
          <Navbar.Brand>
            <Nav.Item>
              <Link to='/'> METUPS</Link>
            </Nav.Item>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-basic' className='justify-content-end'>
            { userIsAuthenticated() ?
              <>
                <Nav.Item>
                  <Link to='/events'>Events</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to='/eventCreate'>Create Event</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to='/profile'>Profile</Link>
                </Nav.Item>
                <Nav.Item onClick={handleLogout}>
                  <span onClick={() => {
                    toast({
                      title: "Successfully Logged Out",
                      desc: "You clicked log out",
                      status: "success",
                      duration: "2000",
                      isClosable: true
                    })
                  }} className='clickable'>Logout</span>
                </Nav.Item>
              </>
              :
              <>
                <Nav.Item>
                  <Link to = '/register'>Register</Link>
                </Nav.Item>
                <Nav.Item>
                  <Link to = '/login'>Login</Link>
                </Nav.Item>
              </>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default PageNavbar
