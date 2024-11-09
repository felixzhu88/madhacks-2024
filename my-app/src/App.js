import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import from react-router-dom
import TicketsPage from './pages/Tickets/TicketPage'; // Correct relative path
import ProfilePage from './pages/Profile/ProfilePage'; // Correct relative path
import SubmitATicketPage from './pages/SubmitATicket/SubmitATicketPage';

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-light">
      <Container>
        <Navbar.Brand as={Link} to="/">Ticketer</Navbar.Brand> {/* Use 'as={Link}' for React Router */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/tickets">Tickets</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/submitATicket">Submit a Ticket</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Help</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function Jumbotron() {
  return (
    <Container className="p-5 my-4 bg-light rounded">
      <h1>Welcome pookies.</h1>
      <p>This is a site made by pookies, <em>for</em> pookies.</p>
      <p>
        <Button variant="primary">Learn more</Button>
      </p>
    </Container>
  );
}

function App() {
  return (
    <Router> {/* Wrap the app with Router */}
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Jumbotron />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/submitATicket" element={<SubmitATicketPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
