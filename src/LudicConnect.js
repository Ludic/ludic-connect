import WebRTCAdapter from './WebRTCAdapter.js'
import Host from './Host.js'
import Client from './Client.js'
import DB from './DB'

window.Host = Host;
window.Client = Client;

class LudicConnect {
  constructor(){
    this.peers = [];
    this.isHost = false;
  }

  /* Find Lobbies */
  findLobbies(name){
    return DB.findLobbies(name).then(lobbies => {
      return lobbies;
    });
  }

  /* Create a Lobby */
  createLobby(name){
    this.isHost = true;
    this.lobbyName = name;
    return Host.setUpPeerConnection(this.onHostIceCandidate.bind(this)).then(desc => {
      return desc;
    }, error => {
      return Promise.reject(error);
    });
  }


  onHostIceCandidate(e){
    if(e.candidate == null) {
      let offer = JSON.stringify(Host.pc.localDescription);
      return DB.createLobby(this.lobbyName, offer).then(lobby => {
        this.lobby = lobby;
        DB.watchLobby(lobby.id, this.onClientAnswer.bind(this));
        console.log(Host.pc);
        console.log(lobby.id);
        return lobby;
      }, error => {
        return Promise.reject(error);
      });
    }
  }

  /* First Update from Client */
  onClientAnswer(lobby){
    this.lobby = lobby;
    if(lobby.answer){
      DB.stopWatchingLobby();
      let desc = new RTCSessionDescription(JSON.parse(lobby.answer));
      Host.setRemoteDescription(desc).then(result => {

      });
    }
  }

  /* Join Lobby */
  joinLobby(lobbyId){
    this.currentLobbyId = lobbyId;
    Client.setUpPeerConnection(this.onClientIceCandidate.bind(this));
    DB.watchLobby(lobbyId, this.onHostOffer.bind(this));
  }

  /* On Host Offer To Client */
  onHostOffer(lobby){
    if(lobby.offer){
      DB.stopWatchingLobby();
      this.lobby = lobby;
      console.log(this.lobby);
      let desc = new RTCSessionDescription(JSON.parse(lobby.offer));
      return Client.setRemoteDescription(desc).then(() => {
        Client.createAnswer().then(desc => {

        }, error => {
          return Promise.reject(error);
        });
      }, error => {
        return Promise.reject(error);
      });
    }
  }

  onClientIceCandidate(e){
    if(e.candidate == null) {
      let answer = JSON.stringify(Client.pc.localDescription);
      this.lobby.answer = answer;
      /* this.lobby.clientIceCandidate = JSON.stringify(Client.iceCandidate); */
      /* DB.watchLobby(this.lobby.id, this.onHostIceCandidate.bind(this)); */
      DB.updateLobby(this.lobby);
    }
  }
}

export default new LudicConnect();
