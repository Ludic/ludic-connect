import WebRTCAdapter from './WebRTCAdapter.js'
import Host from './Host.js'
import Client from './Client.js'
import DB from './DB'

class LudicConnect {
  constructor(){
    /* let lobbyId = "-KObw8tXYWT8YR1xnpBO"; */
    /* this.joinLobby(lobbyId); */
    /* this.createLobby("senso"); */
    this.stream = null;
    this.audioTracks = null;
    this.videoTracks = null;
    this.localVideo = document.getElementById('localVideo');
  }

  /* Find Lobbies */
  findLobbies(name){
    DB.findLobbies(name).then(lobbies => {
      console.log(lobbies);
    });
  }

  /* Create Lobby */
  createLobby(name){
    return Host.setUpPeerConnection().then(desc => {
      return DB.createLobby("senso", JSON.stringify(desc)).then(lobby => {
        this.lobby = lobby;
        DB.watchLobby(lobby.id, this.onClientAnswer.bind(this));
        console.log(Host.pc);
        console.log(lobby.id);
        return lobby;
      }, error => {
        return Promise.reject(error);
      });
    }, error => {
      return Promise.reject(error);
    });
  }

  /* First Update from Client */
  onClientAnswer(lobby){
    this.lobby = lobby;
    if(lobby.answer){
      DB.stopWatchingLobby();
      let desc = new RTCSessionDescription(JSON.parse(lobby.answer));
      Host.setRemoteDescription(desc).then(result => {
        this.lobby.hostIceCandidate = JSON.stringify(Host.iceCandidate);
        Host.addIceCandidate(JSON.parse(lobby.clientIceCandidate));
        DB.updateLobby(this.lobby);
        console.log(Host.pc);
      });
    }
  }

  /* Join Lobby */
  joinLobby(lobbyId){
    this.currentLobbyId = lobbyId;
    Client.setUpPeerConnection();
    DB.watchLobby(lobbyId, this.onHostOffer.bind(this));
  }

  /* On Host Offer To Client */
  onHostOffer(lobby){
    if(lobby.offer){
      DB.stopWatchingLobby();
      this.lobby = lobby;
      console.log(this.lobby);
      let desc = new RTCSessionDescription(JSON.parse(lobby.offer));
      Client.setRemoteDescription(desc).then(() => {
        Client.createAnswer().then(desc => {
          this.lobby.answer = JSON.stringify(desc);
          setTimeout(() => {
            this.lobby.clientIceCandidate = JSON.stringify(Client.iceCandidate);
            DB.watchLobby(this.lobby.id, this.onHostIceCandidate.bind(this));
            DB.updateLobby(this.lobby).then(() => {

            }, error => {
              return Promise.reject(error);
            });
          }, 555)
        }, error => {
          return Promise.reject(error);
        });
      }, error => {
        return Promise.reject(error);
      });
    }
  }

  onHostIceCandidate(lobby){
    if(lobby.hostIceCandidate){
      console.log("got host ice");
      DB.stopWatchingLobby();
      this.lobby = lobby;
      Client.addIceCandidate(JSON.parse(lobby.hostIceCandidate));
      Client.createDataChannel();
      console.log(Client.pc);
      console.log(Client.dc);
    }

  }


}

export default new LudicConnect();
