import LudicConnect from './LudicConnect'
window.ludicConnnect = LudicConnect;


let createLobbyButton = document.getElementById('createLobby');
let findLobbiesButton = document.getElementById('findLobbies');

createLobbyButton.addEventListener('click', function(){LudicConnect.createLobby("testLobby")}, false);


findLobbiesButton.addEventListener('click', function(){LudicConnect.findLobbies("testLobby").then(lobbies => {
  console.log("all lobbies: ", lobbies);
  let currentLobby = lobbies[0];
  console.log("joining: ", currentLobby);
  LudicConnect.joinLobby(currentLobby.id);
})}, false);

