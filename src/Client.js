import DB from './DB'

class Client {
  constructor(){
    this.config = {
      'iceServers': [
        {
          'url': 'stun:stun.l.google.com:19305'
        }
      ]
    };
    this.options = {
      'optional': [{'DtlsSrtpKeyAgreement': true}]
    };

    this.pc = null;
    this.dc = null;
    this.onMessage = null;
  }

  setUpPeerConnection(lobbyId, onMessage){
    this.onMessage = onMessage;
    this.pc = new RTCPeerConnection(this.config, this.options);
    this.pc.onicecandidate = this.onIceCandidate.bind(this);
    this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
    this.pc.ondatachannel = this.onDataChannel.bind(this);
    DB.watchLobby(lobbyId, this.onHostOffer.bind(this));
  }

  onIceCandidate(e){
    if(e.candidate == null) {
      let answer = JSON.stringify(this.pc.localDescription);
      this.lobby.answer = answer;
      DB.updateLobby(this.lobby);
    }
  }

  onHostOffer(lobby){
    if(lobby.offer){
      DB.stopWatchingLobby();
      this.lobby = lobby;
      console.log(this.lobby);
      let desc = new RTCSessionDescription(JSON.parse(lobby.offer));
      return this.setRemoteDescription(desc).then(() => {
        this.createAnswer().then(desc => {

        }, error => {
          return Promise.reject(error);
        });
      }, error => {
        return Promise.reject(error);
      });
    }
  }

  createAnswer(){
    return this.pc.createAnswer().then(desc => {
      return this.pc.setLocalDescription(desc).then(() => {
        return desc;
      }, error => {
        console.error(error);
        return Promise.reject(error);
      });
    }, error => {
      console.error(error);
      return Promise.reject(error);
    });
  }

  setRemoteDescription(desc){
    return this.pc.setRemoteDescription(desc).then(results => {
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }

  addIceCandidate(candidate){
    this.pc.addIceCandidate(candidate);
  }

  onIceConnectionStateChange(e){
    if(this.pc){
      console.log(' ICE state: ' + this.pc.iceConnectionState);
      console.log('ICE state change event: ', e);
    }
  }

  /* onMessage(e){
     console.log("onMessage");
     console.log(e);
     } */

  onDataChannel(e){
    console.log("onDataChannel");
    console.log(e);
    this.dc = e.channel
    this.dc.onmessage = this.onMessage.bind(this);
  }

  onOpen(){
    console.log("onOpen");
  }

  onClose(){
    console.log("onClose");
  }
}

export default new Client();
