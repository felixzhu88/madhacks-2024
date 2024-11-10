import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Spinner, Dropdown } from 'react-bootstrap';

function Drop({ onFilterChange }) {
  // Capture dropdown selection and notify parent component
  const handleSelect = (eventKey) => {
    onFilterChange(eventKey);
  };

  return (
    <Dropdown
      onSelect={handleSelect}
      style={{
        position: 'fixed',
        top: '300px',
        right: '140px',
        zIndex: 1000,
      }}
    >
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Show
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="all">All</Dropdown.Item>
        <Dropdown.Item eventKey="tech-support">Tech Support</Dropdown.Item>
        <Dropdown.Item eventKey="finance-billing">Finance/Billing</Dropdown.Item>
        <Dropdown.Item eventKey="general">General</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function TicketPage({ filter }) {
  const [tickets, setTickets] = useState([]);  // State to store tickets
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Function to fetch tickets based on the filter
  const fetchTickets = (filter) => {
    setLoading(true);  // Start loading
    setError(null);  // Reset error

    let cat = {"col": "category", 'target': ''};

    // Adjust API URL based on the filter selection
    if (filter === 'all') {
      axios.get('http://127.0.0.1:8000/tickets')  // Replace with your backend API URL
      .then((response) => {
        setTickets(response.data);  // Store tickets data in the state
        setLoading(false);  // Stop loading
      })
      .catch((err) => {
        setError('Failed to fetch tickets');  // Set error if request fails
        setLoading(false);  // Stop loading
      });
    }
    else {
      if (filter === 'tech-support') {
        cat = {'col': 'category', 'target': 'Tech Support'};
      } else if (filter === 'finance-billing') {
        cat = {'col': 'category', 'target': 'Finance Billing'};;
      } else if (filter === 'general') {
        cat = {'col': 'category', 'target': 'General'};
      }

      axios.post('http://localhost:8000/filter-tickets', cat)
        .then((response) => {
          setTickets(response.data);  // Store tickets data in the state
          setLoading(false);  // Stop loading
        })
        .catch((err) => {
          setError('Failed to fetch tickets');  // Set error if request fails
          setLoading(false);  // Stop loading
        });
      }
  };

  // Fetch tickets whenever the filter changes
  useEffect(() => {
    fetchTickets(filter);
  }, [filter]);  // Dependency array includes the filter state

  return (
    <Container>
      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h1 className="my-4">Tickets</h1>

      {/* Render the list of tickets */}
      <ListGroup>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <ListGroupItem key={ticket.id}>
              <h5>{ticket.title}</h5>
              <p>{ticket.description}</p>
            </ListGroupItem>
          ))
        ) : (
          !loading && <p>No tickets found for the selected category.</p>
        )}
      </ListGroup>
    </Container>
  );
}

function AdminViewPage() {
  const [filter, setFilter] = useState('all');  // State for dropdown selection

  return (
    <div className="App">
      <Drop onFilterChange={setFilter} />  {/* Pass setFilter as a prop */}
      <TicketPage filter={filter} />  {/* Pass filter state to TicketPage */}
    </div>
  );
}

export default AdminViewPage;
