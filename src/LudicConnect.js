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
        console.log(peer);
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
    /* console.log("onLobbyUpdated");
       console.log("oldLobby: ", oldLobby);
       console.log("currentLobby: ", currentLobby); */

    if(this.init){
      let oldPeers = [];
      for(let key in oldLobby.peers){
        oldPeers.push(oldLobby.peers[key]);
      }

      let currentPeers = [];
      for(let key in currentLobby.peers){
        currentPeers.push(currentLobby.peers[key]);
      }

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

      let diffPeer = null;
      let diff = {};
      oldPeers.forEach(oldPeer => {
        currentPeers.forEach(currentPeer => {
          if((oldPeer.id === currentPeer.id) && (oldPeer != currentPeer) && (this.peer.id != currentPeer.id)){
            console.log("found a diff peer");
            console.log(this.peer);
            console.log(oldPeer);
            console.log(currentPeer);
            diffPeer = currentPeer;
          }
        });
      });

      console.log("diffPeer: ", diffPeer);
      /* if(diff.connections){
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
    peer.connections.forEach(connection => {
      if(connection.to === this.peer.id){
        let peerPromise = new Promise(function(resolve, reject){
          let newPeer = new Peer(peer.id, peer.name, function(e){
            if(e.candidate == null) {
              let offer = JSON.stringify(newPeer.pc.localDescription);
              newPeer.offer = offer;
              this.peers.push(newPeer);
              resolve(offer);
            }
          }.bind(this));
        }.bind(this));
        Promise.all([peerPromise]).then(offer => {
          console.log("offer");
          console.log(offer);
          this.handleOffer(this.peers[this.peers.length - 1], connection.offer);
        })
      }
    });
  }

  handleOffer(peer, offer){
    console.log("Handle Offer");
    console.log(offer);
    peer.handleOffer(offer);
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
