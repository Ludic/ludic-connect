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
    return Host.getMedia().then(stream => {
      this.stream = stream;
      this.audioTracks = stream.getAudioTracks();
      this.videoTracks = stream.getVideoTracks();

      return Host.setUpPeerConnection().then(desc => {
        /* Host.pc.addStream(this.stream);  // TODO REMOVE, not related to data */
        console.log(desc);
        return DB.createLobby("senso", JSON.stringify(desc)).then(lobby => {
          console.log(lobby);
          console.log(lobby.id);
          return lobby;
          /* MUST SEND desc to any client NOW */

        }, error => {
          return Promise.reject(error);
        });
      }, error => {
        return Promise.reject(error);
      });
    }, error => {
      return Promise.reject(error);
    });
  }

  /* Join Lobby */
  joinLobby(lobbyId){
    this.currentLobbyId = lobbyId;
    return Client.setUpPeerConnection().then(desc => {
      /* Host.pc.addStream(this.stream);  // TODO REMOVE, not related to data */
      return DB.watchLobby(lobbyId, this.onJoinedLobbyUpdated.bind(this));
    }, error => {
      return Promise.reject(error);
    });
  }


  /* On Joined Lobby Updated */
  onJoinedLobbyUpdated(lobby){
    console.log("onJoinedLobbyUpdated()");
    console.log(lobby);
    let desc = new RTCSessionDescription(JSON.parse(lobby.offer));
    Client.setRemoteDescription(desc).then(results => {
      console.log(results);
    }, error => {
      return Promise.reject(error);
    });
  }

  onLobbyUpdated(lobby){
    console.log("onLobbyUpdated");
    this.lobby = lobby;
    console.log(this.lobby);
    if(lobby.answer){
      WebRTCHelper.handleOffer(lobby.answer).then(result => {
        console.log("init data channel");
        WebRTCHelper.initDataChannel(WebRTCHelper.pc);
      });
    }
  }

}

export default new LudicConnect();
