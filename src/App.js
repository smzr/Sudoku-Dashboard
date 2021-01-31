import React from 'react';
import logo from './images/logo.svg';
import './App.scss';

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      players: null,
      totalOnline: null,
    };

    this.insertPlayers = this.insertPlayers.bind(this);
    this.refreshPlayers = this.refreshPlayers.bind(this);
  }
  
  insertPlayers(arr) {
    let playerArr = [];
    const playerObj = {
      uuid: null,
      name: null,
      isOnline: false,
      isBanned: false,
      banHistory: null,
    }
    arr.forEach(function (p) {
      let player = Object.create(playerObj);
      player.uuid = p.uuid;
      player.name = p.name;
      player.isOnline = p.isOnline;
      player.isBanned = p.isBanned;
      player.banHistory = p.banHistory;
      playerArr.push(player)
    });
    playerArr.sort((a, b) => (a.isBanned < b.isBanned) ? 1 : -1)
    playerArr.sort((a, b) => (a.isOnline < b.isOnline) ? 1 : -1)
    this.setState({ players: playerArr })
  }

  async refreshPlayers() {
    this.setState({ loading: true })
    const url = "https://sudoku-gangban.ga/getdata";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ totalOnline: data.totalOnline })
    this.insertPlayers(data.players)
    this.setState({ loading: false })
  }

  componentDidMount() {
    this.refreshPlayers()
  }

  render() {
    return (
      <div>
        <div className="online-players__header">
          <h2>Who's playing</h2>
          <span className="total-players">{this.state.loading ? 0 : this.state.totalOnline} players online</span>
        </div>
        {this.state.loading || !this.state.players ? (
        <div>Loading...</div>
        ) : (
        <div className="online-players">
          {this.state.players.map(player => 
          <div key={player.uuid} className={"player" + (player.isOnline ? " online" : (player.isBanned ? " banned" : " offline"))}>
            <div className="player__head">
              <img src={"https://crafatar.com/avatars/" + player.uuid} alt={player.name} />
              <span className="status"></span>
            </div>
            <p className="player__name">{player.name}</p>
            {player.isBanned ? (<span className="tooltip">{player.banHistory[player.banHistory.length - 1].banReason} </span>) : null}
          </div>
          )}
        </div>
        )}
		  </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <header className="navbar">
          <div className="navbar__inner">
            <div className="navbar__items">
              <a className="navbar__brand" href="/">
                <img src={logo} alt="Sudoku Gang" />
              </a>
            </div>
            <div className="navbar__items navbar__items--right">
              <a className="navbar__item navbar__link" href="https://i.imgur.com/QCPHRwl.png" target="_blank"><small>Dashboard by Sammy</small></a>
            </div>
          </div>
        </header>
        <main>
          <section>
            <div className="wrapper">
              <Players/>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
