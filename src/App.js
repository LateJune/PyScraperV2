import React, { Component } from 'react';
import './App.css';
import {Container, Row, Col, Navbar, Form, FormGroup, Button, FormControl} from 'react-bootstrap';
import axios from 'axios';


class App extends Component {
  constructor(props){
    super(props);

      this.state = {
      data: [],
      _id: 0,
      starring_actors: '',
      director: '',
      rating: '',
      title: '',
      genre: '',
      release_date: '',
      runtime: '',
      img_url: '',
      summary: '',
    }
  }

  componentDidMount(){
    this.getDataFromDb();
    if(!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({intervalIsSet: interval});
    }
  }

  componentWillUnmount(){
    if(this.state.intervalIsSet){
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet: null});
    }
  }

  getDataFromDb = () =>{
    fetch('http://localhost:3001/getData')
      .then(data => data.json())
      .then(res => this.setState({data: res.data}));
  }

  handleTitleChange = event => {
    this.setState({ 
      title: event.target.value 
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  
    axios({
      method: 'POST',
      url: 'http://localhost:3001/getTitle',
      headers: {
        'crossDomain': true,
        'Content-Type': 'application/json'
      },
      params: {
        title: this.state.title,
      },
    })
    
  };

  render() {
    const {data} = this.state;
    return (
      <div>
          <div className = "nav">
            <Navbar bg = "dark" variant = "dark" fixed = 'top'>
               <Form inline onSubmit = {this.handleSubmit}>
                <FormGroup> 
                  <FormControl type = "text" onChange = {this.handleTitleChange} name = "title" placeholder = "Search" className = "mr-sm-2"  />
                  <Button type = "submit" variant = "outline-info" placeholder = "Search" className = "mr-sm-2">Search</Button>
                </FormGroup>
              </Form>
            </Navbar>
          </div>
          <div>
            <Container className = "container"> 
              <Row>
                {data.length <= 0 ? "ERR DB EMPTY OR NOT CONNECTED": data.map(dat => (
                  <Col lg = {4}>
                    <div className = "movies"> 
                      <span>id: </span>{dat._id} <br />
                      <span>Title: </span>{dat.title} <br />
                      <span><img src = {dat.img_url} /></span> <br />
                      <span>Summary: </span>{dat.summary} <br />
                      <span>Rating: </span>{dat.rating} <br />
                      <span>Runtime: </span>{dat.runtime} <br />
                      <span>Genre: </span>{dat.genre} <br />
                      <span>Starring Actors: </span>{dat.starring_actors} <br />
                      <span>Director: </span>{dat.director} <br />
                      <span>Release Date: </span>{dat.release_date} <br /> 
                      <br />
                      <br />            
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
      </div>
    );
  }
}

export default App;
