import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import './SubmitATicketPage.css'; 

function Jumbotron() {
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
    setFormData({ ...formData, [name]: value }); // Update the state with the field value
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault(); // Prevent the default form submission

    // Ensure the date format is yyyy/mm/dd
    let formattedDate = formData.date;
    if (formattedDate) {
      const [year, month, day] = formattedDate.split('-');
      formattedDate = `${year}-${month}-${day}`; // Reformat to yyyy/mm/dd
    }

    // Update formData with the formatted date
    const formDataWithFormattedDate = { ...formData, date: formattedDate };

    if (form.checkValidity() === false) {
      event.stopPropagation(); // Stop form submission if validation fails
    } else {
      console.log("Form Submitted:", formDataWithFormattedDate); // Log form data
      try {
        // Send data to API
        const response = await axios.post('http://127.0.0.1:8000/add-ticket', formDataWithFormattedDate);
        console.log(response.data);
        // Handle successful response
        alert(`Form submitted successfully! You are ticket #${response.data.id}`);
      } catch (error) {
        // Handle error
        console.error('Error sending data to API:', error);
        alert('There was an error submitting your form. Please try again.');
      }
    }

    setValidated(true); // Set the form as validated
  };

  return (
    <Container id="jumbotron">
      <div id="titletext">
        <h1 id="jumbotitle">Submit A Ticket</h1>
        <p id="jumbotext">Please fill out the following fields</p>
      </div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* Name Input */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label> <p className='form-label-text'><strong>Name</strong></p> </Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="John Doe"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please include your name.
          </Form.Control.Feedback>
        </Form.Group>
        
        {/* Email Input */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label> <p className='form-label-text'><strong>Email address</strong></p> </Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="name@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Date Input */}
        <Form.Group className="mb-3" controlId="exampleForm.ControlDate1">
          <Form.Label> <p className='form-label-text'><strong>Date</strong></p> </Form.Label>
          <Form.Control
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid date.
          </Form.Control.Feedback>
        </Form.Group>
        
        {/* Issue Textarea */}
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label> <p className='form-label-text'><strong>Issue</strong></p> </Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            placeholder="Please provide a brief description of your issue here."
            name="desc"
            value={formData.desc}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please describe your issue.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" id="submitbutton">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

function App() {
  return (
    <div className="TicketPageApp">
      <Jumbotron />
    </div>
  );
}

export default App;