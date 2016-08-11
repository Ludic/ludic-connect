class Host {
  constructor(){
    this.config = {
      'iceServers': [
        {
          'url': 'stun:stun.l.google.com:19302'
        }
      ]
    };
    this.options = {
      'optional': [{'DtlsSrtpKeyAgreement': true}]
    };

    this.offerOptions =  {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    };

    this.sdpConstraints = {
      optional: [],
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    };
  }

  getMedia(){
    return navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
      return stream;
    }, error => {
      console.error(error);
      return Promise.reject(error);
    });
  }

  setUpPeerConnection(){
    this.pc = new RTCPeerConnection(this.config, this.options);
    /* this.pc = new RTCPeerConnection(null); */
    this.pc.onicecandidate = this.onIceCandidate.bind(this);
    this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
    this.pc.ondatachannel = this.onDataChannel.bind(this);

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

  setRemoteDescription(desc){
    return this.pc.setRemoteDescription(desc).then(results => {
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }

  createDataChannel(){
    this.dc = this.pc.createDataChannel("master");
    this.dc.onmessage = this.onMessage.bind(this);
  }

  addIceCandidate(iceCandidate){
    console.log("adding ice candidate");
    console.log(iceCandidate);
    this.pc.addIceCandidate(iceCandidate);
  }

  /* Events */
  onIceCandidate(e){
    if(e.candidate){
      this.iceCandidate = new RTCIceCandidate(e.candidate);
    }
  }

  onIceConnectionStateChange(e){
    if(this.pc){
      console.log(' ICE state: ' + this.pc.iceConnectionState);
      console.log('ICE state change event: ', e);
    }
  }

  onMessage(e){
    console.log("onMessage");
    console.log(e);
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
