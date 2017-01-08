import Host from './Host.js'
import Client from './Client.js'
import Peer from './Peer.js'
import DB from './DB.js'

class LudicConnect {
  constructor(){
    this.peers = [];
    this.connectedPeers = [];
    this.isHost = false;
    this.peerId = null;
    this.lobby = null;
  }

  createLobby(name, type="peer"){
    this.isHost = true;
    return DB.createLobby(name, type).then(lobby => {
      this.lobby = lobby;
      return DB.joinLobby(lobby.id).then(peer => {
        console.log(peer);
        this.peerId = peer.id;
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
    console.log("joinLobby: ", lobby);
    this.lobby = lobby;
    let promises = [];
    for(let key in lobby.peers){
      let peer = lobby.peers[key];
      let newPeer = new Peer(peer.id, peer.name);
      this.peers.push(newPeer);
      let promise = new Promise((resolve, reject) => {
        newPeer.setUpPeerConnection((offer)=> {
          if(offer.candidate == null){
            let offer = JSON.stringify(newPeer.pc.localDescription);
            console.log(offer);
            newPeer.offer = offer;
            resolve(offer);
            return offer;
          } else {
            return null;
          }
        }, null);
      });
      promises.push(promise);
    }

    Promise.all(promises).then(results => {
      /* Update the Lobby here with these Offers */
      let connections = [];
      this.peers.forEach(peer => {
        let connection = {
          for: peer.id,
          offer: peer.offer
        };
        connections.push(connection);
      });
      console.log(connections);
      DB.joinLobby(lobby.id, connections).then(peer => {
        DB.watchLobby(lobby.id, this.onLobbyUpdated.bind(this));
      });
      console.log("connections: ", connections);
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
        if(this.peerId != currentPeers[currentPeers.length - 1].id){
          return this.onPeerJoined(currentLobby.id, currentPeers[currentPeers.length - 1]);
        } else {

          return;
        }
      }

      let diffPeer = null;
      let diff = {};
      oldPeers.forEach(oldPeer => {
        currentPeers.forEach(currentPeer => {
          if((oldPeer.id === currentPeer.id) && (oldPeer != currentPeer) && (this.peerId != currentPeer.id)){
            console.log("found a diff peer");
            console.log(this.peer);
            console.log(oldPeer);
            console.log(currentPeer);
            diffPeer = currentPeer;
          }
        });
      });


      /* if(diff.connections){
         console.log("diffPeer: ", diffPeer);
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

  onPeerJoined(lobbyId, peer){
    peer.connections.forEach(connection => {
      if(connection.for === this.peerId){
        let newPeer = new Peer(peer.id, peer.name);
        this.peers.push(newPeer);
        let offer = JSON.parse(connection.offer);
        let promise = new Promise((resolve, reject) => {
          newPeer.setUpPeerConnection((answer)=> {
            if(offer.candidate == null){
              let answer = JSON.stringify(newPeer.pc.localDescription);
              newPeer.answer = answer;
              resolve(offer);
              return offer;
            } else {
              return null;
            }
          }, offer);
        }).then(results => {
          let connections = [];
          this.peers.forEach(peer => {
            let connection = {
              for: peer.id,
              answer: peer.answer
            };
            connections.push(connection);
          });
          DB.updatePeer(lobbyId, this.peerId, connections);
        });
      }
    });
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
