import axios from 'axios';
import React ,{Component} from 'react';
import Joke from './Joke';
import './Jokeapp.css';
import {uuid} from 'uuidv4';
class Jokeapp extends Component{
    static defaultProps={
        max : 10
    }
    constructor(props)
    {
        super(props);
        this.state={
            joke: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading : false
        };
        this.seenJokes=new Set(this.state.joke.map(j=>j.text));
        this.handleClick=this.handleClick.bind(this);
        this.clickme=this.clickme.bind(this);
    }
    clickme()
    {
        this.setState({loading : true});
        this.getJokes();
    }
 async getJokes(){
        let jokes=[];

     while(jokes.length<this.props.max)
     {
      let api_data=await axios.get("https://icanhazdadjoke.com/",{
          headers :{Accept :"application/json"}
      });
      if(this.seenJokes.has(api_data.data.joke)===false)
      jokes.push({id : uuid(),text :api_data.data.joke , vote : 0});
    }
    this.setState(st=>({
        joke : [...st.joke,...jokes],
        loading :false
    }),
    ()=>window.localStorage.setItem("jokes",JSON.stringify(this.state.joke))
    );

 }
     componentDidMount()
     {
        if(this.state.joke.length === 0)
        this.getJokes();
      }
    handleClick(id,delta)
    {
        this.setState(st=>({
            joke : st.joke.map(m=>{
                return m.id===id ? {...m,vote : m.vote+delta} : m;
            })
        }),
        ()=>window.localStorage.setItem("jokes",JSON.stringify(this.state.joke))
        )
    }
    render(){
        let myjoke=this.state.joke.sort((a,b)=>b.vote - a.vote);
        const jokes=myjoke.map(joke =>{
            return <Joke key={joke.id} vote={joke.vote} joke={joke.text} handleClick={this.handleClick} id={joke.id}/>
        })
        if(this.state.loading===true)
        {
            return(
                <div className='JokeList-spinner'>
                <i className='far fa-8x fa-laugh fa-spin' />
                <h1 className='JokeList-title'>Loading...</h1>
              </div>
            );
        }
        return(
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                  <h1 className="JokeList-title">
                      <span>Bad</span> Jokes
                  </h1>
                  <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="pdkkdd"/>
                <button className="JokeList-getmore" onClick={this.clickme}>New Jokes</button>
                </div>
                <div className='JokeList-jokes'>
                   {jokes}
                </div>
            </div>
        )
    }
}
export default Jokeapp;