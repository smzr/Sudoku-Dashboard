import React from 'react';
import logo from './images/logo.svg';
import smLogo from './images/logo-small.png';
import './App.scss';
import Countdown from 'react-countdown';

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      onlinePlayers: null,
      offlinePlayers: null,
      totalOnline: null,
    };

    this.insertPlayers = this.insertPlayers.bind(this);
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
    this.setState({
      onlinePlayers: playerArr.filter((p)=> p.isOnline === true ),
      offlinePlayers: playerArr.filter((p)=> p.isOnline === false && p.isBanned === false )
    })
    this.setState({ loading: false })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.insertPlayers(this.props.data.players)
    }
  }

  render() {
    return (
      <div>
        {this.state.loading || !this.props.data ? (
        <div>Loading...</div>
        ) : (
        <ul className="player-list">
          {this.props.banTime}
          {this.props.data.totalOnline > 0 && <div className="player-list__divider online"><span className="div-left">Online</span> <span className="div-right">[{this.props.data.totalOnline}]</span></div> }
          {this.state.onlinePlayers.map(player => 
          <li key={player.uuid} onClick={ () => this.props.updatePlayerFocus(player.uuid) } className={"player" + (player.isOnline ? " online" : (player.isBanned ? " banned" : " offline"))}>
            <div className="player__head-box">
              <img src={"https://crafatar.com/avatars/" + player.uuid + "?overlay"} alt={player.name} className="player__head" />
            </div>
            <div className="player__info">
              <h6 className="player__info--main">{player.name}</h6>
              <p className="player__info--sub">{player.isOnline ? "Online" : (player.isBanned ? "Banned" : "Offline")}</p>
            </div>
          </li>
          )}
          {this.state.offlinePlayers.length > 0 ? <div className="player-list__divider offline"><span className="div-left">Offline</span> <span className="div-right">[{this.state.offlinePlayers.length}]</span></div> : null }
          {this.state.offlinePlayers.map(player => 
          <li key={player.uuid} onClick={ () => this.props.updatePlayerFocus(player.uuid) } className={"player" + (player.isOnline ? " online" : (player.isBanned ? " banned" : " offline"))}>
            <div className="player__head-box">
              <img src={"https://crafatar.com/avatars/" + player.uuid + "?overlay"} alt={player.name} className="player__head" />
            </div>
            <div className="player__info">
              <h6 className="player__info--main">{player.name}</h6>
              <p className="player__info--sub">{player.isOnline ? "Online" : (player.isBanned ? "Banned" : "Offline")}</p>
            </div>
          </li>
          )}
        </ul>
        )}
		  </div>
    );
  }
}

class BannedPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      bannedPlayers: null
    };

    this.insertPlayers = this.insertPlayers.bind(this);
  }

  insertPlayers(arr) {
    let bannedPlayers = [];
    const playerObj = {
      uuid: null,
      name: null,
      isOnline: false,
      isBanned: false,
      banEnd: null,
      banCountdown: null
    }
    arr.forEach(function (p) {
      if (p.isBanned) {
        let player = Object.create(playerObj);
        player.uuid = p.uuid;
        player.name = p.name;
        player.isOnline = p.isOnline;
        player.isBanned = p.isBanned;
        if (p.banHistory[0]) {
          let banEnd = p.banHistory[0].banEnd;
          banEnd = new Date(banEnd.replace(/-/g, '/')).getTime();
          player.banEnd = banEnd;
          player.banCountdown = banEnd - new Date().getTime();
        }
        bannedPlayers.push(player)
      }
    });
    bannedPlayers.sort((a, b) => (a.banEnd < b.banEnd) ? 1 : -1)
    this.setState({ 
      bannedPlayers: bannedPlayers,
      loading: false
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.insertPlayers(this.props.data.players)
    }
  }

  render() {
    return (
      <div>
        <h2>Dead Players</h2>
        {this.state.loading || !this.props.data ? (
          <div>Loading...</div>
        ) : (
        <ul className="dead-list">
        {this.state.bannedPlayers.map(player => 
          <li key={player.uuid} onClick={ () => this.props.updatePlayerFocus(player.uuid) } className="dead">
            <div className="dead__body-box">
              <img src={"https://crafatar.com/renders/body/" + player.uuid + "?overlay"} alt={ player.name } className="dead__body"/>
              <Countdown date={player.banEnd} renderer={props => <div className="dead__countdown">{props.hours + "h " + props.minutes + "m " + props.seconds + "s" }</div>} />
            </div>
            <h6 className="dead__name">{ player.name }</h6>
            
          </li>
        )}
        </ul>
        )}
        
      </div>
    );
  }
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.player !== this.props.player) {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <div>
      {this.state.loading || !this.props.player ? (
        <div></div>
      ) : (
        <div className={"profile" + (this.props.player.isOnline ? " online" : (this.props.player.isBanned ? " banned" : " offline"))}>
          <div className="profile__picture-box">
            <img src={"https://crafatar.com/avatars/" + this.props.player.uuid + "?overlay"} alt={ this.props.player.name } className="profile__picture"/>
          </div>
          <div className="profile__info">
            <div className="profile__header">
              <h3 className="profile__header--main">{this.props.player.name}</h3>
              <p className="profile__header--sub">{this.props.player.isOnline ? "Online" : (this.props.player.isBanned ? "Banned" : "Offline")}</p>
            </div>
            <div className="profile__stats">
              <div className="stat">
                <div className="stat--label">Deaths</div>
                <div className="stat--value">{this.props.player.totalDeaths}</div>
              </div>
              <div className="stat">
                <div className="stat--label">Playtime</div>
                <div className="stat--value">{ Math.floor((this.props.player.playtimeMS / (1000 * 60 * 60))) + "h" }</div>
              </div>
              <div className="stat">
                <div className="stat--label">Score</div>
                <div className="stat--value">{ Math.round(this.props.player.score * 100) }</div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      focusedPlayer: null
    };

    this.updatePlayerFocus = this.updatePlayerFocus.bind(this);
  }

  async getData() {
    if (!this.state.data) {
      this.setState({ loading: true });
    };
    const url = "https://sudoku-gangban.ga/getdata";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ data: data})
    this.setState({ loading: false });
  }

  updatePlayerFocus(uuid) {
    let player = this.state.data.players.find(p => p.uuid === uuid);
    this.setState({ focusedPlayer: player })
  }

  componentDidMount() {
    this.getData()

    setInterval(() => {
      this.getData()
    }, 5000);
  }

  render() {
    return (
      <div className="app">
        <header className="section">
          <a href="/" className="logo-box">
            <img src={logo} alt="Sudoku Gang" className="logo"/>
            <img src={smLogo} alt="Sudoku Gang" className="logo--small"/>
          </a>
        </header>
        <aside className="section">
          <Players data={this.state.data} updatePlayerFocus={this.updatePlayerFocus}/>
        </aside>
        <main className="section">
          <BannedPlayers data={this.state.data} updatePlayerFocus={this.updatePlayerFocus}/>
          <Profile player={this.state.focusedPlayer}/>
        </main>
      </div>
    );
  }
}


export default (App);
