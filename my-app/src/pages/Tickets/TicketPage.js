import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function Jumbotron() {
    return (
      <Container className="p-5 my-4 bg-light rounded">
        <h1>Tickets</h1>
        <p>Tickets</p>
        <p>
          <Button variant="primary">Learn more</Button>
        </p>
      </Container>
    );
}

function App() {
    return (
      <div className="App">
        <Jumbotron />
      </div>
    );
  }
  
  export default App;
