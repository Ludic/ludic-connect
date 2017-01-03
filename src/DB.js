import firebase from 'firebase'

class DB {
  constructor(){
    var config = {
      apiKey: "AIzaSyBTq7r5XlBsGQk9OD66LgkjJ6qru757DXg",
      authDomain: "ludic-connect.firebaseapp.com",
      databaseURL: "https://ludic-connect.firebaseio.com",
      storageBucket: "ludic-connect.appspot.com",
    };
    
    firebase.initializeApp(config);
    this.lobbies = [];
    this.lobby = null;
    this.oldLobby = null;
    this.oldPeers = null;
    this.peers = [];
  }

  createLobby(name, type){
    let newLobbyKey = firebase.database().ref().child('lobbies').push().key;
    let now = new Date().getTime();
    let lobby = {
      id: newLobbyKey,
      created_at: now,
      updated_at: now,
      name: name,
      type: type
    };

    var updates = {};
    updates['/lobbies/' + newLobbyKey] = lobby;
    return firebase.database().ref().update(updates).then(() => {
      return lobby;
    });
  }

  updateLobby(lobby){
    var updates = {};
    updates['/lobbies/' + lobby.id] = lobby;
    return firebase.database().ref().update(updates);
  }


  removeLobby(id){

  }

  watchLobby(id, cb){
    this.lobbyRef = firebase.database().ref('lobbies').orderByChild("id").equalTo(id);
    return this.lobbyRef.on('value', data => {
      this.oldLobby = this.lobby;
      let _data = data.val();
      for(var key in _data){
        let lb = _data[key];
        this.lobby = lb;
      }
      cb(this.oldLobby, this.lobby);
    });
  }

  stopWatchingLobby(){
    this.lobbyRef.off();
  }

  findLobbies(name){
    this.lobbiesRef = firebase.database().ref('lobbies').orderByChild("name").equalTo(name); 
    return this.lobbiesRef.once('value').then(data => {
      let _data = data.val();
      for(let key in _data){
        this.lobbies.push(_data[key]);
      }
      return this.lobbies;
    });
  }

  joinLobby(lobbyId, peer){
    let newPeerKey = firebase.database().ref().child('peers').push().key;
    let now = new Date().getTime();
    let data = {
      id: newPeerKey,
      lobby_id: lobbyId,
      connections: peer.connections,
      created_at: now,
      updated_at: now,
    };
    var updates = {};
    updates['/lobbies/' + lobbyId + '/peers/' + newPeerKey] = data;
    return firebase.database().ref().update(updates).then(() => {
      return data;
    });
  }

  updatePeer(peer){
    var updates = {};
    updates['/peers/' + peer.id] = peer;
    return firebase.database().ref().update(updates);
  }

  watchPeers(lobbyId, cb){
    this.peerRef = firebase.database().ref('peers').orderByChild("lobby_id").equalTo(lobbyId);
    return this.peerRef.on('value', data => {
      this.oldPeers = this.peers;
      this.peers = [];
      let _data = data.val();
      for(let key in _data){
        this.peers.push(_data[key]);
      }
      cb(this.oldPeers, this.peers);
      return this.peers;
    });
  }
}

export default new DB();
