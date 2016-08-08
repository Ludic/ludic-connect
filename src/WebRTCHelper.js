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
    this.pc.ondataChannel = this.onDataChannel.bind(this);

    window.pc = this.pc;

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

  /* Peer Connection Events */
  onDataChannel(event){
    window.dc = event.channel;
    console.log('Data channel is created!');
    event.channel.onopen = function() {
      console.log('Data channel is open and ready to be used.');
    };
  }

  /* Data Channel */
  initDataChannel(pc){
    let dc = pc.createDataChannel("master");
    dc.onmessage = this.onMessage.bind(this);
    dc.onopen = this.onOpen.bind(this);
    dc.onclose = this.onClose.bind(this);
    return dc;
  }

  onMessage(event){
    console.log("WebRTCHelper.onMessage()");
    console.log(event);
  }

  onOpen(event){
    console.log("WebRTCHelper.onOpen()");
    console.log(event);
  }

  onClose(event){
    console.log("WebRTCHelper.onClose()");
    console.log(event);
  }
}

export default new WebRTCHelper();
