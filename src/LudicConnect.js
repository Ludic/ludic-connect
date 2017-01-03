import Host from './Host.js'
import Client from './Client.js'
import Peer from './Peer.js'
import DB from './DB.js'

class LudicConnect {
  constructor(){
    this.peers = [];
    this.connectedPeers = [];
    this.isHost = false;
    this.lobby = null;
    this.peer = new Peer();
  }

  createLobby(name, type="peer"){
    this.isHost = true;
    return DB.createLobby(name, type).then(lobby => {
      this.lobby = lobby;
      return DB.joinLobby(lobby.id, this.peer).then(peer => {
        this.peer.id = peer.id;
        this.peer.created_at = peer.created_at;
        DB.watchLobby(lobby.id, this.onLobbyUpdated.bind(this));
        return lobby;
      });
    });
  }
  findLobbies(name){
    return DB.findLobbies(name).then(lobbies => {
      return lobbies;
    });
  }

  joinLobby(lobby){
    this.lobby = lobby;
    let promises = [];
    for(let key in lobby.peers){
      let peer = lobby.peers[key];
      let peerPromise = new Promise(function(resolve, reject){
        let newPeer = new Peer(peer.id, peer.name, function(e){
          if(e.candidate == null) {
            let offer = JSON.stringify(newPeer.pc.localDescription);
            newPeer.offer = offer;
            resolve(offer)
          } 
        }.bind(this));
        this.peers.push(newPeer);
      }.bind(this));
      promises.push(peerPromise);
    }
    
    Promise.all(promises).then(results => {
      this.peers.forEach(peer => {
        let connection = {
          to: peer.id,
          offer: peer.offer
        };
        this.peer.connections.push(connection);
      });

      return DB.joinLobby(lobby.id, this.peer).then(peer => {
        this.peer.created_at = peer.created_at;
        this.peer.id = peer.id;
        DB.watchLobby(lobby.id, this.onLobbyUpdated.bind(this));
        return peer;
      });
    });
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
  onLobbyUpdated(oldLobby, currentLobby){
    console.log("onLobbyUpdated");
    console.log("oldLobby: ", oldLobby);
    console.log("currentLobby: ", currentLobby);

    if(this.init){
      let oldPeers = oldLobby.peers;
      let currentPeers = currentLobby.peers;

      if(oldPeers.length > currentPeers.length){
        return this.onPeerRemoved();
      }


      if(oldPeers.length < currentPeers.length){
        if(this.peer.id != currentPeers[currentPeers.length - 1].id){
          return this.onPeerJoined(currentPeers[currentPeers.length - 1]);
        } else {

          return;
        }
      }

      /* let diffPeer = null;
         let diff = {};
         oldPeers.forEach(oldPeer => {
         currentPeers.forEach(currentPeer => {
         if((oldPeer.id === currentPeer.id) && (oldPeer != currentPeer) && (this.peer.id != currentPeer.id)){
         diffPeer = currentPeer;
         for(let key in currentPeer){
         if(key != 'updated_at'){
         if(currentPeer[key] != oldPeer[key]){
         diff[key] = currentPeer[key];
         }
         }
         }
         }
         });
         });


         if(diff.connections){
         diff.connections.forEach(connection => {
         if(connection.for === this.peer.id){
         if(connection.offer){
         this.handleOffer(diffPeer, connection.offer);
         } else if(connection.answer){
         this.handleAnswer(diffPeer, connection.answer);
         }
         }
         });
         } else {
         
         } */
    } else {
      this.init = true; 
    }
  }

  onPeerRemoved(){
    console.log("onPeerRemoved()");
  }

  onPeerJoined(peer){
    if(this.peer.created_at < peer.created_at){
      Peer.setUpPeerConnection(peer).then(results => {
        console.log(results);
      });
    }
  }

  handleOffer(peer, offer){
    console.log("Handle Offer");
    console.log(offer);
  }
  
  handleAnswer(peer, answer){
    console.log("Handle Answer");
    console.log(answer);
  }
  

  
  onMessage(){
    /* overide  */
  }
}

export default new LudicConnect();
