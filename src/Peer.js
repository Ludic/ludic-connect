import DB from './DB'

class Peer {
  constructor(id, name){
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

    this.id = id;
    this.name = name;
    this.pc = null;
    this.dc = null;
    this.connections = [];
  }
  
  setUpPeerConnection(iceCB, hostOffer){
    this.pc = new RTCPeerConnection(this.config, this.options);
    this.createDataChannel();

    if(iceCB){
      this.pc.onicecandidate = iceCB;
    } else {
      this.pc.onicecandidate = this.onIceCandidate.bind(this);
    }
    
    if(hostOffer){
      this.handleOffer(hostOffer);
    } else {
      return this.pc.createOffer().then(desc => {
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
  }

  onIceCandidate(e){
    if(e.candidate == null) {
      let offer = JSON.stringify(this.pc.localDescription);
      this.offer = offer;
      return offer;
    } else {
      return null;
    }
  }

  handleOffer(offer){
    let desc = new RTCSessionDescription(offer);
    return this.pc.setRemoteDescription(desc).then(results => {
      this.createAnswer().then(answer => {
        return answer;
      }, error => {
        return Promise.reject(error);
      });
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }

  handleAnswer(peer, offer){
    this.lobby = lobby;
    if(lobby.answer){
      let desc = new RTCSessionDescription(JSON.parse(lobby.answer));
      this.setRemoteDescription(desc).then(result => {

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

  setRemoteDescription(answer){
    let desc = new RTCSessionDescription(answer);
    return this.pc.setRemoteDescription(desc).then(results => {
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }

  /* Data Channel */
  createDataChannel(){
    this.dc = this.pc.createDataChannel("master");
    this.dc.onopen = this.onDataChannelOpen.bind(this);
    this.dc.onclose = this.onDataChannelClose.bind(this);
    this.dc.onmessage = this.onDataChannelMessage.bind(this);
  }

  onDataChannelOpen(e){
    console.log("Peer.onDataChannelOpen", e);
  }

  onDataChannelClose(e){
    console.log("Peer.onDataChannelClose", e);
  }

  onDataChannelMessage(e){
    console.log("Peer.onDataChannelMessage", e);
  }

  /* ICE */
  addIceCandidate(iceCandidate){
    this.pc.addIceCandidate(iceCandidate);
  }

  onIceConnectionStateChange(e){

  }

  /* Peer Connection */
  onOpen(){
    console.log("onOpen");
  }

  onClose(){
    console.log("onClose");
  }
}

export default Peer;
