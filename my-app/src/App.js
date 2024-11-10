import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import TicketsPage from './pages/Tickets/TicketPage'; 
import ProfilePage from './pages/Profile/ProfilePage'; 
import SubmitTicketPage from './pages/Submit-Ticket/SubmitTicket'; 

function NavBar() {
  return (
    <Container className="navbar-container">
      <Navbar expand="lg">
      <Container className="LogoName">
        <Navbar.Brand as={Link} to="/">
        <img 
          src={logo} 
          alt="logo" 
          width="30"
          height="30"
          id="nav-logo"
          />
        Ticketer
        </Navbar.Brand> {/* Use 'as={Link}' for React Router */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/submit-ticket">Submit a Ticket</Nav.Link>
            <Nav.Link as={Link} to="/tickets">Tickets</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </Container>
  );
}

function Jumbotron() {
  return (
    <Container className="jumbotron">
      <div id="jumbotron-text">
        <h1>Welcome</h1>
        <p>This is a site made by pookies, <em>for</em> pookies.</p>
        <p>
          {/* TODO: link to tickets page */}
          <Button variant="primary">Tickets</Button>
        </p>
      </div>
    </Container>
  );
}

function App() {
  return (
    <Router> {/* Wrap the app with Router */}
      {/* <div style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          zIndex: '-1',
          }}>
      </div> */}
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Jumbotron />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/submit-ticket" element={<SubmitTicketPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
