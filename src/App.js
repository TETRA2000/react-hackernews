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
    this.fetchNewsInfo = this.fetchNewsInfo.bind(this);
  }

  componentWillMount(){
    appAjaxCallback.newsList = (data) => {
      const list = data.map((item) => { return {id: item}});
      this.setState({
        news_list: list,
      });
    };

    appAjaxCallback.startNewsInfoLoading = (id) => {
      const news_info = this.state.news_info;
      const info = news_info[id] || {};
      news_info[id] = jQuery.extend(info, {loading: true});

      this.setState({
        news_info: news_info
      });
    };

    appAjaxCallback.newsInfo = (data) => {
      // this.state.news_info[data.id] = data;

      const news_info = this.state.news_info;
      news_info[data.id] = data;
      this.setState({
        news_info: news_info
      });

      // TODO update news list
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

  fetchNewsInfo(id) {
    $.ajax({
      dataType: "json",
      url: `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      beforeSend: function () {
        // FIXME updating state while rendering
        appAjaxCallback.startNewsInfoLoading(id);
      },
      success: function (data) {
        appAjaxCallback.newsInfo(data);
      }
    });
  }

  renderItem(index, key) {
    const item = this.state.news_list[index];
    const news_info = this.state.news_info;
    const info = news_info[item.id] || {};

    if(typeof info.id === "undefined") {
      if (info.loading !== true) {
        this.fetchNewsInfo(item.id);
      }

      return <div key={key} className="App-news-list-item" >Now Loading...</div>;
    } else {
      return <div key={key} className="App-news-list-item" ><a href={info.url} target="_blank">{info.title}</a></div>;
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>react-hackernews</h2>
        </div>
        <div className="App-news-list">
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
