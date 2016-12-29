import Host from './Host.js'
import Client from './Client.js'
import DB from './DB.js'

class LudicConnect {
  constructor(){
    this.peers = [];
    this.isHost = false;
    this.Host = Host;
    this.Client = Client;
  }

  createLobby(lobbyName){
    this.isHost = true;
    return Host.setUpPeerConnection(lobbyName, this.onMessage.bind(this)).then(desc => {
      return desc;
    }, error => {
      return Promise.reject(error);
    });
  }

  findLobbies(name){
    return DB.findLobbies(name).then(lobbies => {
      return lobbies;
    });
  }

  joinLobby(lobbyId, cb){
    this.isHost = false;
    Client.setUpPeerConnection(lobbyId, this.onMessage.bind(this), cb);
  }

  send(data){
    if(this.isHost){
      if(Host.dc.readyState === 'open'){
        Host.dc.send(data);
      } else {
        console.error("Host Data Channel not Open");
      }
    } else {
      if(Client.dc.readyState === 'open'){
        Client.dc.send(data);
      } else {
        console.error("Client Data Channel not Open");
      }
    }
  }

  /* Events */
  
  onMessage(){
    /* overide  */
  }

  onPeerJoined(){
    
  }
}

export default new LudicConnect();
