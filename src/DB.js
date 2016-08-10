import firebase from './firebase.js'

class DB {
  constructor(){
    var config = {
      apiKey: "AIzaSyBTq7r5XlBsGQk9OD66LgkjJ6qru757DXg",
      authDomain: "ludic-connect.firebaseapp.com",
      databaseURL: "https://ludic-connect.firebaseio.com",
      storageBucket: "ludic-connect.appspot.com",
    };
    firebase.initializeApp(config);
  }

  createLobby(name, jsonOffer){
    let newLobbyKey = firebase.database().ref().child('lobbies').push().key;
    let now = new Date().getTime();
    let lobby = {
      id: newLobbyKey,
      created_at: now,
      updated_at: now,
      offer: jsonOffer
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
      let _data = data.val();
      for(var key in _data){
        let lb = _data[key];
        this.lobby = lb;
      }
      cb(this.lobby);
    });
  }

  stopWatchingLobby(){
    this.lobbyRef.off();
  }

  findLobbies(name){
    this.lobbiesRef = firebase.database().ref('lobbies').orderByChild("name").equalTo(name);
    this.lobbiesRef.once('value', data => {
      this.lobbies = [];
      let _data = data.val();
      for(var key in _data){
        let lb = _data[key];
        this.lobbies.push(lb);
      }
      Notifications.notify("RouteModel.routesUpdated");
    });
  }
}

export default new DB();
