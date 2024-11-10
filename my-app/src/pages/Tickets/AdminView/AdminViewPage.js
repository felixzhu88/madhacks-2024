import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';

function TicketPage() {
  const [tickets, setTickets] = useState([]);  // State to store tickets
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch tickets from the API when the component mounts
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/add-ticket')  // Replace with your backend API URL
      .then((response) => {
        setTickets(response.data);  // Store tickets data in the state
        setLoading(false);  // Stop loading
      })
      .catch((err) => {
        setError('Failed to fetch tickets');  // Set error if request fails
        setLoading(false);  // Stop loading
      });
  }, []);  // Empty dependency array ensures the request is made only once when the component mounts

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
        {tickets.map((ticket) => (
          <ListGroupItem key={ticket.id}>
            <h5>{ticket.title}</h5>
            <p>{ticket.description}</p>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Container>
  );
}

export default TicketPage;