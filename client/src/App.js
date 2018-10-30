import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {
  Jumbotron,
  Alert,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Table
} from 'reactstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      alertVisible: false,
      title: '',
      movies: []
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  getAllMovies = () => {
    axios
      .get('/getallmovies')
      .then(result => {
        this.setState({ movies: result.data });
        console.log(this.state.movies);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getAllMovies();
  }

  //for popup
  onDismiss() {
    this.setState({ alertVisible: false });
  }
  //for form
  onSubmit = e => {
    e.preventDefault();
    this.setState({ alertVisible: false });
    //console.log(this.state.title);

    const query = `/getmovie?title=${this.state.title}`;

    console.log(query);

    axios
      .get(query)
      .then(result => {
        console.log(result.data);
        if (result.data === 'Not found') {
          this.setState({ alertVisible: true });
        }
        this.getAllMovies();
      })
      .catch(error => {
        alert('Error: ', error);
      });
    //const data = this.state.movies;
    //this.setState({ movies: this.state.movies.reverse() });
  };

  // for form field
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  removeMovie(title) {
    this.setState({
      movies: this.state.movies.filter(movie => {
        if (movie.title !== title) return movie;
      })
    });
    const query = `/deletemovie?title=${title}`;
    axios
      .get(query)
      .then(result => {
        this.getAllMovies();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }
  render() {
    return (
      <div className="App">
        <Jumbotron>
          <h1 className="display-3">Movies</h1>
          <p className="lead">Search for movies</p>
        </Jumbotron>
        <Container>
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.alertVisible}
                toggle={this.onDismiss}
              >
                Movie not found
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="title">Enter movie title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="enter movie title..."
                    onChange={this.onChange}
                  />
                </FormGroup>
                <Button color="primary">Submit</Button>
                <p />
              </Form>
            </Col>
          </Row>
          <Row>
            <Table>
              <thead>
                <tr>
                  <th>Delete</th>
                  <th>Title</th>
                  <th>Poster</th>
                </tr>
              </thead>
              <tbody>
                {this.state.movies.map(movie => {
                  return (
                    <tr>
                      <td>
                        <button
                          onClick={() => {
                            this.removeMovie(movie.title);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      <td>{movie.title}</td>
                      <td>
                        <img src={movie.poster} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
