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


  setUpPeerConnection(onIceCandidate){
    this.pc = new RTCPeerConnection(this.config, this.options);
    this.pc.onicecandidate = onIceCandidate;
    this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
    this.pc.ondatachannel = this.onDataChannel.bind(this);

    this.createDataChannel();
    
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

  /* Data Channel */
  createDataChannel(){
    this.dc = this.pc.createDataChannel("master");
    this.dc.onopen = this.onDataChannelOpen.bind(this);
    this.dc.onclose = this.onDataChannelClose.bind(this);
    this.dc.onmessage = this.onDataChannelMessage.bind(this);
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
    console.log("adding ice candidate");
    console.log(iceCandidate);
    this.pc.addIceCandidate(iceCandidate);
  }

  onIceConnectionStateChange(e){
    if(this.pc){
      console.log(' ICE state: ' + this.pc.iceConnectionState);
      console.log('ICE state change event: ', e);
    }
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
