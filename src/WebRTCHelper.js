class WebRTCHelper {
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

    this.pc = new RTCPeerConnection(this.config, this.options);
    this.dc = this.initDataChannel(this.pc);
    this.tn = null;

    this.sdpConstraints = {
      optional: [],
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    };
  }

  createOffer(){
    return this.pc.createOffer(this.options).then(offer => {
      this.offer = offer;
      return this.pc.setLocalDescription(offer);
    }).then(() => {
      /* let jsonOffer = JSON.stringify(this.pc.localDescription); */
      return this.pc.localDescription;
      /* console.info(jsonOffer);
         console.log(this.pc.localDescription); */
    }).catch(error => {
      console.error(error);
      return error;
    });

  }

  createAnswer(){
    return this.pc.createAnswer(this.options).then(answer => {
      this.answer = answer;
      return this.pc.setLocalDescription(answer);
    }).then(answer => {
      return this.answer;
    }).catch(error => {
      console.error(error);
    });
  }

  handleOffer(jsonOffer){
    let offerDesc = new RTCSessionDescription(JSON.parse(jsonOffer));
    return this.pc.setRemoteDescription(offerDesc);
  }

  /* Data Channel */
  initDataChannel(pc){
    let dc = pc.createDataChannel("master");
    dc.onmessage = this.onMessage;
    dc.onopen = this.onOpen;
    dc.onclose = this.onClose;
    return dc;
  }

  onMessage(event){
    console.log("Master.onMessage()");
    console.log(event);
  }

  onOpen(event){
    console.log("Master.onOpen()");
    console.log(event);
  }

  onClose(event){
    console.log("Master.onClose()");
    console.log(event);
  }
}

export default new WebRTCHelper();
