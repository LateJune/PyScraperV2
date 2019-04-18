import React, { Component } from 'react';


class App extends Component {

  state = {
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

  render() {
    const {data} = this.state;
    return (
      <div>        
        {data.length <= 0 ? "ERR DB EMPTY": data.map(dat => (
          <div> 
            <span>id: </span>{dat._id} <br />
            <span>Title: </span>{dat.title} <br />
            <span><img src = {dat.img_url}/></span> <br />
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
        ))}

      </div>
    );
  }
}

export default App;
