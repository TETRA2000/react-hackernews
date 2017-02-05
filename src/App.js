const $ =require("jquery");
const jQuery =require("jquery");

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactList from 'react-list';

let appAjaxCallback = {};

class App extends Component {
  state = {
    news_list: [],
    news_info: {},
  };

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount(){
    appAjaxCallback.newsList = (data) => {
      const list = data.map((item) => { return {id: item}});

      this.setState({
        news_list: list,
      });
    };

    appAjaxCallback.newsInfo = (data) => {
      this.state.news_info[data.id] = data;

      console.log(this.state.news_info);
    };
  }

  componentDidMount() {
    $.ajax({
      dataType: "json",
      url: "https://hacker-news.firebaseio.com/v0/topstories.json",
      success: function (data) {
        appAjaxCallback.newsList(data);
      }
    });
  }

  renderItem(index, key) {
    const item = this.state.news_list[index];
    const info = this.state.news_info[item.id];

    if(jQuery.isEmptyObject(info)) {

      $.ajax({
        dataType: "json",
        url: `https://hacker-news.firebaseio.com/v0/item/${item.id}.json`,
        success: function (data) {
          appAjaxCallback.newsInfo(data);
        }
      });

      return <div key={key} style={{margin: "30px"}} >Now Loading...</div>;
    } else {
      return <div key={key} style={{margin: "30px"}} >{info.title}</div>;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div style={{overflow: 'auto', maxHeight: 400}}>
          <ReactList
            itemRenderer={this.renderItem}
            length={this.state.news_list.length}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}

export default App;
