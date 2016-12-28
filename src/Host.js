import DB from './DB'

class Host {
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
    this.lobbyName = null;
  }


  setUpPeerConnection(lobbyName, onMessage){
    this.lobbyName = lobbyName;
    this.pc = new RTCPeerConnection(this.config, this.options);
    this.pc.onicecandidate = this.onIceCandidate.bind(this);
    this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
    this.pc.ondatachannel = this.onDataChannel.bind(this);

    this.createDataChannel(onMessage);
    
    return this.pc.createOffer(this.offerOptions).then(desc => {
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

  onIceCandidate(e){
    if(e.candidate == null) {
      let offer = JSON.stringify(this.pc.localDescription);
      return DB.createLobby(this.lobbyName, offer).then(lobby => {
        this.lobby = lobby;
        DB.watchLobby(lobby.id, this.onClientAnswer.bind(this));
        return lobby;
      }, error => {
        return Promise.reject(error);
      });
    }
  }

  /* First Update from Client */
  onClientAnswer(lobby){
    this.lobby = lobby;
    if(lobby.answer){
      /* DB.stopWatchingLobby(); */
      let desc = new RTCSessionDescription(JSON.parse(lobby.answer));
      this.setRemoteDescription(desc).then(result => {

      });
    }
  }



  setRemoteDescription(desc){
    return this.pc.setRemoteDescription(desc).then(results => {
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }

  /* Data Channel */
  createDataChannel(onMessage){
    this.dc = this.pc.createDataChannel("master");
    this.dc.onopen = this.onDataChannelOpen.bind(this);
    this.dc.onclose = this.onDataChannelClose.bind(this);
    this.dc.onmessage = onMessage;
  }

  onDataChannelOpen(e){
    console.log("Host.onDataChannelOpen", e);
  }

  onDataChannelClose(e){
    console.log("Host.onDataChannelClose", e);
  }

  onDataChannelMessage(e){
    console.log("Host.onDataChannelMessage", e);
  }

  addIceCandidate(iceCandidate){
    this.pc.addIceCandidate(iceCandidate);
  }

  onIceConnectionStateChange(e){

  }


  onDataChannel(e){
    console.log("onDataChannel");
    console.log(e);
  }

  onOpen(){
    console.log("onOpen");
  }

  onClose(){
    console.log("onClose");
  }
}

export default new Host();
