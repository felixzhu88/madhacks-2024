import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from './images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'; // Import from react-router-dom
import TicketsPage from './pages/Tickets/TicketPage'; // Correct relative path
import SubmitATicketPage from './pages/SubmitATicket/SubmitATicketPage';
import AdminViewPage from './pages/Tickets/AdminView/AdminViewPage';

function NavBar() {

  return (
    <Navbar expand="lg" id="navbar" bg="light" className="navbar-container">
      <Container>
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
            <Nav.Link as={Link} to="/tickets">Tickets</Nav.Link>
            <Nav.Link as={Link} to="/submitATicket">Submit a Ticket</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function Jumbotron() {
  return (
    <Container className="jumbotron">
      <div id="jumbotron-text">
        <h1>Welcome</h1>
      </div>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>  
          <Route path="/" element={<Jumbotron />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/submitATicket" element={<SubmitATicketPage />} />
          <Route path="/adminView" element={<AdminViewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
