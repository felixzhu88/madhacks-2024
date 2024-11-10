import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import from react-router-dom
import AdminViewPage from './AdminView/AdminViewPage';


function CornerButton() {
  const [show, setShow] = useState(false); // To control modal visibility
  const [password, setPassword] = useState(''); // To store input password
  const [error, setError] = useState(''); // To show an error message
  const correctPassword = '11111'; // Set your password here
  const navigate = useNavigate();

  // Functions to show and hide modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Handle input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle form submission
  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === correctPassword) {
      navigate('/adminView')
      //alert('Access Granted!');
      handleClose();
      setPassword(''); // Reset password input
    } else {
      setError('Incorrect password. Please try again.');
      setPassword(''); // Reset password input
    }
  };

  return (
    <div>

      {/* Fixed button in the top-right corner */}
      <Button
        variant="primary"
        size="sm"
        onClick={handleShow}
        style={{
          position: 'fixed',
          top: '10px', // Adjust as needed
          right: '10px', // Adjust as needed
          zIndex: 1000, // Ensures the button is above other content
        }}
      >
        Admin Login
      </Button>

       {/* Password Modal */}
       <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3" controlId="passwordInput">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                autoFocus
              />
              {error && <Form.Text className="text-danger">{error}</Form.Text>}
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function TextControls() {

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    desc: "",
  });

  // Handle changes for all form fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });  // Update the state with the field value
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();  // Prevent the default form submission

    // Ensure the date format is yyyy/mm/dd
    let formattedDate = formData.date;
    if (formattedDate) {
      const [year, month, day] = formattedDate.split('-');
      formattedDate = `${year}-${month}-${day}`; // Reformat to yyyy/mm/dd
    }

    // Update formData with the formatted date
    const formDataWithFormattedDate = { ...formData, date: formattedDate };

    if (form.checkValidity() === false) {
      event.stopPropagation();  // Stop form submission if validation fails
    }
    else {
      console.log("Form Submitted:", formDataWithFormattedDate);  // Log form data
      try {
        // Send data to API
        const response = await axios.post('http://127.0.0.1:8000/add-ticket', formDataWithFormattedDate);
        console.log(response.data)
        // Handle successful response
        console.log('Response from API:', response.data);
        alert(`Form submitted successfully! You are ticket #${response.data.id}`);
      } catch (error) {
        // Handle error
        console.error('Error sending data to API:', error);
        alert('There was an error submitting your form. Please try again.');
      }
    }

    setValidated(true);  // Set the form as validated
  };

  return (
    <Container SubmitATickerPage="mt-4">
    <h2>View Your Tickets</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        
        {/* Email Input */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="name@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}  // Add onChange to update state
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

function App() {
    return (
      <div className="App">
        <CornerButton />
        <TextControls />
        <Routes>
          <Route path="/adminView" element={<AdminViewPage />} />
        </Routes>
      </div>
    );
  }
  
  export default App;
