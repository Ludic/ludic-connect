class Client {
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
    this.pc.onicecandidate = this.onIceCanidate.bind(this);
    this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);

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

  onIceCanidate(e){
    /* Must send to Client, they must call pc.addIceCandidate(RTCIceCandidate)  */
    if(e.candidate){
      console.log("onIceCandidate: ", e);
      this.iceCandidate = new RTCIceCandidate(e.candidate);
    }
  }

  onIceConnectionStateChange(e){
    if(this.pc){
      console.log(getName(this.pc) + ' ICE state: ' + this.pc.iceConnectionState);
      console.log('ICE state change event: ', e);
    }
  }

  setRemoteDescription(desc){
    return this.pc.setRemoteDescription(desc).then(results => {
      return results;
    }, error => {
      return Promise.reject(error);
    });
  }
}

export default new Client();
