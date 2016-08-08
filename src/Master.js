import Notifications from '../services/NotificationService'

class Master {
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
    this.dc = null;
    this.tn = null;

    this.sdpConstraints = {
      optional: [],
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
      }
    };

    this.pc.createOffer(this.options).then(offer => {
      this.offer = offer;
      return this.pc.setLocalDescription(offer);
    }).then(() => {
      let jsonOffer = JSON.stringify(this.pc.localDescription);
      console.info(jsonOffer);
      console.log(this.pc.localDescription);
      window.offer = this.pc.localDescription;
      this.dc = this.initDataChannel(this.pc);
      /* probably send this somehow */
      /* sendToServer({
         name: myUsername,
         target: targetUsername,
         type: "video-offer",
         sdp: myPeerConnection.localDescription
         }); */
    }).catch(error => {
      console.error(error);
      return error;
    });

    window.pc = this.pc;
    window.handleOffer = this.handleOffer.bind(this);
  }

  createAnswer(){
    this.pc.createAnswer(this.options).then(answerDesc => {
      this.pc.setLocalDescription(answerDesc);
      console.log(JSON.stringify(answerDesc));
    }, error => {
      console.error(error);
    });
  }

  handleOffer(jsonOffer){
    if(typeof jsonOffer === "string"){
      let offerDesc = new RTCSessionDescription(JSON.parse(jsonOffer));
    } else {
      let offerDesc = new RTCSessionDescription(jsonOffer);
    }
    this.pc.setRemoteDescription(offerDesc);
    this.createAnswer();
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

export default new Master();
