import WebRTCAdapter from './WebRTCAdapter.js'
import WebRTCHelper from './WebRTCHelper.js'
import DB from './DB'

class LudicConnect {
  constructor(){
    let lobbyId = "-KObw8tXYWT8YR1xnpBO";
    /* this.joinLobby(lobbyId); */
    this.createLobby("senso");
  }

  createLobby(name){
    WebRTCHelper.createOffer().then(offer => {
      let jsonOffer = JSON.stringify(offer);
      DB.createLobby(name, jsonOffer).then(lobby => {
        DB.watchLobby(lobby.id, this.onLobbyUpdated.bind(this));
      });
    }, error => {
      console.error(error);
    });
  }

  findLobbies(name){
    DB.findLobbies(name).then(lobbies => {
      console.log(lobbies);
    });
  }

  joinLobby(lobbyId){
    this.connect = function(lobby){
      this.lobby = lobby;
      WebRTCHelper.handleOffer(lobby.offer).then(result => {
        WebRTCHelper.createAnswer(lobby.offer).then(answer => {
          this.lobby.answer = JSON.stringify(answer);
          DB.stopWatchingLobby();
          DB.updateLobby(this.lobby);
          WebRTCHelper.initDataChannel(WebRTCHelper.pc);
          /* WebRTCHelper.dc.send("fuck"); */
        });
      });
    }
    DB.watchLobby(lobbyId, this.connect.bind(this));
  }

  onLobbyUpdated(lobby){
    console.log("onLobbyUpdated");
    this.lobby = lobby;
    console.log(this.lobby);
    if(lobby.answer){
      WebRTCHelper.handleOffer(lobby.answer).then(result => {
        console.log(WebRTCHelper.dc);
        WebRTCHelper.initDataChannel(WebRTCHelper.pc);
        WebRTCHelper.dc.send("fuck");
      });
    }
  }

}

export default new LudicConnect();
