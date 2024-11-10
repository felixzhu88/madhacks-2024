import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Spinner, Dropdown, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; // Import a trash icon from react-icons

// Modified Drop component to fetch categories from API
function Drop({ onFilterChange, categories }) {
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
        {categories.map((category) => (
          <Dropdown.Item key={category} eventKey={category}>
            {category}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function TicketPage({ filter }) {
  const [tickets, setTickets] = useState([]); // State to store tickets
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch tickets based on the filter
  const fetchTickets = (filter) => {
    setLoading(true);
    setError(null);

    let cat = { "col": "category", "target": "" };

    if (filter === 'all') {
      axios
        .get('http://127.0.0.1:8000/tickets')
        .then((response) => {
          setTickets(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch tickets');
          setLoading(false);
        });
    } else {
      cat = { 'col': 'category', 'target': filter };

      axios
        .post('http://localhost:8000/filter-tickets', cat)
        .then((response) => {
          setTickets(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch tickets');
          setLoading(false);
        });
    }
  };

  // Function to handle ticket deletion
  const handleDelete = (ticketId) => {
    axios
      .post('http://127.0.0.1:8000/delete-ticket', { id: ticketId })
      .then(() => {
        setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      })
      .catch(() => {
        setError('Failed to delete the ticket');
      });
  };

  // Fetch tickets whenever the filter changes
  useEffect(() => {
    fetchTickets(filter);
  }, [filter]);

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

      <ListGroup>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <ListGroupItem key={ticket.id} className="d-flex justify-content-between align-items-center">
              <div>
                <h3>{ticket.email}</h3>
                <h5>{ticket.description}</h5>
                <p>id: {ticket.id}</p>
              </div>
              <Button variant="danger" onClick={() => handleDelete(ticket.id)}>
                <FaTrash />
              </Button>
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
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]); // State to store categories

  // Fetch categories from API
  const fetchCategories = () => {
    axios
      .get('http://127.0.0.1:8000/categories') // Replace with your backend API endpoint for fetching categories
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        console.error('Failed to fetch categories');
      });
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="App">
      <Drop onFilterChange={setFilter} categories={categories} />
      <TicketPage filter={filter} />
    </div>
  );
}

export default AdminViewPage;
