module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebRTCAdapter = __webpack_require__(4);

var _WebRTCAdapter2 = _interopRequireDefault(_WebRTCAdapter);

var _Host = __webpack_require__(3);

var _Host2 = _interopRequireDefault(_Host);

var _Client = __webpack_require__(1);

var _Client2 = _interopRequireDefault(_Client);

var _DB = __webpack_require__(2);

var _DB2 = _interopRequireDefault(_DB);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.Host = _Host2.default;
window.Client = _Client2.default;

var LudicConnect = function () {
  function LudicConnect() {
    _classCallCheck(this, LudicConnect);

    this.peers = [];
    this.isHost = false;
  }

  /* Find Lobbies */


  _createClass(LudicConnect, [{
    key: 'findLobbies',
    value: function findLobbies(name) {
      return _DB2.default.findLobbies(name).then(function (lobbies) {
        return lobbies;
      });
    }

    /* Create a Lobby */

  }, {
    key: 'createLobby',
    value: function createLobby(name) {
      this.isHost = true;
      this.lobbyName = name;
      return _Host2.default.setUpPeerConnection(this.onHostIceCandidate.bind(this)).then(function (desc) {
        return desc;
      }, function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: 'onHostIceCandidate',
    value: function onHostIceCandidate(e) {
      var _this = this;

      if (e.candidate == null) {
        var offer = JSON.stringify(_Host2.default.pc.localDescription);
        return _DB2.default.createLobby(this.lobbyName, offer).then(function (lobby) {
          _this.lobby = lobby;
          _DB2.default.watchLobby(lobby.id, _this.onClientAnswer.bind(_this));
          console.log(_Host2.default.pc);
          console.log(lobby.id);
          return lobby;
        }, function (error) {
          return Promise.reject(error);
        });
      }
    }

    /* First Update from Client */

  }, {
    key: 'onClientAnswer',
    value: function onClientAnswer(lobby) {
      this.lobby = lobby;
      if (lobby.answer) {
        _DB2.default.stopWatchingLobby();
        var desc = new RTCSessionDescription(JSON.parse(lobby.answer));
        _Host2.default.setRemoteDescription(desc).then(function (result) {});
      }
    }

    /* Join Lobby */

  }, {
    key: 'joinLobby',
    value: function joinLobby(lobbyId) {
      this.currentLobbyId = lobbyId;
      _Client2.default.setUpPeerConnection(this.onClientIceCandidate.bind(this));
      _DB2.default.watchLobby(lobbyId, this.onHostOffer.bind(this));
    }

    /* On Host Offer To Client */

  }, {
    key: 'onHostOffer',
    value: function onHostOffer(lobby) {
      if (lobby.offer) {
        _DB2.default.stopWatchingLobby();
        this.lobby = lobby;
        console.log(this.lobby);
        var desc = new RTCSessionDescription(JSON.parse(lobby.offer));
        return _Client2.default.setRemoteDescription(desc).then(function () {
          _Client2.default.createAnswer().then(function (desc) {}, function (error) {
            return Promise.reject(error);
          });
        }, function (error) {
          return Promise.reject(error);
        });
      }
    }
  }, {
    key: 'onClientIceCandidate',
    value: function onClientIceCandidate(e) {
      if (e.candidate == null) {
        var answer = JSON.stringify(_Client2.default.pc.localDescription);
        this.lobby.answer = answer;
        /* this.lobby.clientIceCandidate = JSON.stringify(Client.iceCandidate); */
        /* DB.watchLobby(this.lobby.id, this.onHostIceCandidate.bind(this)); */
        _DB2.default.updateLobby(this.lobby);
      }
    }
  }]);

  return LudicConnect;
}();

exports.default = new LudicConnect();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client() {
    _classCallCheck(this, Client);

    this.config = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
      }]
    };
    this.options = {
      'optional': [{ 'DtlsSrtpKeyAgreement': true }]
    };

    this.offerOptions = {
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

  _createClass(Client, [{
    key: 'setUpPeerConnection',
    value: function setUpPeerConnection(onIceCandidate) {
      this.pc = new RTCPeerConnection(this.config, this.options);
      this.pc.onicecandidate = onIceCandidate;
      this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
      this.pc.ondatachannel = this.onDataChannel.bind(this);
    }
  }, {
    key: 'createAnswer',
    value: function createAnswer() {
      var _this = this;

      return this.pc.createAnswer().then(function (desc) {
        return _this.pc.setLocalDescription(desc).then(function () {
          return desc;
        }, function (error) {
          console.error(error);
          return Promise.reject(error);
        });
      }, function (error) {
        console.error(error);
        return Promise.reject(error);
      });
    }
  }, {
    key: 'setRemoteDescription',
    value: function setRemoteDescription(desc) {
      return this.pc.setRemoteDescription(desc).then(function (results) {
        return results;
      }, function (error) {
        return Promise.reject(error);
      });
    }
  }, {
    key: 'addIceCandidate',
    value: function addIceCandidate(candidate) {
      this.pc.addIceCandidate(candidate);
    }
  }, {
    key: 'createDataChannel',
    value: function createDataChannel() {
      this.dc = this.pc.createDataChannel("master");
      this.dc.onmessage = this.onMessage.bind(this);
    }
  }, {
    key: 'onIceConnectionStateChange',
    value: function onIceConnectionStateChange(e) {
      if (this.pc) {
        console.log(' ICE state: ' + this.pc.iceConnectionState);
        console.log('ICE state change event: ', e);
      }
    }
  }, {
    key: 'onMessage',
    value: function onMessage(e) {
      console.log("onMessage");
      console.log(e);
    }
  }, {
    key: 'onDataChannel',
    value: function onDataChannel(e) {
      console.log("onDataChannel");
      console.log(e);
      this.dc = e.channel;
      this.dc.onmessage = this.onMessage.bind(this);
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      console.log("onOpen");
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      console.log("onClose");
    }
  }]);

  return Client;
}();

exports.default = new Client();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = __webpack_require__(5);

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DB = function () {
  function DB() {
    _classCallCheck(this, DB);

    var config = {
      apiKey: "AIzaSyBTq7r5XlBsGQk9OD66LgkjJ6qru757DXg",
      authDomain: "ludic-connect.firebaseapp.com",
      databaseURL: "https://ludic-connect.firebaseio.com",
      storageBucket: "ludic-connect.appspot.com"
    };
    _firebase2.default.initializeApp(config);

    this.lobbies = [];
    this.currentLobby = {};
  }

  _createClass(DB, [{
    key: "createLobby",
    value: function createLobby(name, jsonOffer) {
      var newLobbyKey = _firebase2.default.database().ref().child('lobbies').push().key;
      var now = new Date().getTime();
      var lobby = {
        id: newLobbyKey,
        created_at: now,
        updated_at: now,
        name: name,
        offer: jsonOffer
      };

      var updates = {};
      updates['/lobbies/' + newLobbyKey] = lobby;
      return _firebase2.default.database().ref().update(updates).then(function () {
        return lobby;
      });
    }
  }, {
    key: "updateLobby",
    value: function updateLobby(lobby) {
      var updates = {};
      updates['/lobbies/' + lobby.id] = lobby;
      return _firebase2.default.database().ref().update(updates);
    }
  }, {
    key: "removeLobby",
    value: function removeLobby(id) {}
  }, {
    key: "watchLobby",
    value: function watchLobby(id, cb) {
      var _this = this;

      this.lobbyRef = _firebase2.default.database().ref('lobbies').orderByChild("id").equalTo(id);
      return this.lobbyRef.on('value', function (data) {
        var _data = data.val();
        for (var key in _data) {
          var lb = _data[key];
          _this.lobby = lb;
        }
        cb(_this.lobby);
      });
    }
  }, {
    key: "stopWatchingLobby",
    value: function stopWatchingLobby() {
      this.lobbyRef.off();
    }
  }, {
    key: "findLobbies",
    value: function findLobbies(name) {
      var _this2 = this;

      this.lobbiesRef = _firebase2.default.database().ref('lobbies').orderByChild("name").equalTo(name);
      return this.lobbiesRef.once('value').then(function (data) {
        var _data = data.val();
        for (var key in _data) {
          _this2.lobbies.push(_data[key]);
        }
        return _this2.lobbies;
      });
    }
  }]);

  return DB;
}();

exports.default = new DB();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Host = function () {
  function Host() {
    _classCallCheck(this, Host);

    this.config = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19305'
      }]
    };
    this.options = {
      'optional': [{ 'DtlsSrtpKeyAgreement': true }]
    };

    this.offerOptions = {
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

  _createClass(Host, [{
    key: 'setUpPeerConnection',
    value: function setUpPeerConnection(onIceCandidate) {
      var _this = this;

      this.pc = new RTCPeerConnection(this.config, this.options);
      this.pc.onicecandidate = onIceCandidate;
      this.pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
      this.pc.ondatachannel = this.onDataChannel.bind(this);

      this.createDataChannel();

      return this.pc.createOffer(this.offerOptions).then(function (desc) {
        return _this.pc.setLocalDescription(desc).then(function () {
          return desc;
        }, function (error) {
          console.error(error);
          return Promise.reject(error);
        });
      }, function (error) {
        console.error(error);
        return Promise.reject(error);
      });
    }
  }, {
    key: 'setRemoteDescription',
    value: function setRemoteDescription(desc) {
      return this.pc.setRemoteDescription(desc).then(function (results) {
        return results;
      }, function (error) {
        return Promise.reject(error);
      });
    }

    /* Data Channel */

  }, {
    key: 'createDataChannel',
    value: function createDataChannel() {
      this.dc = this.pc.createDataChannel("master");
      this.dc.onopen = this.onDataChannelOpen.bind(this);
      this.dc.onclose = this.onDataChannelClose.bind(this);
      this.dc.onmessage = this.onDataChannelMessage.bind(this);
    }
  }, {
    key: 'onDataChannelOpen',
    value: function onDataChannelOpen(e) {
      console.log("Host.onDataChannelOpen", e);
    }
  }, {
    key: 'onDataChannelClose',
    value: function onDataChannelClose(e) {
      console.log("Host.onDataChannelClose", e);
    }
  }, {
    key: 'onDataChannelMessage',
    value: function onDataChannelMessage(e) {
      console.log("Host.onDataChannelMessage", e);
    }
  }, {
    key: 'addIceCandidate',
    value: function addIceCandidate(iceCandidate) {
      console.log("adding ice candidate");
      console.log(iceCandidate);
      this.pc.addIceCandidate(iceCandidate);
    }
  }, {
    key: 'onIceConnectionStateChange',
    value: function onIceConnectionStateChange(e) {
      if (this.pc) {
        console.log(' ICE state: ' + this.pc.iceConnectionState);
        console.log('ICE state change event: ', e);
      }
    }
  }, {
    key: 'onDataChannel',
    value: function onDataChannel(e) {
      console.log("onDataChannel");
      console.log(e);
    }
  }, {
    key: 'onOpen',
    value: function onOpen() {
      console.log("onOpen");
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      console.log("onClose");
    }
  }]);

  return Host;
}();

exports.default = new Host();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if (( false ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.adapter = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return require(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */

      'use strict';

      // Shimming starts here.

      (function () {
        // Utils.
        var logging = require('./utils').log;
        var browserDetails = require('./utils').browserDetails;
        // Export to the adapter global object visible in the browser.
        module.exports.browserDetails = browserDetails;
        module.exports.extractVersion = require('./utils').extractVersion;
        module.exports.disableLog = require('./utils').disableLog;

        // Comment out the line below if you want logging to occur, including logging
        // for the switch statement below. Can also be turned on in the browser via
        // adapter.disableLog(false), but then logging from the switch statement below
        // will not appear.
        require('./utils').disableLog(true);

        // Browser shims.
        var chromeShim = require('./chrome/chrome_shim') || null;
        var edgeShim = require('./edge/edge_shim') || null;
        var firefoxShim = require('./firefox/firefox_shim') || null;
        var safariShim = require('./safari/safari_shim') || null;

        // Shim browser if found.
        switch (browserDetails.browser) {
          case 'opera': // fallthrough as it uses chrome shims
          case 'chrome':
            if (!chromeShim || !chromeShim.shimPeerConnection) {
              logging('Chrome shim is not included in this adapter release.');
              return;
            }
            logging('adapter.js shimming chrome.');
            // Export to the adapter global object visible in the browser.
            module.exports.browserShim = chromeShim;

            chromeShim.shimGetUserMedia();
            chromeShim.shimSourceObject();
            chromeShim.shimPeerConnection();
            chromeShim.shimOnTrack();
            break;
          case 'firefox':
            if (!firefoxShim || !firefoxShim.shimPeerConnection) {
              logging('Firefox shim is not included in this adapter release.');
              return;
            }
            logging('adapter.js shimming firefox.');
            // Export to the adapter global object visible in the browser.
            module.exports.browserShim = firefoxShim;

            firefoxShim.shimGetUserMedia();
            firefoxShim.shimSourceObject();
            firefoxShim.shimPeerConnection();
            firefoxShim.shimOnTrack();
            break;
          case 'edge':
            if (!edgeShim || !edgeShim.shimPeerConnection) {
              logging('MS edge shim is not included in this adapter release.');
              return;
            }
            logging('adapter.js shimming edge.');
            // Export to the adapter global object visible in the browser.
            module.exports.browserShim = edgeShim;

            edgeShim.shimPeerConnection();
            break;
          case 'safari':
            if (!safariShim) {
              logging('Safari shim is not included in this adapter release.');
              return;
            }
            logging('adapter.js shimming safari.');
            // Export to the adapter global object visible in the browser.
            module.exports.browserShim = safariShim;

            safariShim.shimGetUserMedia();
            break;
          default:
            logging('Unsupported browser!');
        }
      })();
    }, { "./chrome/chrome_shim": 2, "./edge/edge_shim": 5, "./firefox/firefox_shim": 6, "./safari/safari_shim": 8, "./utils": 9 }], 2: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var logging = require('../utils.js').log;
      var browserDetails = require('../utils.js').browserDetails;

      var chromeShim = {
        shimOnTrack: function shimOnTrack() {
          if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
            Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
              get: function get() {
                return this._ontrack;
              },
              set: function set(f) {
                var self = this;
                if (this._ontrack) {
                  this.removeEventListener('track', this._ontrack);
                  this.removeEventListener('addstream', this._ontrackpoly);
                }
                this.addEventListener('track', this._ontrack = f);
                this.addEventListener('addstream', this._ontrackpoly = function (e) {
                  // onaddstream does not fire when a track is added to an existing
                  // stream. But stream.onaddtrack is implemented so we use that.
                  e.stream.addEventListener('addtrack', function (te) {
                    var event = new Event('track');
                    event.track = te.track;
                    event.receiver = { track: te.track };
                    event.streams = [e.stream];
                    self.dispatchEvent(event);
                  });
                  e.stream.getTracks().forEach(function (track) {
                    var event = new Event('track');
                    event.track = track;
                    event.receiver = { track: track };
                    event.streams = [e.stream];
                    this.dispatchEvent(event);
                  }.bind(this));
                }.bind(this));
              }
            });
          }
        },

        shimSourceObject: function shimSourceObject() {
          if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
            if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
              // Shim the srcObject property, once, when HTMLMediaElement is found.
              Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
                get: function get() {
                  return this._srcObject;
                },
                set: function set(stream) {
                  var self = this;
                  // Use _srcObject as a private property for this shim
                  this._srcObject = stream;
                  if (this.src) {
                    URL.revokeObjectURL(this.src);
                  }

                  if (!stream) {
                    this.src = '';
                    return;
                  }
                  this.src = URL.createObjectURL(stream);
                  // We need to recreate the blob url when a track is added or
                  // removed. Doing it manually since we want to avoid a recursion.
                  stream.addEventListener('addtrack', function () {
                    if (self.src) {
                      URL.revokeObjectURL(self.src);
                    }
                    self.src = URL.createObjectURL(stream);
                  });
                  stream.addEventListener('removetrack', function () {
                    if (self.src) {
                      URL.revokeObjectURL(self.src);
                    }
                    self.src = URL.createObjectURL(stream);
                  });
                }
              });
            }
          }
        },

        shimPeerConnection: function shimPeerConnection() {
          // The RTCPeerConnection object.
          window.RTCPeerConnection = function (pcConfig, pcConstraints) {
            // Translate iceTransportPolicy to iceTransports,
            // see https://code.google.com/p/webrtc/issues/detail?id=4869
            logging('PeerConnection');
            if (pcConfig && pcConfig.iceTransportPolicy) {
              pcConfig.iceTransports = pcConfig.iceTransportPolicy;
            }

            var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints);
            var origGetStats = pc.getStats.bind(pc);
            pc.getStats = function (selector, successCallback, errorCallback) {
              var self = this;
              var args = arguments;

              // If selector is a function then we are in the old style stats so just
              // pass back the original getStats format to avoid breaking old users.
              if (arguments.length > 0 && typeof selector === 'function') {
                return origGetStats(selector, successCallback);
              }

              var fixChromeStats_ = function fixChromeStats_(response) {
                var standardReport = {};
                var reports = response.result();
                reports.forEach(function (report) {
                  var standardStats = {
                    id: report.id,
                    timestamp: report.timestamp,
                    type: report.type
                  };
                  report.names().forEach(function (name) {
                    standardStats[name] = report.stat(name);
                  });
                  standardReport[standardStats.id] = standardStats;
                });

                return standardReport;
              };

              if (arguments.length >= 2) {
                var successCallbackWrapper_ = function successCallbackWrapper_(response) {
                  args[1](fixChromeStats_(response));
                };

                return origGetStats.apply(this, [successCallbackWrapper_, arguments[0]]);
              }

              // promise-support
              return new Promise(function (resolve, reject) {
                if (args.length === 1 && (typeof selector === "undefined" ? "undefined" : _typeof(selector)) === 'object') {
                  origGetStats.apply(self, [function (response) {
                    resolve.apply(null, [fixChromeStats_(response)]);
                  }, reject]);
                } else {
                  origGetStats.apply(self, [resolve, reject]);
                }
              });
            };

            return pc;
          };
          window.RTCPeerConnection.prototype = webkitRTCPeerConnection.prototype;

          // wrap static methods. Currently just generateCertificate.
          if (webkitRTCPeerConnection.generateCertificate) {
            Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
              get: function get() {
                return webkitRTCPeerConnection.generateCertificate;
              }
            });
          }

          // add promise support
          ['createOffer', 'createAnswer'].forEach(function (method) {
            var nativeMethod = webkitRTCPeerConnection.prototype[method];
            webkitRTCPeerConnection.prototype[method] = function () {
              var self = this;
              if (arguments.length < 1 || arguments.length === 1 && _typeof(arguments[0]) === 'object') {
                var opts = arguments.length === 1 ? arguments[0] : undefined;
                return new Promise(function (resolve, reject) {
                  nativeMethod.apply(self, [resolve, reject, opts]);
                });
              }
              return nativeMethod.apply(this, arguments);
            };
          });

          ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
            var nativeMethod = webkitRTCPeerConnection.prototype[method];
            webkitRTCPeerConnection.prototype[method] = function () {
              var args = arguments;
              var self = this;
              args[0] = new (method === 'addIceCandidate' ? RTCIceCandidate : RTCSessionDescription)(args[0]);
              return new Promise(function (resolve, reject) {
                nativeMethod.apply(self, [args[0], function () {
                  resolve();
                  if (args.length >= 2) {
                    args[1].apply(null, []);
                  }
                }, function (err) {
                  reject(err);
                  if (args.length >= 3) {
                    args[2].apply(null, [err]);
                  }
                }]);
              });
            };
          });
        },

        // Attach a media stream to an element.
        attachMediaStream: function attachMediaStream(element, stream) {
          logging('DEPRECATED, attachMediaStream will soon be removed.');
          if (browserDetails.version >= 43) {
            element.srcObject = stream;
          } else if (typeof element.src !== 'undefined') {
            element.src = URL.createObjectURL(stream);
          } else {
            logging('Error attaching stream to element.');
          }
        },

        reattachMediaStream: function reattachMediaStream(to, from) {
          logging('DEPRECATED, reattachMediaStream will soon be removed.');
          if (browserDetails.version >= 43) {
            to.srcObject = from.srcObject;
          } else {
            to.src = from.src;
          }
        }
      };

      // Expose public methods.
      module.exports = {
        shimOnTrack: chromeShim.shimOnTrack,
        shimSourceObject: chromeShim.shimSourceObject,
        shimPeerConnection: chromeShim.shimPeerConnection,
        shimGetUserMedia: require('./getusermedia'),
        attachMediaStream: chromeShim.attachMediaStream,
        reattachMediaStream: chromeShim.reattachMediaStream
      };
    }, { "../utils.js": 9, "./getusermedia": 3 }], 3: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var logging = require('../utils.js').log;

      // Expose public methods.
      module.exports = function () {
        var constraintsToChrome_ = function constraintsToChrome_(c) {
          if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
            return c;
          }
          var cc = {};
          Object.keys(c).forEach(function (key) {
            if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
              return;
            }
            var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
            if (r.exact !== undefined && typeof r.exact === 'number') {
              r.min = r.max = r.exact;
            }
            var oldname_ = function oldname_(prefix, name) {
              if (prefix) {
                return prefix + name.charAt(0).toUpperCase() + name.slice(1);
              }
              return name === 'deviceId' ? 'sourceId' : name;
            };
            if (r.ideal !== undefined) {
              cc.optional = cc.optional || [];
              var oc = {};
              if (typeof r.ideal === 'number') {
                oc[oldname_('min', key)] = r.ideal;
                cc.optional.push(oc);
                oc = {};
                oc[oldname_('max', key)] = r.ideal;
                cc.optional.push(oc);
              } else {
                oc[oldname_('', key)] = r.ideal;
                cc.optional.push(oc);
              }
            }
            if (r.exact !== undefined && typeof r.exact !== 'number') {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname_('', key)] = r.exact;
            } else {
              ['min', 'max'].forEach(function (mix) {
                if (r[mix] !== undefined) {
                  cc.mandatory = cc.mandatory || {};
                  cc.mandatory[oldname_(mix, key)] = r[mix];
                }
              });
            }
          });
          if (c.advanced) {
            cc.optional = (cc.optional || []).concat(c.advanced);
          }
          return cc;
        };

        var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
          constraints = JSON.parse(JSON.stringify(constraints));
          if (constraints.audio) {
            constraints.audio = constraintsToChrome_(constraints.audio);
          }
          if (constraints.video) {
            constraints.video = constraintsToChrome_(constraints.video);
          }
          logging('chrome: ' + JSON.stringify(constraints));
          return navigator.webkitGetUserMedia(constraints, onSuccess, onError);
        };
        navigator.getUserMedia = getUserMedia_;

        // Returns the result of getUserMedia as a Promise.
        var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
          return new Promise(function (resolve, reject) {
            navigator.getUserMedia(constraints, resolve, reject);
          });
        };

        if (!navigator.mediaDevices) {
          navigator.mediaDevices = {
            getUserMedia: getUserMediaPromise_,
            enumerateDevices: function enumerateDevices() {
              return new Promise(function (resolve) {
                var kinds = { audio: 'audioinput', video: 'videoinput' };
                return MediaStreamTrack.getSources(function (devices) {
                  resolve(devices.map(function (device) {
                    return { label: device.label,
                      kind: kinds[device.kind],
                      deviceId: device.id,
                      groupId: '' };
                  }));
                });
              });
            }
          };
        }

        // A shim for getUserMedia method on the mediaDevices object.
        // TODO(KaptenJansson) remove once implemented in Chrome stable.
        if (!navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            return getUserMediaPromise_(constraints);
          };
        } else {
          // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
          // function which returns a Promise, it does not accept spec-style
          // constraints.
          var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
          navigator.mediaDevices.getUserMedia = function (c) {
            if (c) {
              logging('spec:   ' + JSON.stringify(c)); // whitespace for alignment
              c.audio = constraintsToChrome_(c.audio);
              c.video = constraintsToChrome_(c.video);
              logging('chrome: ' + JSON.stringify(c));
            }
            return origGetUserMedia(c);
          }.bind(this);
        }

        // Dummy devicechange event methods.
        // TODO(KaptenJansson) remove once implemented in Chrome stable.
        if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
          navigator.mediaDevices.addEventListener = function () {
            logging('Dummy mediaDevices.addEventListener called.');
          };
        }
        if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
          navigator.mediaDevices.removeEventListener = function () {
            logging('Dummy mediaDevices.removeEventListener called.');
          };
        }
      };
    }, { "../utils.js": 9 }], 4: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      // SDP helpers.

      var SDPUtils = {};

      // Generate an alphanumeric identifier for cname or mids.
      // TODO: use UUIDs instead? https://gist.github.com/jed/982883
      SDPUtils.generateIdentifier = function () {
        return Math.random().toString(36).substr(2, 10);
      };

      // The RTCP CNAME used by all peerconnections from the same JS.
      SDPUtils.localCName = SDPUtils.generateIdentifier();

      // Splits SDP into lines, dealing with both CRLF and LF.
      SDPUtils.splitLines = function (blob) {
        return blob.trim().split('\n').map(function (line) {
          return line.trim();
        });
      };
      // Splits SDP into sessionpart and mediasections. Ensures CRLF.
      SDPUtils.splitSections = function (blob) {
        var parts = blob.split('\nm=');
        return parts.map(function (part, index) {
          return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
        });
      };

      // Returns lines that start with a certain prefix.
      SDPUtils.matchPrefix = function (blob, prefix) {
        return SDPUtils.splitLines(blob).filter(function (line) {
          return line.indexOf(prefix) === 0;
        });
      };

      // Parses an ICE candidate line. Sample input:
      // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
      // rport 55996"
      SDPUtils.parseCandidate = function (line) {
        var parts;
        // Parse both variants.
        if (line.indexOf('a=candidate:') === 0) {
          parts = line.substring(12).split(' ');
        } else {
          parts = line.substring(10).split(' ');
        }

        var candidate = {
          foundation: parts[0],
          component: parts[1],
          protocol: parts[2].toLowerCase(),
          priority: parseInt(parts[3], 10),
          ip: parts[4],
          port: parseInt(parts[5], 10),
          // skip parts[6] == 'typ'
          type: parts[7]
        };

        for (var i = 8; i < parts.length; i += 2) {
          switch (parts[i]) {
            case 'raddr':
              candidate.relatedAddress = parts[i + 1];
              break;
            case 'rport':
              candidate.relatedPort = parseInt(parts[i + 1], 10);
              break;
            case 'tcptype':
              candidate.tcpType = parts[i + 1];
              break;
            default:
              // Unknown extensions are silently ignored.
              break;
          }
        }
        return candidate;
      };

      // Translates a candidate object into SDP candidate attribute.
      SDPUtils.writeCandidate = function (candidate) {
        var sdp = [];
        sdp.push(candidate.foundation);
        sdp.push(candidate.component);
        sdp.push(candidate.protocol.toUpperCase());
        sdp.push(candidate.priority);
        sdp.push(candidate.ip);
        sdp.push(candidate.port);

        var type = candidate.type;
        sdp.push('typ');
        sdp.push(type);
        if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
          sdp.push('raddr');
          sdp.push(candidate.relatedAddress); // was: relAddr
          sdp.push('rport');
          sdp.push(candidate.relatedPort); // was: relPort
        }
        if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
          sdp.push('tcptype');
          sdp.push(candidate.tcpType);
        }
        return 'candidate:' + sdp.join(' ');
      };

      // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
      // a=rtpmap:111 opus/48000/2
      SDPUtils.parseRtpMap = function (line) {
        var parts = line.substr(9).split(' ');
        var parsed = {
          payloadType: parseInt(parts.shift(), 10) // was: id
        };

        parts = parts[0].split('/');

        parsed.name = parts[0];
        parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
        // was: channels
        parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
        return parsed;
      };

      // Generate an a=rtpmap line from RTCRtpCodecCapability or
      // RTCRtpCodecParameters.
      SDPUtils.writeRtpMap = function (codec) {
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== undefined) {
          pt = codec.preferredPayloadType;
        }
        return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
      };

      // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
      // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
      SDPUtils.parseExtmap = function (line) {
        var parts = line.substr(9).split(' ');
        return {
          id: parseInt(parts[0], 10),
          uri: parts[1]
        };
      };

      // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
      // RTCRtpHeaderExtension.
      SDPUtils.writeExtmap = function (headerExtension) {
        return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + ' ' + headerExtension.uri + '\r\n';
      };

      // Parses an ftmp line, returns dictionary. Sample input:
      // a=fmtp:96 vbr=on;cng=on
      // Also deals with vbr=on; cng=on
      SDPUtils.parseFmtp = function (line) {
        var parsed = {};
        var kv;
        var parts = line.substr(line.indexOf(' ') + 1).split(';');
        for (var j = 0; j < parts.length; j++) {
          kv = parts[j].trim().split('=');
          parsed[kv[0].trim()] = kv[1];
        }
        return parsed;
      };

      // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
      SDPUtils.writeFmtp = function (codec) {
        var line = '';
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== undefined) {
          pt = codec.preferredPayloadType;
        }
        if (codec.parameters && Object.keys(codec.parameters).length) {
          var params = [];
          Object.keys(codec.parameters).forEach(function (param) {
            params.push(param + '=' + codec.parameters[param]);
          });
          line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
        }
        return line;
      };

      // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
      // a=rtcp-fb:98 nack rpsi
      SDPUtils.parseRtcpFb = function (line) {
        var parts = line.substr(line.indexOf(' ') + 1).split(' ');
        return {
          type: parts.shift(),
          parameter: parts.join(' ')
        };
      };
      // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
      SDPUtils.writeRtcpFb = function (codec) {
        var lines = '';
        var pt = codec.payloadType;
        if (codec.preferredPayloadType !== undefined) {
          pt = codec.preferredPayloadType;
        }
        if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
          // FIXME: special handling for trr-int?
          codec.rtcpFeedback.forEach(function (fb) {
            lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + ' ' + fb.parameter + '\r\n';
          });
        }
        return lines;
      };

      // Parses an RFC 5576 ssrc media attribute. Sample input:
      // a=ssrc:3735928559 cname:something
      SDPUtils.parseSsrcMedia = function (line) {
        var sp = line.indexOf(' ');
        var parts = {
          ssrc: parseInt(line.substr(7, sp - 7), 10)
        };
        var colon = line.indexOf(':', sp);
        if (colon > -1) {
          parts.attribute = line.substr(sp + 1, colon - sp - 1);
          parts.value = line.substr(colon + 1);
        } else {
          parts.attribute = line.substr(sp + 1);
        }
        return parts;
      };

      // Extracts DTLS parameters from SDP media section or sessionpart.
      // FIXME: for consistency with other functions this should only
      //   get the fingerprint line as input. See also getIceParameters.
      SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
        var lines = SDPUtils.splitLines(mediaSection);
        // Search in session part, too.
        lines = lines.concat(SDPUtils.splitLines(sessionpart));
        var fpLine = lines.filter(function (line) {
          return line.indexOf('a=fingerprint:') === 0;
        })[0].substr(14);
        // Note: a=setup line is ignored since we use the 'auto' role.
        var dtlsParameters = {
          role: 'auto',
          fingerprints: [{
            algorithm: fpLine.split(' ')[0],
            value: fpLine.split(' ')[1]
          }]
        };
        return dtlsParameters;
      };

      // Serializes DTLS parameters to SDP.
      SDPUtils.writeDtlsParameters = function (params, setupType) {
        var sdp = 'a=setup:' + setupType + '\r\n';
        params.fingerprints.forEach(function (fp) {
          sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
        });
        return sdp;
      };
      // Parses ICE information from SDP media section or sessionpart.
      // FIXME: for consistency with other functions this should only
      //   get the ice-ufrag and ice-pwd lines as input.
      SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
        var lines = SDPUtils.splitLines(mediaSection);
        // Search in session part, too.
        lines = lines.concat(SDPUtils.splitLines(sessionpart));
        var iceParameters = {
          usernameFragment: lines.filter(function (line) {
            return line.indexOf('a=ice-ufrag:') === 0;
          })[0].substr(12),
          password: lines.filter(function (line) {
            return line.indexOf('a=ice-pwd:') === 0;
          })[0].substr(10)
        };
        return iceParameters;
      };

      // Serializes ICE parameters to SDP.
      SDPUtils.writeIceParameters = function (params) {
        return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
      };

      // Parses the SDP media section and returns RTCRtpParameters.
      SDPUtils.parseRtpParameters = function (mediaSection) {
        var description = {
          codecs: [],
          headerExtensions: [],
          fecMechanisms: [],
          rtcp: []
        };
        var lines = SDPUtils.splitLines(mediaSection);
        var mline = lines[0].split(' ');
        for (var i = 3; i < mline.length; i++) {
          // find all codecs from mline[3..]
          var pt = mline[i];
          var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
          if (rtpmapline) {
            var codec = SDPUtils.parseRtpMap(rtpmapline);
            var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
            // Only the first a=fmtp:<pt> is considered.
            codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
            description.codecs.push(codec);
            // parse FEC mechanisms from rtpmap lines.
            switch (codec.name.toUpperCase()) {
              case 'RED':
              case 'ULPFEC':
                description.fecMechanisms.push(codec.name.toUpperCase());
                break;
              default:
                // only RED and ULPFEC are recognized as FEC mechanisms.
                break;
            }
          }
        }
        SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
          description.headerExtensions.push(SDPUtils.parseExtmap(line));
        });
        // FIXME: parse rtcp.
        return description;
      };

      // Generates parts of the SDP media section describing the capabilities /
      // parameters.
      SDPUtils.writeRtpDescription = function (kind, caps) {
        var sdp = '';

        // Build the mline.
        sdp += 'm=' + kind + ' ';
        sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
        sdp += ' UDP/TLS/RTP/SAVPF ';
        sdp += caps.codecs.map(function (codec) {
          if (codec.preferredPayloadType !== undefined) {
            return codec.preferredPayloadType;
          }
          return codec.payloadType;
        }).join(' ') + '\r\n';

        sdp += 'c=IN IP4 0.0.0.0\r\n';
        sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

        // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
        caps.codecs.forEach(function (codec) {
          sdp += SDPUtils.writeRtpMap(codec);
          sdp += SDPUtils.writeFmtp(codec);
          sdp += SDPUtils.writeRtcpFb(codec);
        });
        // FIXME: add headerExtensions, fecMechanismş and rtcp.
        sdp += 'a=rtcp-mux\r\n';
        return sdp;
      };

      // Parses the SDP media section and returns an array of
      // RTCRtpEncodingParameters.
      SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
        var encodingParameters = [];
        var description = SDPUtils.parseRtpParameters(mediaSection);
        var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
        var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

        // filter a=ssrc:... cname:, ignore PlanB-msid
        var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
          return SDPUtils.parseSsrcMedia(line);
        }).filter(function (parts) {
          return parts.attribute === 'cname';
        });
        var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
        var secondarySsrc;

        var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
          var parts = line.split(' ');
          parts.shift();
          return parts.map(function (part) {
            return parseInt(part, 10);
          });
        });
        if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
          secondarySsrc = flows[0][1];
        }

        description.codecs.forEach(function (codec) {
          if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
            var encParam = {
              ssrc: primarySsrc,
              codecPayloadType: parseInt(codec.parameters.apt, 10),
              rtx: {
                ssrc: secondarySsrc
              }
            };
            encodingParameters.push(encParam);
            if (hasRed) {
              encParam = JSON.parse(JSON.stringify(encParam));
              encParam.fec = {
                ssrc: secondarySsrc,
                mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
              };
              encodingParameters.push(encParam);
            }
          }
        });
        if (encodingParameters.length === 0 && primarySsrc) {
          encodingParameters.push({
            ssrc: primarySsrc
          });
        }

        // we support both b=AS and b=TIAS but interpret AS as TIAS.
        var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
        if (bandwidth.length) {
          if (bandwidth[0].indexOf('b=TIAS:') === 0) {
            bandwidth = parseInt(bandwidth[0].substr(7), 10);
          } else if (bandwidth[0].indexOf('b=AS:') === 0) {
            bandwidth = parseInt(bandwidth[0].substr(5), 10);
          }
          encodingParameters.forEach(function (params) {
            params.maxBitrate = bandwidth;
          });
        }
        return encodingParameters;
      };

      SDPUtils.writeSessionBoilerplate = function () {
        // FIXME: sess-id should be an NTP timestamp.
        return 'v=0\r\n' + 'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
      };

      SDPUtils.writeMediaSection = function (transceiver, caps, type, stream) {
        var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

        // Map ICE parameters (ufrag, pwd) to SDP.
        sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());

        // Map DTLS parameters to SDP.
        sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');

        sdp += 'a=mid:' + transceiver.mid + '\r\n';

        if (transceiver.rtpSender && transceiver.rtpReceiver) {
          sdp += 'a=sendrecv\r\n';
        } else if (transceiver.rtpSender) {
          sdp += 'a=sendonly\r\n';
        } else if (transceiver.rtpReceiver) {
          sdp += 'a=recvonly\r\n';
        } else {
          sdp += 'a=inactive\r\n';
        }

        // FIXME: for RTX there might be multiple SSRCs. Not implemented in Edge yet.
        if (transceiver.rtpSender) {
          var msid = 'msid:' + stream.id + ' ' + transceiver.rtpSender.track.id + '\r\n';
          sdp += 'a=' + msid;
          sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;
        }
        // FIXME: this should be written by writeRtpDescription.
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
        return sdp;
      };

      // Gets the direction from the mediaSection or the sessionpart.
      SDPUtils.getDirection = function (mediaSection, sessionpart) {
        // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
        var lines = SDPUtils.splitLines(mediaSection);
        for (var i = 0; i < lines.length; i++) {
          switch (lines[i]) {
            case 'a=sendrecv':
            case 'a=sendonly':
            case 'a=recvonly':
            case 'a=inactive':
              return lines[i].substr(2);
            default:
            // FIXME: What should happen here?
          }
        }
        if (sessionpart) {
          return SDPUtils.getDirection(sessionpart);
        }
        return 'sendrecv';
      };

      // Expose public methods.
      module.exports = SDPUtils;
    }, {}], 5: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var SDPUtils = require('./edge_sdp');
      var logging = require('../utils').log;

      var edgeShim = {
        shimPeerConnection: function shimPeerConnection() {
          if (window.RTCIceGatherer) {
            // ORTC defines an RTCIceCandidate object but no constructor.
            // Not implemented in Edge.
            if (!window.RTCIceCandidate) {
              window.RTCIceCandidate = function (args) {
                return args;
              };
            }
            // ORTC does not have a session description object but
            // other browsers (i.e. Chrome) that will support both PC and ORTC
            // in the future might have this defined already.
            if (!window.RTCSessionDescription) {
              window.RTCSessionDescription = function (args) {
                return args;
              };
            }
          }

          window.RTCPeerConnection = function (config) {
            var self = this;

            var _eventTarget = document.createDocumentFragment();
            ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (method) {
              self[method] = _eventTarget[method].bind(_eventTarget);
            });

            this.onicecandidate = null;
            this.onaddstream = null;
            this.ontrack = null;
            this.onremovestream = null;
            this.onsignalingstatechange = null;
            this.oniceconnectionstatechange = null;
            this.onnegotiationneeded = null;
            this.ondatachannel = null;

            this.localStreams = [];
            this.remoteStreams = [];
            this.getLocalStreams = function () {
              return self.localStreams;
            };
            this.getRemoteStreams = function () {
              return self.remoteStreams;
            };

            this.localDescription = new RTCSessionDescription({
              type: '',
              sdp: ''
            });
            this.remoteDescription = new RTCSessionDescription({
              type: '',
              sdp: ''
            });
            this.signalingState = 'stable';
            this.iceConnectionState = 'new';
            this.iceGatheringState = 'new';

            this.iceOptions = {
              gatherPolicy: 'all',
              iceServers: []
            };
            if (config && config.iceTransportPolicy) {
              switch (config.iceTransportPolicy) {
                case 'all':
                case 'relay':
                  this.iceOptions.gatherPolicy = config.iceTransportPolicy;
                  break;
                case 'none':
                  // FIXME: remove once implementation and spec have added this.
                  throw new TypeError('iceTransportPolicy "none" not supported');
                default:
                  // don't set iceTransportPolicy.
                  break;
              }
            }
            if (config && config.iceServers) {
              // Edge does not like
              // 1) stun:
              // 2) turn: that does not have all of turn:host:port?transport=udp
              this.iceOptions.iceServers = config.iceServers.filter(function (server) {
                if (server && server.urls) {
                  server.urls = server.urls.filter(function (url) {
                    return url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1;
                  })[0];
                  return !!server.urls;
                }
                return false;
              });
            }

            // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
            // everything that is needed to describe a SDP m-line.
            this.transceivers = [];

            // since the iceGatherer is currently created in createOffer but we
            // must not emit candidates until after setLocalDescription we buffer
            // them in this array.
            this._localIceCandidatesBuffer = [];
          };

          window.RTCPeerConnection.prototype._emitBufferedCandidates = function () {
            var self = this;
            var sections = SDPUtils.splitSections(self.localDescription.sdp);
            // FIXME: need to apply ice candidates in a way which is async but
            // in-order
            this._localIceCandidatesBuffer.forEach(function (event) {
              var end = !event.candidate || Object.keys(event.candidate).length === 0;
              if (end) {
                for (var j = 1; j < sections.length; j++) {
                  if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
                    sections[j] += 'a=end-of-candidates\r\n';
                  }
                }
              } else if (event.candidate.candidate.indexOf('typ endOfCandidates') === -1) {
                sections[event.candidate.sdpMLineIndex + 1] += 'a=' + event.candidate.candidate + '\r\n';
              }
              self.localDescription.sdp = sections.join('');
              self.dispatchEvent(event);
              if (self.onicecandidate !== null) {
                self.onicecandidate(event);
              }
              if (!event.candidate && self.iceGatheringState !== 'complete') {
                var complete = self.transceivers.every(function (transceiver) {
                  return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
                });
                if (complete) {
                  self.iceGatheringState = 'complete';
                }
              }
            });
            this._localIceCandidatesBuffer = [];
          };

          window.RTCPeerConnection.prototype.addStream = function (stream) {
            // Clone is necessary for local demos mostly, attaching directly
            // to two different senders does not work (build 10547).
            this.localStreams.push(stream.clone());
            this._maybeFireNegotiationNeeded();
          };

          window.RTCPeerConnection.prototype.removeStream = function (stream) {
            var idx = this.localStreams.indexOf(stream);
            if (idx > -1) {
              this.localStreams.splice(idx, 1);
              this._maybeFireNegotiationNeeded();
            }
          };

          // Determines the intersection of local and remote capabilities.
          window.RTCPeerConnection.prototype._getCommonCapabilities = function (localCapabilities, remoteCapabilities) {
            var commonCapabilities = {
              codecs: [],
              headerExtensions: [],
              fecMechanisms: []
            };
            localCapabilities.codecs.forEach(function (lCodec) {
              for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                var rCodec = remoteCapabilities.codecs[i];
                if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate && lCodec.numChannels === rCodec.numChannels) {
                  // push rCodec so we reply with offerer payload type
                  commonCapabilities.codecs.push(rCodec);

                  // FIXME: also need to determine intersection between
                  // .rtcpFeedback and .parameters
                  break;
                }
              }
            });

            localCapabilities.headerExtensions.forEach(function (lHeaderExtension) {
              for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
                var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                if (lHeaderExtension.uri === rHeaderExtension.uri) {
                  commonCapabilities.headerExtensions.push(rHeaderExtension);
                  break;
                }
              }
            });

            // FIXME: fecMechanisms
            return commonCapabilities;
          };

          // Create ICE gatherer, ICE transport and DTLS transport.
          window.RTCPeerConnection.prototype._createIceAndDtlsTransports = function (mid, sdpMLineIndex) {
            var self = this;
            var iceGatherer = new RTCIceGatherer(self.iceOptions);
            var iceTransport = new RTCIceTransport(iceGatherer);
            iceGatherer.onlocalcandidate = function (evt) {
              var event = new Event('icecandidate');
              event.candidate = { sdpMid: mid, sdpMLineIndex: sdpMLineIndex };

              var cand = evt.candidate;
              var end = !cand || Object.keys(cand).length === 0;
              // Edge emits an empty object for RTCIceCandidateComplete‥
              if (end) {
                // polyfill since RTCIceGatherer.state is not implemented in
                // Edge 10547 yet.
                if (iceGatherer.state === undefined) {
                  iceGatherer.state = 'completed';
                }

                // Emit a candidate with type endOfCandidates to make the samples
                // work. Edge requires addIceCandidate with this empty candidate
                // to start checking. The real solution is to signal
                // end-of-candidates to the other side when getting the null
                // candidate but some apps (like the samples) don't do that.
                event.candidate.candidate = 'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates';
              } else {
                // RTCIceCandidate doesn't have a component, needs to be added
                cand.component = iceTransport.component === 'RTCP' ? 2 : 1;
                event.candidate.candidate = SDPUtils.writeCandidate(cand);
              }

              var complete = self.transceivers.every(function (transceiver) {
                return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
              });

              // Emit candidate if localDescription is set.
              // Also emits null candidate when all gatherers are complete.
              switch (self.iceGatheringState) {
                case 'new':
                  self._localIceCandidatesBuffer.push(event);
                  if (end && complete) {
                    self._localIceCandidatesBuffer.push(new Event('icecandidate'));
                  }
                  break;
                case 'gathering':
                  self._emitBufferedCandidates();
                  self.dispatchEvent(event);
                  if (self.onicecandidate !== null) {
                    self.onicecandidate(event);
                  }
                  if (complete) {
                    self.dispatchEvent(new Event('icecandidate'));
                    if (self.onicecandidate !== null) {
                      self.onicecandidate(new Event('icecandidate'));
                    }
                    self.iceGatheringState = 'complete';
                  }
                  break;
                case 'complete':
                  // should not happen... currently!
                  break;
                default:
                  // no-op.
                  break;
              }
            };
            iceTransport.onicestatechange = function () {
              self._updateConnectionState();
            };

            var dtlsTransport = new RTCDtlsTransport(iceTransport);
            dtlsTransport.ondtlsstatechange = function () {
              self._updateConnectionState();
            };
            dtlsTransport.onerror = function () {
              // onerror does not set state to failed by itself.
              dtlsTransport.state = 'failed';
              self._updateConnectionState();
            };

            return {
              iceGatherer: iceGatherer,
              iceTransport: iceTransport,
              dtlsTransport: dtlsTransport
            };
          };

          // Start the RTP Sender and Receiver for a transceiver.
          window.RTCPeerConnection.prototype._transceive = function (transceiver, send, recv) {
            var params = this._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
            if (send && transceiver.rtpSender) {
              params.encodings = transceiver.sendEncodingParameters;
              params.rtcp = {
                cname: SDPUtils.localCName
              };
              if (transceiver.recvEncodingParameters.length) {
                params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
              }
              transceiver.rtpSender.send(params);
            }
            if (recv && transceiver.rtpReceiver) {
              params.encodings = transceiver.recvEncodingParameters;
              params.rtcp = {
                cname: transceiver.cname
              };
              if (transceiver.sendEncodingParameters.length) {
                params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
              }
              transceiver.rtpReceiver.receive(params);
            }
          };

          window.RTCPeerConnection.prototype.setLocalDescription = function (description) {
            var self = this;
            var sections;
            var sessionpart;
            if (description.type === 'offer') {
              // FIXME: What was the purpose of this empty if statement?
              // if (!this._pendingOffer) {
              // } else {
              if (this._pendingOffer) {
                // VERY limited support for SDP munging. Limited to:
                // * changing the order of codecs
                sections = SDPUtils.splitSections(description.sdp);
                sessionpart = sections.shift();
                sections.forEach(function (mediaSection, sdpMLineIndex) {
                  var caps = SDPUtils.parseRtpParameters(mediaSection);
                  self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
                });
                this.transceivers = this._pendingOffer;
                delete this._pendingOffer;
              }
            } else if (description.type === 'answer') {
              sections = SDPUtils.splitSections(self.remoteDescription.sdp);
              sessionpart = sections.shift();
              sections.forEach(function (mediaSection, sdpMLineIndex) {
                var transceiver = self.transceivers[sdpMLineIndex];
                var iceGatherer = transceiver.iceGatherer;
                var iceTransport = transceiver.iceTransport;
                var dtlsTransport = transceiver.dtlsTransport;
                var localCapabilities = transceiver.localCapabilities;
                var remoteCapabilities = transceiver.remoteCapabilities;
                var rejected = mediaSection.split('\n', 1)[0].split(' ', 2)[1] === '0';

                if (!rejected) {
                  var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                  iceTransport.start(iceGatherer, remoteIceParameters, 'controlled');

                  var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                  dtlsTransport.start(remoteDtlsParameters);

                  // Calculate intersection of capabilities.
                  var params = self._getCommonCapabilities(localCapabilities, remoteCapabilities);

                  // Start the RTCRtpSender. The RTCRtpReceiver for this
                  // transceiver has already been started in setRemoteDescription.
                  self._transceive(transceiver, params.codecs.length > 0, false);
                }
              });
            }

            this.localDescription = {
              type: description.type,
              sdp: description.sdp
            };
            switch (description.type) {
              case 'offer':
                this._updateSignalingState('have-local-offer');
                break;
              case 'answer':
                this._updateSignalingState('stable');
                break;
              default:
                throw new TypeError('unsupported type "' + description.type + '"');
            }

            // If a success callback was provided, emit ICE candidates after it
            // has been executed. Otherwise, emit callback after the Promise is
            // resolved.
            var hasCallback = arguments.length > 1 && typeof arguments[1] === 'function';
            if (hasCallback) {
              var cb = arguments[1];
              window.setTimeout(function () {
                cb();
                if (self.iceGatheringState === 'new') {
                  self.iceGatheringState = 'gathering';
                }
                self._emitBufferedCandidates();
              }, 0);
            }
            var p = Promise.resolve();
            p.then(function () {
              if (!hasCallback) {
                if (self.iceGatheringState === 'new') {
                  self.iceGatheringState = 'gathering';
                }
                // Usually candidates will be emitted earlier.
                window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
              }
            });
            return p;
          };

          window.RTCPeerConnection.prototype.setRemoteDescription = function (description) {
            var self = this;
            var stream = new MediaStream();
            var receiverList = [];
            var sections = SDPUtils.splitSections(description.sdp);
            var sessionpart = sections.shift();
            sections.forEach(function (mediaSection, sdpMLineIndex) {
              var lines = SDPUtils.splitLines(mediaSection);
              var mline = lines[0].substr(2).split(' ');
              var kind = mline[0];
              var rejected = mline[1] === '0';
              var direction = SDPUtils.getDirection(mediaSection, sessionpart);

              var transceiver;
              var iceGatherer;
              var iceTransport;
              var dtlsTransport;
              var rtpSender;
              var rtpReceiver;
              var sendEncodingParameters;
              var recvEncodingParameters;
              var localCapabilities;

              var track;
              // FIXME: ensure the mediaSection has rtcp-mux set.
              var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
              var remoteIceParameters;
              var remoteDtlsParameters;
              if (!rejected) {
                remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
              }
              recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);

              var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:');
              if (mid.length) {
                mid = mid[0].substr(6);
              } else {
                mid = SDPUtils.generateIdentifier();
              }

              var cname;
              // Gets the first SSRC. Note that with RTX there might be multiple
              // SSRCs.
              var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
                return SDPUtils.parseSsrcMedia(line);
              }).filter(function (obj) {
                return obj.attribute === 'cname';
              })[0];
              if (remoteSsrc) {
                cname = remoteSsrc.value;
              }

              var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates').length > 0;
              var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
                return SDPUtils.parseCandidate(cand);
              }).filter(function (cand) {
                return cand.component === '1';
              });
              if (description.type === 'offer' && !rejected) {
                var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);
                if (isComplete) {
                  transports.iceTransport.setRemoteCandidates(cands);
                }

                localCapabilities = RTCRtpReceiver.getCapabilities(kind);
                sendEncodingParameters = [{
                  ssrc: (2 * sdpMLineIndex + 2) * 1001
                }];

                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);

                track = rtpReceiver.track;
                receiverList.push([track, rtpReceiver]);
                // FIXME: not correct when there are multiple streams but that is
                // not currently supported in this shim.
                stream.addTrack(track);

                // FIXME: look at direction.
                if (self.localStreams.length > 0 && self.localStreams[0].getTracks().length >= sdpMLineIndex) {
                  // FIXME: actually more complicated, needs to match types etc
                  var localtrack = self.localStreams[0].getTracks()[sdpMLineIndex];
                  rtpSender = new RTCRtpSender(localtrack, transports.dtlsTransport);
                }

                self.transceivers[sdpMLineIndex] = {
                  iceGatherer: transports.iceGatherer,
                  iceTransport: transports.iceTransport,
                  dtlsTransport: transports.dtlsTransport,
                  localCapabilities: localCapabilities,
                  remoteCapabilities: remoteCapabilities,
                  rtpSender: rtpSender,
                  rtpReceiver: rtpReceiver,
                  kind: kind,
                  mid: mid,
                  cname: cname,
                  sendEncodingParameters: sendEncodingParameters,
                  recvEncodingParameters: recvEncodingParameters
                };
                // Start the RTCRtpReceiver now. The RTPSender is started in
                // setLocalDescription.
                self._transceive(self.transceivers[sdpMLineIndex], false, direction === 'sendrecv' || direction === 'sendonly');
              } else if (description.type === 'answer' && !rejected) {
                transceiver = self.transceivers[sdpMLineIndex];
                iceGatherer = transceiver.iceGatherer;
                iceTransport = transceiver.iceTransport;
                dtlsTransport = transceiver.dtlsTransport;
                rtpSender = transceiver.rtpSender;
                rtpReceiver = transceiver.rtpReceiver;
                sendEncodingParameters = transceiver.sendEncodingParameters;
                localCapabilities = transceiver.localCapabilities;

                self.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
                self.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
                self.transceivers[sdpMLineIndex].cname = cname;

                if (isComplete) {
                  iceTransport.setRemoteCandidates(cands);
                }
                iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
                dtlsTransport.start(remoteDtlsParameters);

                self._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly');

                if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
                  track = rtpReceiver.track;
                  receiverList.push([track, rtpReceiver]);
                  stream.addTrack(track);
                } else {
                  // FIXME: actually the receiver should be created later.
                  delete transceiver.rtpReceiver;
                }
              }
            });

            this.remoteDescription = {
              type: description.type,
              sdp: description.sdp
            };
            switch (description.type) {
              case 'offer':
                this._updateSignalingState('have-remote-offer');
                break;
              case 'answer':
                this._updateSignalingState('stable');
                break;
              default:
                throw new TypeError('unsupported type "' + description.type + '"');
            }
            if (stream.getTracks().length) {
              self.remoteStreams.push(stream);
              window.setTimeout(function () {
                var event = new Event('addstream');
                event.stream = stream;
                self.dispatchEvent(event);
                if (self.onaddstream !== null) {
                  window.setTimeout(function () {
                    self.onaddstream(event);
                  }, 0);
                }

                receiverList.forEach(function (item) {
                  var track = item[0];
                  var receiver = item[1];
                  var trackEvent = new Event('track');
                  trackEvent.track = track;
                  trackEvent.receiver = receiver;
                  trackEvent.streams = [stream];
                  self.dispatchEvent(event);
                  if (self.ontrack !== null) {
                    window.setTimeout(function () {
                      self.ontrack(trackEvent);
                    }, 0);
                  }
                });
              }, 0);
            }
            if (arguments.length > 1 && typeof arguments[1] === 'function') {
              window.setTimeout(arguments[1], 0);
            }
            return Promise.resolve();
          };

          window.RTCPeerConnection.prototype.close = function () {
            this.transceivers.forEach(function (transceiver) {
              /* not yet
              if (transceiver.iceGatherer) {
                transceiver.iceGatherer.close();
              }
              */
              if (transceiver.iceTransport) {
                transceiver.iceTransport.stop();
              }
              if (transceiver.dtlsTransport) {
                transceiver.dtlsTransport.stop();
              }
              if (transceiver.rtpSender) {
                transceiver.rtpSender.stop();
              }
              if (transceiver.rtpReceiver) {
                transceiver.rtpReceiver.stop();
              }
            });
            // FIXME: clean up tracks, local streams, remote streams, etc
            this._updateSignalingState('closed');
          };

          // Update the signaling state.
          window.RTCPeerConnection.prototype._updateSignalingState = function (newState) {
            this.signalingState = newState;
            var event = new Event('signalingstatechange');
            this.dispatchEvent(event);
            if (this.onsignalingstatechange !== null) {
              this.onsignalingstatechange(event);
            }
          };

          // Determine whether to fire the negotiationneeded event.
          window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function () {
            // Fire away (for now).
            var event = new Event('negotiationneeded');
            this.dispatchEvent(event);
            if (this.onnegotiationneeded !== null) {
              this.onnegotiationneeded(event);
            }
          };

          // Update the connection state.
          window.RTCPeerConnection.prototype._updateConnectionState = function () {
            var self = this;
            var newState;
            var states = {
              'new': 0,
              closed: 0,
              connecting: 0,
              checking: 0,
              connected: 0,
              completed: 0,
              failed: 0
            };
            this.transceivers.forEach(function (transceiver) {
              states[transceiver.iceTransport.state]++;
              states[transceiver.dtlsTransport.state]++;
            });
            // ICETransport.completed and connected are the same for this purpose.
            states.connected += states.completed;

            newState = 'new';
            if (states.failed > 0) {
              newState = 'failed';
            } else if (states.connecting > 0 || states.checking > 0) {
              newState = 'connecting';
            } else if (states.disconnected > 0) {
              newState = 'disconnected';
            } else if (states.new > 0) {
              newState = 'new';
            } else if (states.connected > 0 || states.completed > 0) {
              newState = 'connected';
            }

            if (newState !== self.iceConnectionState) {
              self.iceConnectionState = newState;
              var event = new Event('iceconnectionstatechange');
              this.dispatchEvent(event);
              if (this.oniceconnectionstatechange !== null) {
                this.oniceconnectionstatechange(event);
              }
            }
          };

          window.RTCPeerConnection.prototype.createOffer = function () {
            var self = this;
            if (this._pendingOffer) {
              throw new Error('createOffer called while there is a pending offer.');
            }
            var offerOptions;
            if (arguments.length === 1 && typeof arguments[0] !== 'function') {
              offerOptions = arguments[0];
            } else if (arguments.length === 3) {
              offerOptions = arguments[2];
            }

            var tracks = [];
            var numAudioTracks = 0;
            var numVideoTracks = 0;
            // Default to sendrecv.
            if (this.localStreams.length) {
              numAudioTracks = this.localStreams[0].getAudioTracks().length;
              numVideoTracks = this.localStreams[0].getVideoTracks().length;
            }
            // Determine number of audio and video tracks we need to send/recv.
            if (offerOptions) {
              // Reject Chrome legacy constraints.
              if (offerOptions.mandatory || offerOptions.optional) {
                throw new TypeError('Legacy mandatory/optional constraints not supported.');
              }
              if (offerOptions.offerToReceiveAudio !== undefined) {
                numAudioTracks = offerOptions.offerToReceiveAudio;
              }
              if (offerOptions.offerToReceiveVideo !== undefined) {
                numVideoTracks = offerOptions.offerToReceiveVideo;
              }
            }
            if (this.localStreams.length) {
              // Push local streams.
              this.localStreams[0].getTracks().forEach(function (track) {
                tracks.push({
                  kind: track.kind,
                  track: track,
                  wantReceive: track.kind === 'audio' ? numAudioTracks > 0 : numVideoTracks > 0
                });
                if (track.kind === 'audio') {
                  numAudioTracks--;
                } else if (track.kind === 'video') {
                  numVideoTracks--;
                }
              });
            }
            // Create M-lines for recvonly streams.
            while (numAudioTracks > 0 || numVideoTracks > 0) {
              if (numAudioTracks > 0) {
                tracks.push({
                  kind: 'audio',
                  wantReceive: true
                });
                numAudioTracks--;
              }
              if (numVideoTracks > 0) {
                tracks.push({
                  kind: 'video',
                  wantReceive: true
                });
                numVideoTracks--;
              }
            }

            var sdp = SDPUtils.writeSessionBoilerplate();
            var transceivers = [];
            tracks.forEach(function (mline, sdpMLineIndex) {
              // For each track, create an ice gatherer, ice transport,
              // dtls transport, potentially rtpsender and rtpreceiver.
              var track = mline.track;
              var kind = mline.kind;
              var mid = SDPUtils.generateIdentifier();

              var transports = self._createIceAndDtlsTransports(mid, sdpMLineIndex);

              var localCapabilities = RTCRtpSender.getCapabilities(kind);
              var rtpSender;
              var rtpReceiver;

              // generate an ssrc now, to be used later in rtpSender.send
              var sendEncodingParameters = [{
                ssrc: (2 * sdpMLineIndex + 1) * 1001
              }];
              if (track) {
                rtpSender = new RTCRtpSender(track, transports.dtlsTransport);
              }

              if (mline.wantReceive) {
                rtpReceiver = new RTCRtpReceiver(transports.dtlsTransport, kind);
              }

              transceivers[sdpMLineIndex] = {
                iceGatherer: transports.iceGatherer,
                iceTransport: transports.iceTransport,
                dtlsTransport: transports.dtlsTransport,
                localCapabilities: localCapabilities,
                remoteCapabilities: null,
                rtpSender: rtpSender,
                rtpReceiver: rtpReceiver,
                kind: kind,
                mid: mid,
                sendEncodingParameters: sendEncodingParameters,
                recvEncodingParameters: null
              };
              var transceiver = transceivers[sdpMLineIndex];
              sdp += SDPUtils.writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', self.localStreams[0]);
            });

            this._pendingOffer = transceivers;
            var desc = new RTCSessionDescription({
              type: 'offer',
              sdp: sdp
            });
            if (arguments.length && typeof arguments[0] === 'function') {
              window.setTimeout(arguments[0], 0, desc);
            }
            return Promise.resolve(desc);
          };

          window.RTCPeerConnection.prototype.createAnswer = function () {
            var self = this;

            var sdp = SDPUtils.writeSessionBoilerplate();
            this.transceivers.forEach(function (transceiver) {
              // Calculate intersection of capabilities.
              var commonCapabilities = self._getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);

              sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities, 'answer', self.localStreams[0]);
            });

            var desc = new RTCSessionDescription({
              type: 'answer',
              sdp: sdp
            });
            if (arguments.length && typeof arguments[0] === 'function') {
              window.setTimeout(arguments[0], 0, desc);
            }
            return Promise.resolve(desc);
          };

          window.RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
            var mLineIndex = candidate.sdpMLineIndex;
            if (candidate.sdpMid) {
              for (var i = 0; i < this.transceivers.length; i++) {
                if (this.transceivers[i].mid === candidate.sdpMid) {
                  mLineIndex = i;
                  break;
                }
              }
            }
            var transceiver = this.transceivers[mLineIndex];
            if (transceiver) {
              var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
              // Ignore Chrome's invalid candidates since Edge does not like them.
              if (cand.protocol === 'tcp' && cand.port === 0) {
                return;
              }
              // Ignore RTCP candidates, we assume RTCP-MUX.
              if (cand.component !== '1') {
                return;
              }
              // A dirty hack to make samples work.
              if (cand.type === 'endOfCandidates') {
                cand = {};
              }
              transceiver.iceTransport.addRemoteCandidate(cand);

              // update the remoteDescription.
              var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
              sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim() : 'a=end-of-candidates') + '\r\n';
              this.remoteDescription.sdp = sections.join('');
            }
            if (arguments.length > 1 && typeof arguments[1] === 'function') {
              window.setTimeout(arguments[1], 0);
            }
            return Promise.resolve();
          };

          window.RTCPeerConnection.prototype.getStats = function () {
            var promises = [];
            this.transceivers.forEach(function (transceiver) {
              ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function (method) {
                if (transceiver[method]) {
                  promises.push(transceiver[method].getStats());
                }
              });
            });
            var cb = arguments.length > 1 && typeof arguments[1] === 'function' && arguments[1];
            return new Promise(function (resolve) {
              var results = {};
              Promise.all(promises).then(function (res) {
                res.forEach(function (result) {
                  Object.keys(result).forEach(function (id) {
                    results[id] = result[id];
                  });
                });
                if (cb) {
                  window.setTimeout(cb, 0, results);
                }
                resolve(results);
              });
            });
          };
        },

        // Attach a media stream to an element.
        attachMediaStream: function attachMediaStream(element, stream) {
          logging('DEPRECATED, attachMediaStream will soon be removed.');
          element.srcObject = stream;
        },

        reattachMediaStream: function reattachMediaStream(to, from) {
          logging('DEPRECATED, reattachMediaStream will soon be removed.');
          to.srcObject = from.srcObject;
        }
      };

      // Expose public methods.
      module.exports = {
        shimPeerConnection: edgeShim.shimPeerConnection,
        attachMediaStream: edgeShim.attachMediaStream,
        reattachMediaStream: edgeShim.reattachMediaStream
      };
    }, { "../utils": 9, "./edge_sdp": 4 }], 6: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var logging = require('../utils').log;
      var browserDetails = require('../utils').browserDetails;

      var firefoxShim = {
        shimOnTrack: function shimOnTrack() {
          if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
            Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
              get: function get() {
                return this._ontrack;
              },
              set: function set(f) {
                if (this._ontrack) {
                  this.removeEventListener('track', this._ontrack);
                  this.removeEventListener('addstream', this._ontrackpoly);
                }
                this.addEventListener('track', this._ontrack = f);
                this.addEventListener('addstream', this._ontrackpoly = function (e) {
                  e.stream.getTracks().forEach(function (track) {
                    var event = new Event('track');
                    event.track = track;
                    event.receiver = { track: track };
                    event.streams = [e.stream];
                    this.dispatchEvent(event);
                  }.bind(this));
                }.bind(this));
              }
            });
          }
        },

        shimSourceObject: function shimSourceObject() {
          // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
          if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
            if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
              // Shim the srcObject property, once, when HTMLMediaElement is found.
              Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
                get: function get() {
                  return this.mozSrcObject;
                },
                set: function set(stream) {
                  this.mozSrcObject = stream;
                }
              });
            }
          }
        },

        shimPeerConnection: function shimPeerConnection() {
          // The RTCPeerConnection object.
          if (!window.RTCPeerConnection) {
            window.RTCPeerConnection = function (pcConfig, pcConstraints) {
              if (browserDetails.version < 38) {
                // .urls is not supported in FF < 38.
                // create RTCIceServers with a single url.
                if (pcConfig && pcConfig.iceServers) {
                  var newIceServers = [];
                  for (var i = 0; i < pcConfig.iceServers.length; i++) {
                    var server = pcConfig.iceServers[i];
                    if (server.hasOwnProperty('urls')) {
                      for (var j = 0; j < server.urls.length; j++) {
                        var newServer = {
                          url: server.urls[j]
                        };
                        if (server.urls[j].indexOf('turn') === 0) {
                          newServer.username = server.username;
                          newServer.credential = server.credential;
                        }
                        newIceServers.push(newServer);
                      }
                    } else {
                      newIceServers.push(pcConfig.iceServers[i]);
                    }
                  }
                  pcConfig.iceServers = newIceServers;
                }
              }
              return new mozRTCPeerConnection(pcConfig, pcConstraints);
            };
            window.RTCPeerConnection.prototype = mozRTCPeerConnection.prototype;

            // wrap static methods. Currently just generateCertificate.
            if (mozRTCPeerConnection.generateCertificate) {
              Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                get: function get() {
                  return mozRTCPeerConnection.generateCertificate;
                }
              });
            }

            window.RTCSessionDescription = mozRTCSessionDescription;
            window.RTCIceCandidate = mozRTCIceCandidate;
          }

          // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
          ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
            var nativeMethod = RTCPeerConnection.prototype[method];
            RTCPeerConnection.prototype[method] = function () {
              arguments[0] = new (method === 'addIceCandidate' ? RTCIceCandidate : RTCSessionDescription)(arguments[0]);
              return nativeMethod.apply(this, arguments);
            };
          });
        },

        shimGetUserMedia: function shimGetUserMedia() {
          // getUserMedia constraints shim.
          var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
            var constraintsToFF37_ = function constraintsToFF37_(c) {
              if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== 'object' || c.require) {
                return c;
              }
              var require = [];
              Object.keys(c).forEach(function (key) {
                if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                  return;
                }
                var r = c[key] = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
                if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
                  require.push(key);
                }
                if (r.exact !== undefined) {
                  if (typeof r.exact === 'number') {
                    r.min = r.max = r.exact;
                  } else {
                    c[key] = r.exact;
                  }
                  delete r.exact;
                }
                if (r.ideal !== undefined) {
                  c.advanced = c.advanced || [];
                  var oc = {};
                  if (typeof r.ideal === 'number') {
                    oc[key] = { min: r.ideal, max: r.ideal };
                  } else {
                    oc[key] = r.ideal;
                  }
                  c.advanced.push(oc);
                  delete r.ideal;
                  if (!Object.keys(r).length) {
                    delete c[key];
                  }
                }
              });
              if (require.length) {
                c.require = require;
              }
              return c;
            };
            constraints = JSON.parse(JSON.stringify(constraints));
            if (browserDetails.version < 38) {
              logging('spec: ' + JSON.stringify(constraints));
              if (constraints.audio) {
                constraints.audio = constraintsToFF37_(constraints.audio);
              }
              if (constraints.video) {
                constraints.video = constraintsToFF37_(constraints.video);
              }
              logging('ff37: ' + JSON.stringify(constraints));
            }
            return navigator.mozGetUserMedia(constraints, onSuccess, onError);
          };

          navigator.getUserMedia = getUserMedia_;

          // Returns the result of getUserMedia as a Promise.
          var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
            return new Promise(function (resolve, reject) {
              navigator.getUserMedia(constraints, resolve, reject);
            });
          };

          // Shim for mediaDevices on older versions.
          if (!navigator.mediaDevices) {
            navigator.mediaDevices = { getUserMedia: getUserMediaPromise_,
              addEventListener: function addEventListener() {},
              removeEventListener: function removeEventListener() {}
            };
          }
          navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
            return new Promise(function (resolve) {
              var infos = [{ kind: 'audioinput', deviceId: 'default', label: '', groupId: '' }, { kind: 'videoinput', deviceId: 'default', label: '', groupId: '' }];
              resolve(infos);
            });
          };

          if (browserDetails.version < 41) {
            // Work around http://bugzil.la/1169665
            var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
            navigator.mediaDevices.enumerateDevices = function () {
              return orgEnumerateDevices().then(undefined, function (e) {
                if (e.name === 'NotFoundError') {
                  return [];
                }
                throw e;
              });
            };
          }
        },

        // Attach a media stream to an element.
        attachMediaStream: function attachMediaStream(element, stream) {
          logging('DEPRECATED, attachMediaStream will soon be removed.');
          element.srcObject = stream;
        },

        reattachMediaStream: function reattachMediaStream(to, from) {
          logging('DEPRECATED, reattachMediaStream will soon be removed.');
          to.srcObject = from.srcObject;
        }
      };

      // Expose public methods.
      module.exports = {
        shimOnTrack: firefoxShim.shimOnTrack,
        shimSourceObject: firefoxShim.shimSourceObject,
        shimPeerConnection: firefoxShim.shimPeerConnection,
        shimGetUserMedia: require('./getusermedia'),
        attachMediaStream: firefoxShim.attachMediaStream,
        reattachMediaStream: firefoxShim.reattachMediaStream
      };
    }, { "../utils": 9, "./getusermedia": 7 }], 7: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var logging = require('../utils').log;
      var browserDetails = require('../utils').browserDetails;

      // Expose public methods.
      module.exports = function () {
        // getUserMedia constraints shim.
        var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
          var constraintsToFF37_ = function constraintsToFF37_(c) {
            if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== 'object' || c.require) {
              return c;
            }
            var require = [];
            Object.keys(c).forEach(function (key) {
              if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                return;
              }
              var r = c[key] = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
              if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
                require.push(key);
              }
              if (r.exact !== undefined) {
                if (typeof r.exact === 'number') {
                  r.min = r.max = r.exact;
                } else {
                  c[key] = r.exact;
                }
                delete r.exact;
              }
              if (r.ideal !== undefined) {
                c.advanced = c.advanced || [];
                var oc = {};
                if (typeof r.ideal === 'number') {
                  oc[key] = { min: r.ideal, max: r.ideal };
                } else {
                  oc[key] = r.ideal;
                }
                c.advanced.push(oc);
                delete r.ideal;
                if (!Object.keys(r).length) {
                  delete c[key];
                }
              }
            });
            if (require.length) {
              c.require = require;
            }
            return c;
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          if (browserDetails.version < 38) {
            logging('spec: ' + JSON.stringify(constraints));
            if (constraints.audio) {
              constraints.audio = constraintsToFF37_(constraints.audio);
            }
            if (constraints.video) {
              constraints.video = constraintsToFF37_(constraints.video);
            }
            logging('ff37: ' + JSON.stringify(constraints));
          }
          return navigator.mozGetUserMedia(constraints, onSuccess, onError);
        };

        navigator.getUserMedia = getUserMedia_;

        // Returns the result of getUserMedia as a Promise.
        var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
          return new Promise(function (resolve, reject) {
            navigator.getUserMedia(constraints, resolve, reject);
          });
        };

        // Shim for mediaDevices on older versions.
        if (!navigator.mediaDevices) {
          navigator.mediaDevices = { getUserMedia: getUserMediaPromise_,
            addEventListener: function addEventListener() {},
            removeEventListener: function removeEventListener() {}
          };
        }
        navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
          return new Promise(function (resolve) {
            var infos = [{ kind: 'audioinput', deviceId: 'default', label: '', groupId: '' }, { kind: 'videoinput', deviceId: 'default', label: '', groupId: '' }];
            resolve(infos);
          });
        };

        if (browserDetails.version < 41) {
          // Work around http://bugzil.la/1169665
          var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
          navigator.mediaDevices.enumerateDevices = function () {
            return orgEnumerateDevices().then(undefined, function (e) {
              if (e.name === 'NotFoundError') {
                return [];
              }
              throw e;
            });
          };
        }
      };
    }, { "../utils": 9 }], 8: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      'use strict';

      var safariShim = {
        // TODO: DrAlex, should be here, double check against LayoutTests
        // shimOnTrack: function() { },

        // TODO: DrAlex
        // attachMediaStream: function(element, stream) { },
        // reattachMediaStream: function(to, from) { },

        // TODO: once the back-end for the mac port is done, add.
        // TODO: check for webkitGTK+
        // shimPeerConnection: function() { },

        shimGetUserMedia: function shimGetUserMedia() {
          navigator.getUserMedia = navigator.webkitGetUserMedia;
        }
      };

      // Expose public methods.
      module.exports = {
        shimGetUserMedia: safariShim.shimGetUserMedia
        // TODO
        // shimOnTrack: safariShim.shimOnTrack,
        // shimPeerConnection: safariShim.shimPeerConnection,
        // attachMediaStream: safariShim.attachMediaStream,
        // reattachMediaStream: safariShim.reattachMediaStream
      };
    }, {}], 9: [function (require, module, exports) {
      /*
       *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
       *
       *  Use of this source code is governed by a BSD-style license
       *  that can be found in the LICENSE file in the root of the source
       *  tree.
       */
      /* eslint-env node */
      'use strict';

      var logDisabled_ = false;

      // Utility methods.
      var utils = {
        disableLog: function disableLog(bool) {
          if (typeof bool !== 'boolean') {
            return new Error('Argument type: ' + (typeof bool === "undefined" ? "undefined" : _typeof(bool)) + '. Please use a boolean.');
          }
          logDisabled_ = bool;
          return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
        },

        log: function log() {
          if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
            if (logDisabled_) {
              return;
            }
            if (typeof console !== 'undefined' && typeof console.log === 'function') {
              console.log.apply(console, arguments);
            }
          }
        },

        /**
         * Extract browser version out of the provided user agent string.
         *
         * @param {!string} uastring userAgent string.
         * @param {!string} expr Regular expression used as match criteria.
         * @param {!number} pos position in the version string to be returned.
         * @return {!number} browser version.
         */
        extractVersion: function extractVersion(uastring, expr, pos) {
          var match = uastring.match(expr);
          return match && match.length >= pos && parseInt(match[pos], 10);
        },

        /**
         * Browser detector.
         *
         * @return {object} result containing browser, version and minVersion
         *     properties.
         */
        detectBrowser: function detectBrowser() {
          // Returned result object.
          var result = {};
          result.browser = null;
          result.version = null;
          result.minVersion = null;

          // Fail early if it's not a browser
          if (typeof window === 'undefined' || !window.navigator) {
            result.browser = 'Not a browser.';
            return result;
          }

          // Firefox.
          if (navigator.mozGetUserMedia) {
            result.browser = 'firefox';
            result.version = this.extractVersion(navigator.userAgent, /Firefox\/([0-9]+)\./, 1);
            result.minVersion = 31;

            // all webkit-based browsers
          } else if (navigator.webkitGetUserMedia) {
            // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
            if (window.webkitRTCPeerConnection) {
              result.browser = 'chrome';
              result.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/([0-9]+)\./, 2);
              result.minVersion = 38;

              // Safari or unknown webkit-based
              // for the time being Safari has support for MediaStreams but not webRTC
            } else {
              // Safari UA substrings of interest for reference:
              // - webkit version:           AppleWebKit/602.1.25 (also used in Op,Cr)
              // - safari UI version:        Version/9.0.3 (unique to Safari)
              // - safari UI webkit version: Safari/601.4.4 (also used in Op,Cr)
              //
              // if the webkit version and safari UI webkit versions are equals,
              // ... this is a stable version.
              //
              // only the internal webkit version is important today to know if
              // media streams are supported
              //
              if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
                result.browser = 'safari';
                result.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/([0-9]+)\./, 1);
                result.minVersion = 602;

                // unknown webkit-based browser
              } else {
                result.browser = 'Unsupported webkit-based browser ' + 'with GUM support but no WebRTC support.';
                return result;
              }
            }

            // Edge.
          } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
            result.browser = 'edge';
            result.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
            result.minVersion = 10547;

            // Default fallthrough: not supported.
          } else {
            result.browser = 'Not a supported browser.';
            return result;
          }

          // Warn if version is less than minVersion.
          if (result.version < result.minVersion) {
            utils.log('Browser: ' + result.browser + ' Version: ' + result.version + ' < minimum supported version: ' + result.minVersion + '\n some things might not work!');
          }

          return result;
        }
      };

      // Export.
      module.exports = {
        log: utils.log,
        disableLog: utils.disableLog,
        browserDetails: utils.detectBrowser(),
        extractVersion: utils.extractVersion
      };
    }, {}] }, {}, [1])(1);
});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! @license Firebase v3.2.1
    Build: 3.2.1-rc.3
    Terms: https://developers.google.com/terms */
(function () {
  var k = "undefined" != typeof window && window === this ? this : "undefined" != typeof global ? global : this,
      m = {},
      n = function n(a, b) {
    (m[a] = m[a] || []).push(b);var c = k;a = a.split(".");for (var d = 0; d < a.length - 1 && c; d++) {
      c = c[a[d]];
    }a = a[a.length - 1];c && c[a] instanceof Function && (c[a] = b(c[a]));
  },
      _p = function p() {
    _p = function p() {};if (!k.Symbol) {
      k.Symbol = aa;var a = [],
          b = function b(_b) {
        return function (d) {
          a = [];d = _b(d);for (var e = [], g = 0, h = d.length; g < h; g++) {
            var f;a: if (f = d[g], 14 > f.length) f = !1;else {
              for (var l = 0; 14 > l; l++) {
                if (f[l] != "jscomp_symbol_"[l]) {
                  f = !1;
                  break a;
                }
              }f = !0;
            }f ? a.push(d[g]) : e.push(d[g]);
          }return e;
        };
      };n("Object.keys", b);n("Object.getOwnPropertyNames", b);n("Object.getOwnPropertySymbols", function (c) {
        return function (d) {
          b.ca = Object.getOwnPropertyNames(d);a.push.apply(c(d));return a;
        };
      });
    }
  },
      ba = 0,
      aa = function aa(a) {
    return "jscomp_symbol_" + a + ba++;
  },
      _q = function q() {
    _p();k.Symbol.iterator || (k.Symbol.iterator = k.Symbol("iterator"));_q = function q() {};
  },
      ca = function ca() {
    var a = ["next", "error", "complete"];_q();var b = a[Symbol.iterator];if (b) return b.call(a);var c = 0;return { next: function next() {
        return c < a.length ? { done: !1, value: a[c++] } : { done: !0 };
      } };
  },
      da = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
    if (c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");a != Array.prototype && a != Object.prototype && (a[b] = c.value);
  },
      r = function r(a, b) {
    if (b) {
      for (var c = k, d = a.split("."), e = 0; e < d.length - 1; e++) {
        var g = d[e];g in c || (c[g] = {});c = c[g];
      }d = d[d.length - 1];e = c[d];b = b(e);if (b != e) {
        a = m[a] || [];for (e = 0; e < a.length; e++) {
          b = a[e](b);
        }da(c, d, { configurable: !0, writable: !0, value: b });
      }
    }
  };
  r("String.prototype.repeat", function (a) {
    return a ? a : function (a) {
      var c;if (null == this) throw new TypeError("The 'this' value for String.prototype.repeat must not be null or undefined");c = this + "";if (0 > a || 1342177279 < a) throw new RangeError("Invalid count value");a |= 0;for (var d = ""; a;) {
        if (a & 1 && (d += c), a >>>= 1) c += c;
      }return d;
    };
  });
  var ea = function ea(a, b) {
    _q();a instanceof String && (a += "");var c = 0,
        d = { next: function next() {
        if (c < a.length) {
          var e = c++;return { value: b(e, a[e]), done: !1 };
        }d.next = function () {
          return { done: !0, value: void 0 };
        };return d.next();
      } };d[Symbol.iterator] = function () {
      return d;
    };return d;
  };r("Array.prototype.keys", function (a) {
    return a ? a : function () {
      return ea(this, function (a) {
        return a;
      });
    };
  });
  var t = this,
      u = function u() {},
      v = function v(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);if ("object" == b) {
      if (a) {
        if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
      } else return "null";
    } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
  },
      w = function w(a) {
    return "function" == v(a);
  },
      fa = function fa(a, b, c) {
    return a.call.apply(a.bind, arguments);
  },
      ga = function ga(a, b, c) {
    if (!a) throw Error();if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);return function () {
        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
      };
    }return function () {
      return a.apply(b, arguments);
    };
  },
      _x = function x(a, b, c) {
    _x = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? fa : ga;return _x.apply(null, arguments);
  },
      y = function y(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);return function () {
      var b = c.slice();b.push.apply(b, arguments);return a.apply(this, b);
    };
  },
      z = function z(a, b) {
    function c() {}c.prototype = b.prototype;a.ba = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.aa = function (a, c, g) {
      for (var h = Array(arguments.length - 2), f = 2; f < arguments.length; f++) {
        h[f - 2] = arguments[f];
      }return b.prototype[c].apply(a, h);
    };
  };function __extends(a, b) {
    function c() {
      this.constructor = a;
    }for (var d in b) {
      b.hasOwnProperty(d) && (a[d] = b[d]);
    }a.prototype = null === b ? Object.create(b) : (c.prototype = b.prototype, new c());
  }
  function __decorate(a, b, c, d) {
    var e = arguments.length,
        g = 3 > e ? b : null === d ? d = Object.getOwnPropertyDescriptor(b, c) : d,
        h;h = (window || global).Reflect;if ("object" === (typeof h === "undefined" ? "undefined" : _typeof(h)) && "function" === typeof h.decorate) g = h.decorate(a, b, c, d);else for (var f = a.length - 1; 0 <= f; f--) {
      if (h = a[f]) g = (3 > e ? h(g) : 3 < e ? h(b, c, g) : h(b, c)) || g;
    }return 3 < e && g && Object.defineProperty(b, c, g), g;
  }function __metadata(a, b) {
    var c = (window || global).Reflect;if ("object" === (typeof c === "undefined" ? "undefined" : _typeof(c)) && "function" === typeof c.metadata) return c.metadata(a, b);
  }
  var __param = function __param(a, b) {
    return function (c, d) {
      b(c, d, a);
    };
  },
      __awaiter = function __awaiter(a, b, c, d) {
    return new (c || (c = Promise))(function (e, g) {
      function h(a) {
        try {
          l(d.next(a));
        } catch (b) {
          g(b);
        }
      }function f(a) {
        try {
          l(d.throw(a));
        } catch (b) {
          g(b);
        }
      }function l(a) {
        a.done ? e(a.value) : new c(function (b) {
          b(a.value);
        }).then(h, f);
      }l((d = d.apply(a, b)).next());
    });
  };var A = function A(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, A);else {
      var b = Error().stack;b && (this.stack = b);
    }a && (this.message = String(a));
  };z(A, Error);A.prototype.name = "CustomError";var ha = function ha(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
      d += c.shift() + e.shift();
    }return d + c.join("%s");
  };var B = function B(a, b) {
    b.unshift(a);A.call(this, ha.apply(null, b));b.shift();
  };z(B, A);B.prototype.name = "AssertionError";var ia = function ia(a, b, c, d) {
    var e = "Assertion failed";if (c) var e = e + (": " + c),
        g = d;else a && (e += ": " + a, g = b);throw new B("" + e, g || []);
  },
      C = function C(a, b, c) {
    a || ia("", null, b, Array.prototype.slice.call(arguments, 2));
  },
      D = function D(a, b, c) {
    w(a) || ia("Expected function but got %s: %s.", [v(a), a], b, Array.prototype.slice.call(arguments, 2));
  };var E = function E(a, b, c) {
    this.S = c;this.L = a;this.U = b;this.s = 0;this.o = null;
  };E.prototype.get = function () {
    var a;0 < this.s ? (this.s--, a = this.o, this.o = a.next, a.next = null) : a = this.L();return a;
  };E.prototype.put = function (a) {
    this.U(a);this.s < this.S && (this.s++, a.next = this.o, this.o = a);
  };var F;a: {
    var ja = t.navigator;if (ja) {
      var ka = ja.userAgent;if (ka) {
        F = ka;break a;
      }
    }F = "";
  };var la = function la(a) {
    t.setTimeout(function () {
      throw a;
    }, 0);
  },
      G,
      ma = function ma() {
    var a = t.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && -1 == F.indexOf("Presto") && (a = function a() {
      var a = document.createElement("IFRAME");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);var b = a.contentWindow,
          a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
          d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
          a = _x(function (a) {
        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
      }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
          b.postMessage(c, d);
        } };
    });if ("undefined" !== typeof a && -1 == F.indexOf("Trident") && -1 == F.indexOf("MSIE")) {
      var b = new a(),
          c = {},
          d = c;b.port1.onmessage = function () {
        if (void 0 !== c.next) {
          c = c.next;var a = c.F;c.F = null;a();
        }
      };return function (a) {
        d.next = { F: a };d = d.next;b.port2.postMessage(0);
      };
    }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) {
      var b = document.createElement("SCRIPT");b.onreadystatechange = function () {
        b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
      };document.documentElement.appendChild(b);
    } : function (a) {
      t.setTimeout(a, 0);
    };
  };var H = function H() {
    this.v = this.f = null;
  },
      na = new E(function () {
    return new I();
  }, function (a) {
    a.reset();
  }, 100);H.prototype.add = function (a, b) {
    var c = na.get();c.set(a, b);this.v ? this.v.next = c : (C(!this.f), this.f = c);this.v = c;
  };H.prototype.remove = function () {
    var a = null;this.f && (a = this.f, this.f = this.f.next, this.f || (this.v = null), a.next = null);return a;
  };var I = function I() {
    this.next = this.scope = this.B = null;
  };I.prototype.set = function (a, b) {
    this.B = a;this.scope = b;this.next = null;
  };
  I.prototype.reset = function () {
    this.next = this.scope = this.B = null;
  };var M = function M(a, b) {
    J || oa();L || (J(), L = !0);pa.add(a, b);
  },
      J,
      oa = function oa() {
    if (t.Promise && t.Promise.resolve) {
      var a = t.Promise.resolve(void 0);J = function J() {
        a.then(qa);
      };
    } else J = function J() {
      var a = qa,
          c;!(c = !w(t.setImmediate)) && (c = t.Window && t.Window.prototype) && (c = -1 == F.indexOf("Edge") && t.Window.prototype.setImmediate == t.setImmediate);c ? (G || (G = ma()), G(a)) : t.setImmediate(a);
    };
  },
      L = !1,
      pa = new H(),
      qa = function qa() {
    for (var a; a = pa.remove();) {
      try {
        a.B.call(a.scope);
      } catch (b) {
        la(b);
      }na.put(a);
    }L = !1;
  };var O = function O(a, b) {
    this.b = 0;this.K = void 0;this.j = this.g = this.u = null;this.m = this.A = !1;if (a != u) try {
      var c = this;a.call(b, function (a) {
        N(c, 2, a);
      }, function (a) {
        try {
          if (a instanceof Error) throw a;throw Error("Promise rejected.");
        } catch (b) {}N(c, 3, a);
      });
    } catch (d) {
      N(this, 3, d);
    }
  },
      ra = function ra() {
    this.next = this.context = this.h = this.c = this.child = null;this.w = !1;
  };ra.prototype.reset = function () {
    this.context = this.h = this.c = this.child = null;this.w = !1;
  };
  var sa = new E(function () {
    return new ra();
  }, function (a) {
    a.reset();
  }, 100),
      ta = function ta(a, b, c) {
    var d = sa.get();d.c = a;d.h = b;d.context = c;return d;
  },
      va = function va(a, b, c) {
    ua(a, b, c, null) || M(y(b, a));
  };O.prototype.then = function (a, b, c) {
    null != a && D(a, "opt_onFulfilled should be a function.");null != b && D(b, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return wa(this, w(a) ? a : null, w(b) ? b : null, c);
  };O.prototype.then = O.prototype.then;O.prototype.$goog_Thenable = !0;
  O.prototype.X = function (a, b) {
    return wa(this, null, a, b);
  };var ya = function ya(a, b) {
    a.g || 2 != a.b && 3 != a.b || xa(a);C(null != b.c);a.j ? a.j.next = b : a.g = b;a.j = b;
  },
      wa = function wa(a, b, c, d) {
    var e = ta(null, null, null);e.child = new O(function (a, h) {
      e.c = b ? function (c) {
        try {
          var e = b.call(d, c);a(e);
        } catch (K) {
          h(K);
        }
      } : a;e.h = c ? function (b) {
        try {
          var e = c.call(d, b);a(e);
        } catch (K) {
          h(K);
        }
      } : h;
    });e.child.u = a;ya(a, e);return e.child;
  };O.prototype.Y = function (a) {
    C(1 == this.b);this.b = 0;N(this, 2, a);
  };O.prototype.Z = function (a) {
    C(1 == this.b);this.b = 0;N(this, 3, a);
  };
  var N = function N(a, b, c) {
    0 == a.b && (a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself")), a.b = 1, ua(c, a.Y, a.Z, a) || (a.K = c, a.b = b, a.u = null, xa(a), 3 != b || za(a, c)));
  },
      ua = function ua(a, b, c, d) {
    if (a instanceof O) return null != b && D(b, "opt_onFulfilled should be a function."), null != c && D(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"), ya(a, ta(b || u, c || null, d)), !0;var e;if (a) try {
      e = !!a.$goog_Thenable;
    } catch (h) {
      e = !1;
    } else e = !1;if (e) return a.then(b, c, d), !0;e = typeof a === "undefined" ? "undefined" : _typeof(a);if ("object" == e && null != a || "function" == e) try {
      var g = a.then;if (w(g)) return Aa(a, g, b, c, d), !0;
    } catch (h) {
      return c.call(d, h), !0;
    }return !1;
  },
      Aa = function Aa(a, b, c, d, e) {
    var g = !1,
        h = function h(a) {
      g || (g = !0, c.call(e, a));
    },
        f = function f(a) {
      g || (g = !0, d.call(e, a));
    };try {
      b.call(a, h, f);
    } catch (l) {
      f(l);
    }
  },
      xa = function xa(a) {
    a.A || (a.A = !0, M(a.N, a));
  },
      Ba = function Ba(a) {
    var b = null;a.g && (b = a.g, a.g = b.next, b.next = null);a.g || (a.j = null);null != b && C(null != b.c);return b;
  };
  O.prototype.N = function () {
    for (var a; a = Ba(this);) {
      var b = this.b,
          c = this.K;if (3 == b && a.h && !a.w) {
        var d;for (d = this; d && d.m; d = d.u) {
          d.m = !1;
        }
      }if (a.child) a.child.u = null, Ca(a, b, c);else try {
        a.w ? a.c.call(a.context) : Ca(a, b, c);
      } catch (e) {
        Da.call(null, e);
      }sa.put(a);
    }this.A = !1;
  };var Ca = function Ca(a, b, c) {
    2 == b ? a.c.call(a.context, c) : a.h && a.h.call(a.context, c);
  },
      za = function za(a, b) {
    a.m = !0;M(function () {
      a.m && Da.call(null, b);
    });
  },
      Da = la;function P(a, b) {
    if (!(b instanceof Object)) return b;switch (b.constructor) {case Date:
        return new Date(b.getTime());case Object:
        void 0 === a && (a = {});break;case Array:
        a = [];break;default:
        return b;}for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = P(a[c], b[c]));
    }return a;
  };var Ea = Error.captureStackTrace,
      R = function R(a, b) {
    this.code = a;this.message = b;if (Ea) Ea(this, Q.prototype.create);else {
      var c = Error.apply(this, arguments);this.name = "FirebaseError";Object.defineProperty(this, "stack", { get: function get() {
          return c.stack;
        } });
    }
  };R.prototype = Object.create(Error.prototype);R.prototype.constructor = R;R.prototype.name = "FirebaseError";var Q = function Q(a, b, c) {
    this.V = a;this.W = b;this.M = c;this.pattern = /\{\$([^}]+)}/g;
  };
  Q.prototype.create = function (a, b) {
    void 0 === b && (b = {});var c = this.M[a];a = this.V + "/" + a;var c = void 0 === c ? "Error" : c.replace(this.pattern, function (a, c) {
      return void 0 !== b[c] ? b[c].toString() : "<" + c + "?>";
    }),
        c = this.W + ": " + c + " (" + a + ").",
        c = new R(a, c),
        d;for (d in b) {
      b.hasOwnProperty(d) && "_" !== d.slice(-1) && (c[d] = b[d]);
    }return c;
  };O.all = function (a) {
    return new O(function (b, c) {
      var d = a.length,
          e = [];if (d) for (var g = function g(a, c) {
        d--;e[a] = c;0 == d && b(e);
      }, h = function h(a) {
        c(a);
      }, f = 0, l; f < a.length; f++) {
        l = a[f], va(l, y(g, f), h);
      } else b(e);
    });
  };O.resolve = function (a) {
    if (a instanceof O) return a;var b = new O(u);N(b, 2, a);return b;
  };O.reject = function (a) {
    return new O(function (b, c) {
      c(a);
    });
  };O.prototype["catch"] = O.prototype.X;var S = O;"undefined" !== typeof Promise && (S = Promise);var Fa = S;function Ga(a, b) {
    a = new T(a, b);return a.subscribe.bind(a);
  }var T = function T(a, b) {
    var c = this;this.a = [];this.J = 0;this.task = Fa.resolve();this.l = !1;this.D = b;this.task.then(function () {
      a(c);
    }).catch(function (a) {
      c.error(a);
    });
  };T.prototype.next = function (a) {
    U(this, function (b) {
      b.next(a);
    });
  };T.prototype.error = function (a) {
    U(this, function (b) {
      b.error(a);
    });this.close(a);
  };T.prototype.complete = function () {
    U(this, function (a) {
      a.complete();
    });this.close();
  };
  T.prototype.subscribe = function (a, b, c) {
    var d = this,
        e;if (void 0 === a && void 0 === b && void 0 === c) throw Error("Missing Observer.");e = Ha(a) ? a : { next: a, error: b, complete: c };void 0 === e.next && (e.next = V);void 0 === e.error && (e.error = V);void 0 === e.complete && (e.complete = V);a = this.$.bind(this, this.a.length);this.l && this.task.then(function () {
      try {
        d.G ? e.error(d.G) : e.complete();
      } catch (a) {}
    });this.a.push(e);return a;
  };
  T.prototype.$ = function (a) {
    void 0 !== this.a && void 0 !== this.a[a] && (this.a[a] = void 0, --this.J, 0 === this.J && void 0 !== this.D && this.D(this));
  };var U = function U(a, b) {
    if (!a.l) for (var c = 0; c < a.a.length; c++) {
      Ia(a, c, b);
    }
  },
      Ia = function Ia(a, b, c) {
    a.task.then(function () {
      if (void 0 !== a.a && void 0 !== a.a[b]) try {
        c(a.a[b]);
      } catch (d) {}
    });
  };T.prototype.close = function (a) {
    var b = this;this.l || (this.l = !0, void 0 !== a && (this.G = a), this.task.then(function () {
      b.a = void 0;b.D = void 0;
    }));
  };
  function Ha(a) {
    if ("object" !== (typeof a === "undefined" ? "undefined" : _typeof(a)) || null === a) return !1;for (var b = ca(), c = b.next(); !c.done; c = b.next()) {
      if (c = c.value, c in a && "function" === typeof a[c]) return !0;
    }return !1;
  }function V() {};var W = S,
      X = function X(a, b, c) {
    var d = this;this.H = c;this.I = !1;this.i = {};this.P = {};this.C = b;this.T = P(void 0, a);Object.keys(c.INTERNAL.factories).forEach(function (a) {
      d[a] = d.R.bind(d, a);
    });
  };X.prototype.delete = function () {
    var a = this;return new W(function (b) {
      Y(a);b();
    }).then(function () {
      a.H.INTERNAL.removeApp(a.C);return W.all(Object.keys(a.i).map(function (b) {
        return a.i[b].INTERNAL.delete();
      }));
    }).then(function () {
      a.I = !0;a.i = null;a.P = null;
    });
  };
  X.prototype.R = function (a) {
    Y(this);void 0 === this.i[a] && (this.i[a] = this.H.INTERNAL.factories[a](this, this.O.bind(this)));return this.i[a];
  };X.prototype.O = function (a) {
    P(this, a);
  };var Y = function Y(a) {
    a.I && Z(Ja("deleted", { name: a.C }));
  };Object.defineProperties(X.prototype, { name: { configurable: !0, enumerable: !0, get: function get() {
        Y(this);return this.C;
      } }, options: { configurable: !0, enumerable: !0, get: function get() {
        Y(this);return this.T;
      } } });X.prototype.name && X.prototype.options || X.prototype.delete || console.log("dc");
  function Ka() {
    function a(a) {
      a = a || "[DEFAULT]";var c = b[a];void 0 === c && Z("noApp", { name: a });return c;
    }var b = {},
        c = {},
        d = [],
        e = { __esModule: !0, initializeApp: function initializeApp(a, c) {
        void 0 === c ? c = "[DEFAULT]" : "string" === typeof c && "" !== c || Z("bad-app-name", { name: c + "" });void 0 !== b[c] && Z("dupApp", { name: c });var f = new X(a, c, e);b[c] = f;d.forEach(function (a) {
          return a("create", f);
        });void 0 != f.INTERNAL && void 0 != f.INTERNAL.getToken || P(f, { INTERNAL: { getToken: function getToken() {
              return W.resolve(null);
            }, addAuthTokenListener: function addAuthTokenListener() {}, removeAuthTokenListener: function removeAuthTokenListener() {} } });
        return f;
      }, app: a, apps: null, Promise: W, SDK_VERSION: "0.0.0", INTERNAL: { registerService: function registerService(b, d, f) {
          c[b] && Z("dupService", { name: b });c[b] = d;d = function d(c) {
            void 0 === c && (c = a());return c[b]();
          };void 0 !== f && P(d, f);return e[b] = d;
        }, createFirebaseNamespace: Ka, extendNamespace: function extendNamespace(a) {
          P(e, a);
        }, createSubscribe: Ga, ErrorFactory: Q, registerAppHook: function registerAppHook(a) {
          d.push(a);
        }, removeApp: function removeApp(a) {
          d.forEach(function (c) {
            return c("delete", b[a]);
          });delete b[a];
        }, factories: c, Promise: O, deepExtend: P } };e["default"] = e;Object.defineProperty(e, "apps", { get: function get() {
        return Object.keys(b).map(function (a) {
          return b[a];
        });
      } });a.App = X;return e;
  }function Z(a, b) {
    throw Error(Ja(a, b));
  }
  function Ja(a, b) {
    b = b || {};b = { noApp: "No Firebase App '" + b.name + "' has been created - call Firebase App.initializeApp().", "bad-app-name": "Illegal App name: '" + b.name + "'.", dupApp: "Firebase App named '" + b.name + "' already exists.", deleted: "Firebase App named '" + b.name + "' already deleted.", dupService: "Firebase Service named '" + b.name + "' already registered." }[a];return void 0 === b ? "Application Error: (" + a + ")" : b;
  };"undefined" !== typeof window && (window.firebase = Ka());
})();
firebase.SDK_VERSION = "3.2.1";
(function () {
  var h,
      aa = aa || {},
      l = this,
      ba = function ba() {},
      ca = function ca(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);if ("object" == b) {
      if (a) {
        if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
      } else return "null";
    } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
  },
      da = function da(a) {
    return null === a;
  },
      ea = function ea(a) {
    return "array" == ca(a);
  },
      fa = function fa(a) {
    var b = ca(a);return "array" == b || "object" == b && "number" == typeof a.length;
  },
      m = function m(a) {
    return "string" == typeof a;
  },
      ga = function ga(a) {
    return "number" == typeof a;
  },
      n = function n(a) {
    return "function" == ca(a);
  },
      ha = function ha(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);return "object" == b && null != a || "function" == b;
  },
      ia = function ia(a, b, c) {
    return a.call.apply(a.bind, arguments);
  },
      ja = function ja(a, b, c) {
    if (!a) throw Error();if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);return function () {
        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
      };
    }return function () {
      return a.apply(b, arguments);
    };
  },
      _q2 = function q(a, b, c) {
    _q2 = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ia : ja;return _q2.apply(null, arguments);
  },
      ka = function ka(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);return function () {
      var b = c.slice();b.push.apply(b, arguments);return a.apply(this, b);
    };
  },
      la = Date.now || function () {
    return +new Date();
  },
      r = function r(a, b) {
    function c() {}c.prototype = b.prototype;a.Ic = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.Ke = function (a, c, f) {
      for (var g = Array(arguments.length - 2), k = 2; k < arguments.length; k++) {
        g[k - 2] = arguments[k];
      }return b.prototype[c].apply(a, g);
    };
  };var t = function t(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, t);else {
      var b = Error().stack;b && (this.stack = b);
    }a && (this.message = String(a));
  };r(t, Error);t.prototype.name = "CustomError";var ma = function ma(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
      d += c.shift() + e.shift();
    }return d + c.join("%s");
  },
      na = String.prototype.trim ? function (a) {
    return a.trim();
  } : function (a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
  },
      oa = /&/g,
      pa = /</g,
      qa = />/g,
      ra = /"/g,
      sa = /'/g,
      ta = /\x00/g,
      ua = /[\x00&<>"']/,
      u = function u(a, b) {
    return -1 != a.indexOf(b);
  },
      va = function va(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  };var wa = function wa(a, b) {
    b.unshift(a);t.call(this, ma.apply(null, b));b.shift();
  };r(wa, t);wa.prototype.name = "AssertionError";
  var xa = function xa(a, b, c, d) {
    var e = "Assertion failed";if (c) var e = e + (": " + c),
        f = d;else a && (e += ": " + a, f = b);throw new wa("" + e, f || []);
  },
      v = function v(a, b, c) {
    a || xa("", null, b, Array.prototype.slice.call(arguments, 2));
  },
      ya = function ya(a, b) {
    throw new wa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  },
      za = function za(a, b, c) {
    ga(a) || xa("Expected number but got %s: %s.", [ca(a), a], b, Array.prototype.slice.call(arguments, 2));return a;
  },
      Aa = function Aa(a, b, c) {
    m(a) || xa("Expected string but got %s: %s.", [ca(a), a], b, Array.prototype.slice.call(arguments, 2));
  },
      Ba = function Ba(a, b, c) {
    n(a) || xa("Expected function but got %s: %s.", [ca(a), a], b, Array.prototype.slice.call(arguments, 2));
  };var Ca = Array.prototype.indexOf ? function (a, b, c) {
    v(null != a.length);return Array.prototype.indexOf.call(a, b, c);
  } : function (a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;if (m(a)) return m(b) && 1 == b.length ? a.indexOf(b, c) : -1;for (; c < a.length; c++) {
      if (c in a && a[c] === b) return c;
    }return -1;
  },
      w = Array.prototype.forEach ? function (a, b, c) {
    v(null != a.length);Array.prototype.forEach.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++) {
      f in e && b.call(c, e[f], f, a);
    }
  },
      Da = function Da(a, b) {
    for (var c = m(a) ? a.split("") : a, d = a.length - 1; 0 <= d; --d) {
      d in c && b.call(void 0, c[d], d, a);
    }
  },
      Ea = Array.prototype.map ? function (a, b, c) {
    v(null != a.length);return Array.prototype.map.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = Array(d), f = m(a) ? a.split("") : a, g = 0; g < d; g++) {
      g in f && (e[g] = b.call(c, f[g], g, a));
    }return e;
  },
      Fa = Array.prototype.some ? function (a, b, c) {
    v(null != a.length);return Array.prototype.some.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++) {
      if (f in e && b.call(c, e[f], f, a)) return !0;
    }return !1;
  },
      Ha = function Ha(a) {
    var b;a: {
      b = Ga;for (var c = a.length, d = m(a) ? a.split("") : a, e = 0; e < c; e++) {
        if (e in d && b.call(void 0, d[e], e, a)) {
          b = e;break a;
        }
      }b = -1;
    }return 0 > b ? null : m(a) ? a.charAt(b) : a[b];
  },
      Ia = function Ia(a, b) {
    return 0 <= Ca(a, b);
  },
      Ka = function Ka(a, b) {
    var c = Ca(a, b),
        d;(d = 0 <= c) && Ja(a, c);return d;
  },
      Ja = function Ja(a, b) {
    v(null != a.length);return 1 == Array.prototype.splice.call(a, b, 1).length;
  },
      La = function La(a, b) {
    var c = 0;Da(a, function (d, e) {
      b.call(void 0, d, e, a) && Ja(a, e) && c++;
    });
  },
      Ma = function Ma(a) {
    return Array.prototype.concat.apply(Array.prototype, arguments);
  },
      Na = function Na(a) {
    return Array.prototype.concat.apply(Array.prototype, arguments);
  },
      Oa = function Oa(a) {
    var b = a.length;if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) {
        c[d] = a[d];
      }return c;
    }return [];
  },
      Pa = function Pa(a, b) {
    for (var c = 1; c < arguments.length; c++) {
      var d = arguments[c];if (fa(d)) {
        var e = a.length || 0,
            f = d.length || 0;a.length = e + f;for (var g = 0; g < f; g++) {
          a[e + g] = d[g];
        }
      } else a.push(d);
    }
  };var Qa = function Qa(a, b) {
    for (var c in a) {
      b.call(void 0, a[c], c, a);
    }
  },
      Ra = function Ra(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = a[d];
    }return b;
  },
      Sa = function Sa(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = d;
    }return b;
  },
      Ta = function Ta(a) {
    for (var b in a) {
      return !1;
    }return !0;
  },
      Ua = function Ua(a, b) {
    for (var c in a) {
      if (!(c in b) || a[c] !== b[c]) return !1;
    }for (c in b) {
      if (!(c in a)) return !1;
    }return !0;
  },
      Xa = function Xa(a) {
    var b = {},
        c;for (c in a) {
      b[c] = a[c];
    }return b;
  },
      Ya = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
      Za = function Za(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];for (c in d) {
        a[c] = d[c];
      }for (var f = 0; f < Ya.length; f++) {
        c = Ya[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
      }
    }
  };var $a;a: {
    var ab = l.navigator;if (ab) {
      var bb = ab.userAgent;if (bb) {
        $a = bb;break a;
      }
    }$a = "";
  }var x = function x(a) {
    return u($a, a);
  };var cb = x("Opera"),
      y = x("Trident") || x("MSIE"),
      db = x("Edge"),
      eb = db || y,
      fb = x("Gecko") && !(u($a.toLowerCase(), "webkit") && !x("Edge")) && !(x("Trident") || x("MSIE")) && !x("Edge"),
      gb = u($a.toLowerCase(), "webkit") && !x("Edge"),
      hb = function hb() {
    var a = l.document;return a ? a.documentMode : void 0;
  },
      ib;
  a: {
    var jb = "",
        kb = function () {
      var a = $a;if (fb) return (/rv\:([^\);]+)(\)|;)/.exec(a)
      );if (db) return (/Edge\/([\d\.]+)/.exec(a)
      );if (y) return (/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
      );if (gb) return (/WebKit\/(\S+)/.exec(a)
      );if (cb) return (/(?:Version)[ \/]?(\S+)/.exec(a)
      );
    }();kb && (jb = kb ? kb[1] : "");if (y) {
      var lb = hb();if (null != lb && lb > parseFloat(jb)) {
        ib = String(lb);break a;
      }
    }ib = jb;
  }
  var mb = ib,
      nb = {},
      z = function z(a) {
    var b;if (!(b = nb[a])) {
      b = 0;for (var c = na(String(mb)).split("."), d = na(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
        var g = c[f] || "",
            k = d[f] || "",
            p = RegExp("(\\d*)(\\D*)", "g"),
            Y = RegExp("(\\d*)(\\D*)", "g");do {
          var Va = p.exec(g) || ["", "", ""],
              Wa = Y.exec(k) || ["", "", ""];if (0 == Va[0].length && 0 == Wa[0].length) break;b = va(0 == Va[1].length ? 0 : parseInt(Va[1], 10), 0 == Wa[1].length ? 0 : parseInt(Wa[1], 10)) || va(0 == Va[2].length, 0 == Wa[2].length) || va(Va[2], Wa[2]);
        } while (0 == b);
      }b = nb[a] = 0 <= b;
    }return b;
  },
      ob = l.document,
      pb = ob && y ? hb() || ("CSS1Compat" == ob.compatMode ? parseInt(mb, 10) : 5) : void 0;var qb = null,
      rb = null,
      tb = function tb(a) {
    var b = "";sb(a, function (a) {
      b += String.fromCharCode(a);
    });return b;
  },
      sb = function sb(a, b) {
    function c(b) {
      for (; d < a.length;) {
        var c = a.charAt(d++),
            e = rb[c];if (null != e) return e;if (!/^[\s\xa0]*$/.test(c)) throw Error("Unknown base64 encoding at char: " + c);
      }return b;
    }ub();for (var d = 0;;) {
      var e = c(-1),
          f = c(0),
          g = c(64),
          k = c(64);if (64 === k && -1 === e) break;b(e << 2 | f >> 4);64 != g && (b(f << 4 & 240 | g >> 2), 64 != k && b(g << 6 & 192 | k));
    }
  },
      ub = function ub() {
    if (!qb) {
      qb = {};rb = {};for (var a = 0; 65 > a; a++) {
        qb[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), rb[qb[a]] = a, 62 <= a && (rb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)] = a);
      }
    }
  };var wb = function wb() {
    this.Wb = "";this.Ed = vb;
  };wb.prototype.pc = !0;wb.prototype.nc = function () {
    return this.Wb;
  };wb.prototype.toString = function () {
    return "Const{" + this.Wb + "}";
  };var xb = function xb(a) {
    if (a instanceof wb && a.constructor === wb && a.Ed === vb) return a.Wb;ya("expected object of type Const, got '" + a + "'");return "type_error:Const";
  },
      vb = {};var A = function A() {
    this.ea = "";this.Dd = yb;
  };A.prototype.pc = !0;A.prototype.nc = function () {
    return this.ea;
  };A.prototype.toString = function () {
    return "SafeUrl{" + this.ea + "}";
  };
  var zb = function zb(a) {
    if (a instanceof A && a.constructor === A && a.Dd === yb) return a.ea;ya("expected object of type SafeUrl, got '" + a + "' of type " + ca(a));return "type_error:SafeUrl";
  },
      Ab = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,
      Cb = function Cb(a) {
    if (a instanceof A) return a;a = a.pc ? a.nc() : String(a);Ab.test(a) || (a = "about:invalid#zClosurez");return Bb(a);
  },
      yb = {},
      Bb = function Bb(a) {
    var b = new A();b.ea = a;return b;
  };Bb("about:blank");var Eb = function Eb() {
    this.ea = "";this.Cd = Db;
  };Eb.prototype.pc = !0;Eb.prototype.nc = function () {
    return this.ea;
  };Eb.prototype.toString = function () {
    return "SafeHtml{" + this.ea + "}";
  };var Fb = function Fb(a) {
    if (a instanceof Eb && a.constructor === Eb && a.Cd === Db) return a.ea;ya("expected object of type SafeHtml, got '" + a + "' of type " + ca(a));return "type_error:SafeHtml";
  },
      Db = {};Eb.prototype.he = function (a) {
    this.ea = a;return this;
  };var Gb = function Gb(a, b) {
    var c;c = b instanceof A ? b : Cb(b);a.href = zb(c);
  };var Hb = function Hb(a) {
    Hb[" "](a);return a;
  };Hb[" "] = ba;var Ib = !y || 9 <= Number(pb),
      Jb = y && !z("9");!gb || z("528");fb && z("1.9b") || y && z("8") || cb && z("9.5") || gb && z("528");fb && !z("8") || y && z("9");var Kb = function Kb() {
    this.va = this.va;this.Lb = this.Lb;
  };Kb.prototype.va = !1;Kb.prototype.isDisposed = function () {
    return this.va;
  };Kb.prototype.Ka = function () {
    if (this.Lb) for (; this.Lb.length;) {
      this.Lb.shift()();
    }
  };var Lb = function Lb(a, b) {
    this.type = a;this.currentTarget = this.target = b;this.defaultPrevented = this.Ta = !1;this.od = !0;
  };Lb.prototype.preventDefault = function () {
    this.defaultPrevented = !0;this.od = !1;
  };var Mb = function Mb(a, b) {
    Lb.call(this, a ? a.type : "");this.relatedTarget = this.currentTarget = this.target = null;this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;this.Bb = this.state = null;a && this.init(a, b);
  };r(Mb, Lb);
  Mb.prototype.init = function (a, b) {
    var c = this.type = a.type,
        d = a.changedTouches ? a.changedTouches[0] : null;this.target = a.target || a.srcElement;this.currentTarget = b;var e = a.relatedTarget;if (e) {
      if (fb) {
        var f;a: {
          try {
            Hb(e.nodeName);f = !0;break a;
          } catch (g) {}f = !1;
        }f || (e = null);
      }
    } else "mouseover" == c ? e = a.fromElement : "mouseout" == c && (e = a.toElement);this.relatedTarget = e;null === d ? (this.offsetX = gb || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = gb || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);this.button = a.button;this.keyCode = a.keyCode || 0;this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);this.ctrlKey = a.ctrlKey;this.altKey = a.altKey;this.shiftKey = a.shiftKey;this.metaKey = a.metaKey;this.state = a.state;this.Bb = a;a.defaultPrevented && this.preventDefault();
  };Mb.prototype.preventDefault = function () {
    Mb.Ic.preventDefault.call(this);var a = this.Bb;if (a.preventDefault) a.preventDefault();else if (a.returnValue = !1, Jb) try {
      if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1;
    } catch (b) {}
  };var Nb = "closure_listenable_" + (1E6 * Math.random() | 0),
      Ob = 0;var Pb = function Pb(a, b, c, d, e) {
    this.listener = a;this.Nb = null;this.src = b;this.type = c;this.xb = !!d;this.Gb = e;this.key = ++Ob;this.Xa = this.wb = !1;
  },
      Qb = function Qb(a) {
    a.Xa = !0;a.listener = null;a.Nb = null;a.src = null;a.Gb = null;
  };var Rb = function Rb(a) {
    this.src = a;this.v = {};this.vb = 0;
  };Rb.prototype.add = function (a, b, c, d, e) {
    var f = a.toString();a = this.v[f];a || (a = this.v[f] = [], this.vb++);var g = Sb(a, b, d, e);-1 < g ? (b = a[g], c || (b.wb = !1)) : (b = new Pb(b, this.src, f, !!d, e), b.wb = c, a.push(b));return b;
  };Rb.prototype.remove = function (a, b, c, d) {
    a = a.toString();if (!(a in this.v)) return !1;var e = this.v[a];b = Sb(e, b, c, d);return -1 < b ? (Qb(e[b]), Ja(e, b), 0 == e.length && (delete this.v[a], this.vb--), !0) : !1;
  };
  var Tb = function Tb(a, b) {
    var c = b.type;c in a.v && Ka(a.v[c], b) && (Qb(b), 0 == a.v[c].length && (delete a.v[c], a.vb--));
  };Rb.prototype.mc = function (a, b, c, d) {
    a = this.v[a.toString()];var e = -1;a && (e = Sb(a, b, c, d));return -1 < e ? a[e] : null;
  };var Sb = function Sb(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];if (!f.Xa && f.listener == b && f.xb == !!c && f.Gb == d) return e;
    }return -1;
  };var Ub = "closure_lm_" + (1E6 * Math.random() | 0),
      Vb = {},
      Wb = 0,
      Xb = function Xb(a, b, c, d, e) {
    if (ea(b)) for (var f = 0; f < b.length; f++) {
      Xb(a, b[f], c, d, e);
    } else c = Yb(c), a && a[Nb] ? a.listen(b, c, d, e) : Zb(a, b, c, !1, d, e);
  },
      Zb = function Zb(a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");var g = !!e,
        k = $b(a);k || (a[Ub] = k = new Rb(a));c = k.add(b, c, d, e, f);if (c.Nb) return;d = ac();c.Nb = d;d.src = a;d.listener = c;if (a.addEventListener) a.addEventListener(b.toString(), d, g);else if (a.attachEvent) a.attachEvent(bc(b.toString()), d);else throw Error("addEventListener and attachEvent are unavailable.");
    Wb++;
  },
      ac = function ac() {
    var a = cc,
        b = Ib ? function (c) {
      return a.call(b.src, b.listener, c);
    } : function (c) {
      c = a.call(b.src, b.listener, c);if (!c) return c;
    };return b;
  },
      dc = function dc(a, b, c, d, e) {
    if (ea(b)) for (var f = 0; f < b.length; f++) {
      dc(a, b[f], c, d, e);
    } else c = Yb(c), a && a[Nb] ? ec(a, b, c, d, e) : Zb(a, b, c, !0, d, e);
  },
      fc = function fc(a, b, c, d, e) {
    if (ea(b)) for (var f = 0; f < b.length; f++) {
      fc(a, b[f], c, d, e);
    } else c = Yb(c), a && a[Nb] ? a.V.remove(String(b), c, d, e) : a && (a = $b(a)) && (b = a.mc(b, c, !!d, e)) && gc(b);
  },
      gc = function gc(a) {
    if (!ga(a) && a && !a.Xa) {
      var b = a.src;if (b && b[Nb]) Tb(b.V, a);else {
        var c = a.type,
            d = a.Nb;b.removeEventListener ? b.removeEventListener(c, d, a.xb) : b.detachEvent && b.detachEvent(bc(c), d);Wb--;(c = $b(b)) ? (Tb(c, a), 0 == c.vb && (c.src = null, b[Ub] = null)) : Qb(a);
      }
    }
  },
      bc = function bc(a) {
    return a in Vb ? Vb[a] : Vb[a] = "on" + a;
  },
      ic = function ic(a, b, c, d) {
    var e = !0;if (a = $b(a)) if (b = a.v[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
      var f = b[a];f && f.xb == c && !f.Xa && (f = hc(f, d), e = e && !1 !== f);
    }return e;
  },
      hc = function hc(a, b) {
    var c = a.listener,
        d = a.Gb || a.src;a.wb && gc(a);return c.call(d, b);
  },
      cc = function cc(a, b) {
    if (a.Xa) return !0;
    if (!Ib) {
      var c;if (!(c = b)) a: {
        c = ["window", "event"];for (var d = l, e; e = c.shift();) {
          if (null != d[e]) d = d[e];else {
            c = null;break a;
          }
        }c = d;
      }e = c;c = new Mb(e, this);d = !0;if (!(0 > e.keyCode || void 0 != e.returnValue)) {
        a: {
          var f = !1;if (0 == e.keyCode) try {
            e.keyCode = -1;break a;
          } catch (p) {
            f = !0;
          }if (f || void 0 == e.returnValue) e.returnValue = !0;
        }e = [];for (f = c.currentTarget; f; f = f.parentNode) {
          e.push(f);
        }for (var f = a.type, g = e.length - 1; !c.Ta && 0 <= g; g--) {
          c.currentTarget = e[g];var k = ic(e[g], f, !0, c),
              d = d && k;
        }for (g = 0; !c.Ta && g < e.length; g++) {
          c.currentTarget = e[g], k = ic(e[g], f, !1, c), d = d && k;
        }
      }return d;
    }return hc(a, new Mb(b, this));
  },
      $b = function $b(a) {
    a = a[Ub];return a instanceof Rb ? a : null;
  },
      jc = "__closure_events_fn_" + (1E9 * Math.random() >>> 0),
      Yb = function Yb(a) {
    v(a, "Listener can not be null.");if (n(a)) return a;v(a.handleEvent, "An object listener must have handleEvent method.");a[jc] || (a[jc] = function (b) {
      return a.handleEvent(b);
    });return a[jc];
  };var kc = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;var lc = function lc(a) {
    a = String(a);if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) try {
      return eval("(" + a + ")");
    } catch (b) {}throw Error("Invalid JSON string: " + a);
  },
      oc = function oc(a) {
    var b = [];mc(new nc(), a, b);return b.join("");
  },
      nc = function nc() {
    this.Qb = void 0;
  },
      mc = function mc(a, b, c) {
    if (null == b) c.push("null");else {
      if ("object" == (typeof b === "undefined" ? "undefined" : _typeof(b))) {
        if (ea(b)) {
          var d = b;b = d.length;c.push("[");for (var e = "", f = 0; f < b; f++) {
            c.push(e), e = d[f], mc(a, a.Qb ? a.Qb.call(d, String(f), e) : e, c), e = ",";
          }c.push("]");return;
        }if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();else {
          c.push("{");f = "";for (d in b) {
            Object.prototype.hasOwnProperty.call(b, d) && (e = b[d], "function" != typeof e && (c.push(f), pc(d, c), c.push(":"), mc(a, a.Qb ? a.Qb.call(b, d, e) : e, c), f = ","));
          }c.push("}");return;
        }
      }switch (typeof b === "undefined" ? "undefined" : _typeof(b)) {case "string":
          pc(b, c);break;case "number":
          c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");break;case "boolean":
          c.push(String(b));break;case "function":
          c.push("null");break;default:
          throw Error("Unknown type: " + (typeof b === "undefined" ? "undefined" : _typeof(b)));}
    }
  },
      qc = { '"': '\\"', "\\": "\\\\", "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b" },
      rc = /\uffff/.test("\uFFFF") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g,
      pc = function pc(a, b) {
    b.push('"', a.replace(rc, function (a) {
      var b = qc[a];b || (b = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), qc[a] = b);return b;
    }), '"');
  };var sc = function sc() {};sc.prototype.Lc = null;var tc = function tc(a) {
    return a.Lc || (a.Lc = a.sc());
  };var uc,
      vc = function vc() {};r(vc, sc);vc.prototype.yb = function () {
    var a = wc(this);return a ? new ActiveXObject(a) : new XMLHttpRequest();
  };vc.prototype.sc = function () {
    var a = {};wc(this) && (a[0] = !0, a[1] = !0);return a;
  };
  var wc = function wc(a) {
    if (!a.$c && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
      for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
        var d = b[c];try {
          return new ActiveXObject(d), a.$c = d;
        } catch (e) {}
      }throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }return a.$c;
  };uc = new vc();var xc = function xc() {};r(xc, sc);xc.prototype.yb = function () {
    var a = new XMLHttpRequest();if ("withCredentials" in a) return a;if ("undefined" != typeof XDomainRequest) return new yc();throw Error("Unsupported browser");
  };xc.prototype.sc = function () {
    return {};
  };
  var yc = function yc() {
    this.ia = new XDomainRequest();this.readyState = 0;this.onreadystatechange = null;this.responseText = "";this.status = -1;this.statusText = this.responseXML = null;this.ia.onload = _q2(this.Wd, this);this.ia.onerror = _q2(this.Yc, this);this.ia.onprogress = _q2(this.Xd, this);this.ia.ontimeout = _q2(this.Yd, this);
  };h = yc.prototype;h.open = function (a, b, c) {
    if (null != c && !c) throw Error("Only async requests are supported.");this.ia.open(a, b);
  };
  h.send = function (a) {
    if (a) {
      if ("string" == typeof a) this.ia.send(a);else throw Error("Only string data is supported");
    } else this.ia.send();
  };h.abort = function () {
    this.ia.abort();
  };h.setRequestHeader = function () {};h.Wd = function () {
    this.status = 200;this.responseText = this.ia.responseText;zc(this, 4);
  };h.Yc = function () {
    this.status = 500;this.responseText = "";zc(this, 4);
  };h.Yd = function () {
    this.Yc();
  };h.Xd = function () {
    this.status = 200;zc(this, 1);
  };var zc = function zc(a, b) {
    a.readyState = b;if (a.onreadystatechange) a.onreadystatechange();
  };var B = function B(a, b) {
    this.h = [];this.g = b;for (var c = !0, d = a.length - 1; 0 <= d; d--) {
      var e = a[d] | 0;c && e == b || (this.h[d] = e, c = !1);
    }
  },
      Ac = {},
      Bc = function Bc(a) {
    if (-128 <= a && 128 > a) {
      var b = Ac[a];if (b) return b;
    }b = new B([a | 0], 0 > a ? -1 : 0);-128 <= a && 128 > a && (Ac[a] = b);return b;
  },
      E = function E(a) {
    if (isNaN(a) || !isFinite(a)) return C;if (0 > a) return D(E(-a));for (var b = [], c = 1, d = 0; a >= c; d++) {
      b[d] = a / c | 0, c *= 4294967296;
    }return new B(b, 0);
  },
      Cc = function Cc(a, b) {
    if (0 == a.length) throw Error("number format error: empty string");var c = b || 10;if (2 > c || 36 < c) throw Error("radix out of range: " + c);if ("-" == a.charAt(0)) return D(Cc(a.substring(1), c));if (0 <= a.indexOf("-")) throw Error('number format error: interior "-" character');for (var d = E(Math.pow(c, 8)), e = C, f = 0; f < a.length; f += 8) {
      var g = Math.min(8, a.length - f),
          k = parseInt(a.substring(f, f + g), c);8 > g ? (g = E(Math.pow(c, g)), e = e.multiply(g).add(E(k))) : (e = e.multiply(d), e = e.add(E(k)));
    }return e;
  },
      C = Bc(0),
      Dc = Bc(1),
      Ec = Bc(16777216),
      Fc = function Fc(a) {
    if (-1 == a.g) return -Fc(D(a));for (var b = 0, c = 1, d = 0; d < a.h.length; d++) {
      b += Gc(a, d) * c, c *= 4294967296;
    }return b;
  };
  B.prototype.toString = function (a) {
    a = a || 10;if (2 > a || 36 < a) throw Error("radix out of range: " + a);if (F(this)) return "0";if (-1 == this.g) return "-" + D(this).toString(a);for (var b = E(Math.pow(a, 6)), c = this, d = "";;) {
      var e = Hc(c, b),
          c = Ic(c, e.multiply(b)),
          f = ((0 < c.h.length ? c.h[0] : c.g) >>> 0).toString(a),
          c = e;if (F(c)) return f + d;for (; 6 > f.length;) {
        f = "0" + f;
      }d = "" + f + d;
    }
  };
  var G = function G(a, b) {
    return 0 > b ? 0 : b < a.h.length ? a.h[b] : a.g;
  },
      Gc = function Gc(a, b) {
    var c = G(a, b);return 0 <= c ? c : 4294967296 + c;
  },
      F = function F(a) {
    if (0 != a.g) return !1;for (var b = 0; b < a.h.length; b++) {
      if (0 != a.h[b]) return !1;
    }return !0;
  };B.prototype.Ab = function (a) {
    if (this.g != a.g) return !1;for (var b = Math.max(this.h.length, a.h.length), c = 0; c < b; c++) {
      if (G(this, c) != G(a, c)) return !1;
    }return !0;
  };B.prototype.compare = function (a) {
    a = Ic(this, a);return -1 == a.g ? -1 : F(a) ? 0 : 1;
  };
  var D = function D(a) {
    for (var b = a.h.length, c = [], d = 0; d < b; d++) {
      c[d] = ~a.h[d];
    }return new B(c, ~a.g).add(Dc);
  };B.prototype.add = function (a) {
    for (var b = Math.max(this.h.length, a.h.length), c = [], d = 0, e = 0; e <= b; e++) {
      var f = d + (G(this, e) & 65535) + (G(a, e) & 65535),
          g = (f >>> 16) + (G(this, e) >>> 16) + (G(a, e) >>> 16),
          d = g >>> 16,
          f = f & 65535,
          g = g & 65535;c[e] = g << 16 | f;
    }return new B(c, c[c.length - 1] & -2147483648 ? -1 : 0);
  };var Ic = function Ic(a, b) {
    return a.add(D(b));
  };
  B.prototype.multiply = function (a) {
    if (F(this) || F(a)) return C;if (-1 == this.g) return -1 == a.g ? D(this).multiply(D(a)) : D(D(this).multiply(a));if (-1 == a.g) return D(this.multiply(D(a)));if (0 > this.compare(Ec) && 0 > a.compare(Ec)) return E(Fc(this) * Fc(a));for (var b = this.h.length + a.h.length, c = [], d = 0; d < 2 * b; d++) {
      c[d] = 0;
    }for (d = 0; d < this.h.length; d++) {
      for (var e = 0; e < a.h.length; e++) {
        var f = G(this, d) >>> 16,
            g = G(this, d) & 65535,
            k = G(a, e) >>> 16,
            p = G(a, e) & 65535;c[2 * d + 2 * e] += g * p;Jc(c, 2 * d + 2 * e);c[2 * d + 2 * e + 1] += f * p;Jc(c, 2 * d + 2 * e + 1);c[2 * d + 2 * e + 1] += g * k;Jc(c, 2 * d + 2 * e + 1);c[2 * d + 2 * e + 2] += f * k;Jc(c, 2 * d + 2 * e + 2);
      }
    }for (d = 0; d < b; d++) {
      c[d] = c[2 * d + 1] << 16 | c[2 * d];
    }for (d = b; d < 2 * b; d++) {
      c[d] = 0;
    }return new B(c, 0);
  };
  var Jc = function Jc(a, b) {
    for (; (a[b] & 65535) != a[b];) {
      a[b + 1] += a[b] >>> 16, a[b] &= 65535;
    }
  },
      Hc = function Hc(a, b) {
    if (F(b)) throw Error("division by zero");if (F(a)) return C;if (-1 == a.g) return -1 == b.g ? Hc(D(a), D(b)) : D(Hc(D(a), b));if (-1 == b.g) return D(Hc(a, D(b)));if (30 < a.h.length) {
      if (-1 == a.g || -1 == b.g) throw Error("slowDivide_ only works with positive integers.");for (var c = Dc, d = b; 0 >= d.compare(a);) {
        c = c.shiftLeft(1), d = d.shiftLeft(1);
      }for (var e = Kc(c, 1), f = Kc(d, 1), g, d = Kc(d, 2), c = Kc(c, 2); !F(d);) {
        g = f.add(d), 0 >= g.compare(a) && (e = e.add(c), f = g), d = Kc(d, 1), c = Kc(c, 1);
      }return e;
    }c = C;for (d = a; 0 <= d.compare(b);) {
      e = Math.max(1, Math.floor(Fc(d) / Fc(b)));f = Math.ceil(Math.log(e) / Math.LN2);f = 48 >= f ? 1 : Math.pow(2, f - 48);g = E(e);for (var k = g.multiply(b); -1 == k.g || 0 < k.compare(d);) {
        e -= f, g = E(e), k = g.multiply(b);
      }F(g) && (g = Dc);c = c.add(g);d = Ic(d, k);
    }return c;
  },
      Lc = function Lc(a, b) {
    for (var c = Math.max(a.h.length, b.h.length), d = [], e = 0; e < c; e++) {
      d[e] = G(a, e) | G(b, e);
    }return new B(d, a.g | b.g);
  };
  B.prototype.shiftLeft = function (a) {
    var b = a >> 5;a %= 32;for (var c = this.h.length + b + (0 < a ? 1 : 0), d = [], e = 0; e < c; e++) {
      d[e] = 0 < a ? G(this, e - b) << a | G(this, e - b - 1) >>> 32 - a : G(this, e - b);
    }return new B(d, this.g);
  };var Kc = function Kc(a, b) {
    for (var c = b >> 5, d = b % 32, e = a.h.length - c, f = [], g = 0; g < e; g++) {
      f[g] = 0 < d ? G(a, g + c) >>> d | G(a, g + c + 1) << 32 - d : G(a, g + c);
    }return new B(f, a.g);
  };var Mc = function Mc(a, b) {
    this.lb = a;this.ha = b;
  };Mc.prototype.Ab = function (a) {
    return this.ha == a.ha && this.lb.Ab(Xa(a.lb));
  };
  var Pc = function Pc(a) {
    try {
      var b;if (b = 0 == a.lastIndexOf("[", 0)) {
        var c = a.length - 1;b = 0 <= c && a.indexOf("]", c) == c;
      }return b ? new Nc(a.substring(1, a.length - 1)) : new Oc(a);
    } catch (d) {
      return null;
    }
  },
      Oc = function Oc(a) {
    var b = C;if (a instanceof B) {
      if (0 != a.g || 0 > a.compare(C) || 0 < a.compare(Qc)) throw Error("The address does not look like an IPv4.");b = Xa(a);
    } else {
      if (!Rc.test(a)) throw Error(a + " does not look like an IPv4 address.");var c = a.split(".");if (4 != c.length) throw Error(a + " does not look like an IPv4 address.");for (var d = 0; d < c.length; d++) {
        var e;e = c[d];var f = Number(e);e = 0 == f && /^[\s\xa0]*$/.test(e) ? NaN : f;if (isNaN(e) || 0 > e || 255 < e || 1 != c[d].length && 0 == c[d].lastIndexOf("0", 0)) throw Error("In " + a + ", octet " + d + " is not valid");e = E(e);b = Lc(b.shiftLeft(8), e);
      }
    }Mc.call(this, b, 4);
  };r(Oc, Mc);var Rc = /^[0-9.]*$/,
      Qc = Ic(Dc.shiftLeft(32), Dc);Oc.prototype.toString = function () {
    if (this.za) return this.za;for (var a = Gc(this.lb, 0), b = [], c = 3; 0 <= c; c--) {
      b[c] = String(a & 255), a >>>= 8;
    }return this.za = b.join(".");
  };
  var Nc = function Nc(a) {
    var b = C;if (a instanceof B) {
      if (0 != a.g || 0 > a.compare(C) || 0 < a.compare(Sc)) throw Error("The address does not look like a valid IPv6.");b = Xa(a);
    } else {
      if (!Tc.test(a)) throw Error(a + " is not a valid IPv6 address.");var c = a.split(":");if (-1 != c[c.length - 1].indexOf(".")) {
        a = Gc(Xa(new Oc(c[c.length - 1]).lb), 0);var d = [];d.push((a >>> 16 & 65535).toString(16));d.push((a & 65535).toString(16));Ja(c, c.length - 1);Pa(c, d);a = c.join(":");
      }d = a.split("::");if (2 < d.length || 1 == d.length && 8 != c.length) throw Error(a + " is not a valid IPv6 address.");if (1 < d.length) {
        c = d[0].split(":");d = d[1].split(":");1 == c.length && "" == c[0] && (c = []);1 == d.length && "" == d[0] && (d = []);var e = 8 - (c.length + d.length);if (1 > e) c = [];else {
          for (var f = [], g = 0; g < e; g++) {
            f[g] = "0";
          }c = Na(c, f, d);
        }
      }if (8 != c.length) throw Error(a + " is not a valid IPv6 address");for (d = 0; d < c.length; d++) {
        e = Cc(c[d], 16);if (0 > e.compare(C) || 0 < e.compare(Uc)) throw Error(c[d] + " in " + a + " is not a valid hextet.");b = Lc(b.shiftLeft(16), e);
      }
    }Mc.call(this, b, 6);
  };r(Nc, Mc);
  var Tc = /^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/,
      Uc = Bc(65535),
      Sc = Ic(Dc.shiftLeft(128), Dc);Nc.prototype.toString = function () {
    if (this.za) return this.za;for (var a = [], b = 3; 0 <= b; b--) {
      var c = Gc(this.lb, b),
          d = c & 65535;a.push((c >>> 16).toString(16));a.push(d.toString(16));
    }for (var c = b = -1, e = d = 0, f = 0; f < a.length; f++) {
      "0" == a[f] ? (e++, -1 == c && (c = f), e > d && (d = e, b = c)) : (c = -1, e = 0);
    }0 < d && (b + d == a.length && a.push(""), a.splice(b, d, ""), 0 == b && (a = [""].concat(a)));return this.za = a.join(":");
  };!fb && !y || y && 9 <= Number(pb) || fb && z("1.9.1");y && z("9");var Wc = function Wc(a, b) {
    Qa(b, function (b, d) {
      "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : Vc.hasOwnProperty(d) ? a.setAttribute(Vc[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b;
    });
  },
      Vc = { cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", frameborder: "frameBorder", height: "height", maxlength: "maxLength", nonce: "nonce", role: "role", rowspan: "rowSpan", type: "type", usemap: "useMap", valign: "vAlign", width: "width" };var Xc = function Xc(a, b, c) {
    this.je = c;this.Ld = a;this.ve = b;this.Kb = 0;this.Hb = null;
  };Xc.prototype.get = function () {
    var a;0 < this.Kb ? (this.Kb--, a = this.Hb, this.Hb = a.next, a.next = null) : a = this.Ld();return a;
  };Xc.prototype.put = function (a) {
    this.ve(a);this.Kb < this.je && (this.Kb++, a.next = this.Hb, this.Hb = a);
  };var Yc = function Yc(a) {
    l.setTimeout(function () {
      throw a;
    }, 0);
  },
      Zc,
      $c = function $c() {
    var a = l.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !x("Presto") && (a = function a() {
      var a = document.createElement("IFRAME");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);var b = a.contentWindow,
          a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
          d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
          a = _q2(function (a) {
        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
      }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
          b.postMessage(c, d);
        } };
    });if ("undefined" !== typeof a && !x("Trident") && !x("MSIE")) {
      var b = new a(),
          c = {},
          d = c;b.port1.onmessage = function () {
        if (void 0 !== c.next) {
          c = c.next;var a = c.Pc;c.Pc = null;a();
        }
      };return function (a) {
        d.next = { Pc: a };d = d.next;b.port2.postMessage(0);
      };
    }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) {
      var b = document.createElement("SCRIPT");b.onreadystatechange = function () {
        b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
      };document.documentElement.appendChild(b);
    } : function (a) {
      l.setTimeout(a, 0);
    };
  };var ad = function ad() {
    this.ac = this.Ha = null;
  },
      cd = new Xc(function () {
    return new bd();
  }, function (a) {
    a.reset();
  }, 100);ad.prototype.add = function (a, b) {
    var c = cd.get();c.set(a, b);this.ac ? this.ac.next = c : (v(!this.Ha), this.Ha = c);this.ac = c;
  };ad.prototype.remove = function () {
    var a = null;this.Ha && (a = this.Ha, this.Ha = this.Ha.next, this.Ha || (this.ac = null), a.next = null);return a;
  };var bd = function bd() {
    this.next = this.scope = this.lc = null;
  };bd.prototype.set = function (a, b) {
    this.lc = a;this.scope = b;this.next = null;
  };
  bd.prototype.reset = function () {
    this.next = this.scope = this.lc = null;
  };var hd = function hd(a, b) {
    dd || ed();fd || (dd(), fd = !0);gd.add(a, b);
  },
      dd,
      ed = function ed() {
    if (l.Promise && l.Promise.resolve) {
      var a = l.Promise.resolve(void 0);dd = function dd() {
        a.then(id);
      };
    } else dd = function dd() {
      var a = id;!n(l.setImmediate) || l.Window && l.Window.prototype && !x("Edge") && l.Window.prototype.setImmediate == l.setImmediate ? (Zc || (Zc = $c()), Zc(a)) : l.setImmediate(a);
    };
  },
      fd = !1,
      gd = new ad(),
      id = function id() {
    for (var a; a = gd.remove();) {
      try {
        a.lc.call(a.scope);
      } catch (b) {
        Yc(b);
      }cd.put(a);
    }fd = !1;
  };var jd = function jd(a) {
    a.prototype.then = a.prototype.then;a.prototype.$goog_Thenable = !0;
  },
      kd = function kd(a) {
    if (!a) return !1;try {
      return !!a.$goog_Thenable;
    } catch (b) {
      return !1;
    }
  };var H = function H(a, b) {
    this.D = 0;this.ga = void 0;this.Ja = this.ba = this.l = null;this.Fb = this.kc = !1;if (a != ba) try {
      var c = this;a.call(b, function (a) {
        ld(c, 2, a);
      }, function (a) {
        if (!(a instanceof md)) try {
          if (a instanceof Error) throw a;throw Error("Promise rejected.");
        } catch (b) {}ld(c, 3, a);
      });
    } catch (d) {
      ld(this, 3, d);
    }
  },
      nd = function nd() {
    this.next = this.context = this.Pa = this.Aa = this.child = null;this.eb = !1;
  };nd.prototype.reset = function () {
    this.context = this.Pa = this.Aa = this.child = null;this.eb = !1;
  };
  var od = new Xc(function () {
    return new nd();
  }, function (a) {
    a.reset();
  }, 100),
      pd = function pd(a, b, c) {
    var d = od.get();d.Aa = a;d.Pa = b;d.context = c;return d;
  },
      I = function I(a) {
    if (a instanceof H) return a;var b = new H(ba);ld(b, 2, a);return b;
  },
      J = function J(a) {
    return new H(function (b, c) {
      c(a);
    });
  },
      rd = function rd(a, b, c) {
    qd(a, b, c, null) || hd(ka(b, a));
  },
      sd = function sd(a) {
    return new H(function (b) {
      var c = a.length,
          d = [];if (c) for (var e = function e(a, _e, f) {
        c--;d[a] = _e ? { Ud: !0, value: f } : { Ud: !1, reason: f };0 == c && b(d);
      }, f = 0, g; f < a.length; f++) {
        g = a[f], rd(g, ka(e, f, !0), ka(e, f, !1));
      } else b(d);
    });
  };H.prototype.then = function (a, b, c) {
    null != a && Ba(a, "opt_onFulfilled should be a function.");null != b && Ba(b, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return td(this, n(a) ? a : null, n(b) ? b : null, c);
  };jd(H);var vd = function vd(a, b) {
    var c = pd(b, b, void 0);c.eb = !0;ud(a, c);return a;
  };H.prototype.F = function (a, b) {
    return td(this, null, a, b);
  };H.prototype.cancel = function (a) {
    0 == this.D && hd(function () {
      var b = new md(a);wd(this, b);
    }, this);
  };
  var wd = function wd(a, b) {
    if (0 == a.D) if (a.l) {
      var c = a.l;if (c.ba) {
        for (var d = 0, e = null, f = null, g = c.ba; g && (g.eb || (d++, g.child == a && (e = g), !(e && 1 < d))); g = g.next) {
          e || (f = g);
        }e && (0 == c.D && 1 == d ? wd(c, b) : (f ? (d = f, v(c.ba), v(null != d), d.next == c.Ja && (c.Ja = d), d.next = d.next.next) : xd(c), yd(c, e, 3, b)));
      }a.l = null;
    } else ld(a, 3, b);
  },
      ud = function ud(a, b) {
    a.ba || 2 != a.D && 3 != a.D || zd(a);v(null != b.Aa);a.Ja ? a.Ja.next = b : a.ba = b;a.Ja = b;
  },
      td = function td(a, b, c, d) {
    var e = pd(null, null, null);e.child = new H(function (a, g) {
      e.Aa = b ? function (c) {
        try {
          var e = b.call(d, c);a(e);
        } catch (Y) {
          g(Y);
        }
      } : a;e.Pa = c ? function (b) {
        try {
          var e = c.call(d, b);void 0 === e && b instanceof md ? g(b) : a(e);
        } catch (Y) {
          g(Y);
        }
      } : g;
    });e.child.l = a;ud(a, e);return e.child;
  };H.prototype.Ee = function (a) {
    v(1 == this.D);this.D = 0;ld(this, 2, a);
  };H.prototype.Fe = function (a) {
    v(1 == this.D);this.D = 0;ld(this, 3, a);
  };
  var ld = function ld(a, b, c) {
    0 == a.D && (a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself")), a.D = 1, qd(c, a.Ee, a.Fe, a) || (a.ga = c, a.D = b, a.l = null, zd(a), 3 != b || c instanceof md || Ad(a, c)));
  },
      qd = function qd(a, b, c, d) {
    if (a instanceof H) return null != b && Ba(b, "opt_onFulfilled should be a function."), null != c && Ba(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"), ud(a, pd(b || ba, c || null, d)), !0;if (kd(a)) return a.then(b, c, d), !0;if (ha(a)) try {
      var e = a.then;if (n(e)) return Bd(a, e, b, c, d), !0;
    } catch (f) {
      return c.call(d, f), !0;
    }return !1;
  },
      Bd = function Bd(a, b, c, d, e) {
    var f = !1,
        g = function g(a) {
      f || (f = !0, c.call(e, a));
    },
        k = function k(a) {
      f || (f = !0, d.call(e, a));
    };try {
      b.call(a, g, k);
    } catch (p) {
      k(p);
    }
  },
      zd = function zd(a) {
    a.kc || (a.kc = !0, hd(a.Pd, a));
  },
      xd = function xd(a) {
    var b = null;a.ba && (b = a.ba, a.ba = b.next, b.next = null);a.ba || (a.Ja = null);null != b && v(null != b.Aa);return b;
  };H.prototype.Pd = function () {
    for (var a; a = xd(this);) {
      yd(this, a, this.D, this.ga);
    }this.kc = !1;
  };
  var yd = function yd(a, b, c, d) {
    if (3 == c && b.Pa && !b.eb) for (; a && a.Fb; a = a.l) {
      a.Fb = !1;
    }if (b.child) b.child.l = null, Cd(b, c, d);else try {
      b.eb ? b.Aa.call(b.context) : Cd(b, c, d);
    } catch (e) {
      Dd.call(null, e);
    }od.put(b);
  },
      Cd = function Cd(a, b, c) {
    2 == b ? a.Aa.call(a.context, c) : a.Pa && a.Pa.call(a.context, c);
  },
      Ad = function Ad(a, b) {
    a.Fb = !0;hd(function () {
      a.Fb && Dd.call(null, b);
    });
  },
      Dd = Yc,
      md = function md(a) {
    t.call(this, a);
  };r(md, t);md.prototype.name = "cancel"; /*
                                           Portions of this code are from MochiKit, received by
                                           The Closure Authors under the MIT license. All other code is Copyright
                                           2005-2009 The Closure Authors. All Rights Reserved.
                                           */
  var Ed = function Ed(a, b) {
    this.Sb = [];this.hd = a;this.Rc = b || null;this.ib = this.Ma = !1;this.ga = void 0;this.Gc = this.Kc = this.ec = !1;this.Zb = 0;this.l = null;this.fc = 0;
  };Ed.prototype.cancel = function (a) {
    if (this.Ma) this.ga instanceof Ed && this.ga.cancel();else {
      if (this.l) {
        var b = this.l;delete this.l;a ? b.cancel(a) : (b.fc--, 0 >= b.fc && b.cancel());
      }this.hd ? this.hd.call(this.Rc, this) : this.Gc = !0;this.Ma || Fd(this, new Gd());
    }
  };Ed.prototype.Qc = function (a, b) {
    this.ec = !1;Hd(this, a, b);
  };
  var Hd = function Hd(a, b, c) {
    a.Ma = !0;a.ga = c;a.ib = !b;Id(a);
  },
      Kd = function Kd(a) {
    if (a.Ma) {
      if (!a.Gc) throw new Jd();a.Gc = !1;
    }
  };Ed.prototype.callback = function (a) {
    Kd(this);Ld(a);Hd(this, !0, a);
  };var Fd = function Fd(a, b) {
    Kd(a);Ld(b);Hd(a, !1, b);
  },
      Ld = function Ld(a) {
    v(!(a instanceof Ed), "An execution sequence may not be initiated with a blocking Deferred.");
  },
      Nd = function Nd(a, b) {
    Md(a, null, b, void 0);
  },
      Md = function Md(a, b, c, d) {
    v(!a.Kc, "Blocking Deferreds can not be re-used");a.Sb.push([b, c, d]);a.Ma && Id(a);
  };
  Ed.prototype.then = function (a, b, c) {
    var d,
        e,
        f = new H(function (a, b) {
      d = a;e = b;
    });Md(this, d, function (a) {
      a instanceof Gd ? f.cancel() : e(a);
    });return f.then(a, b, c);
  };jd(Ed);
  var Od = function Od(a) {
    return Fa(a.Sb, function (a) {
      return n(a[1]);
    });
  },
      Id = function Id(a) {
    if (a.Zb && a.Ma && Od(a)) {
      var b = a.Zb,
          c = Pd[b];c && (l.clearTimeout(c.jb), delete Pd[b]);a.Zb = 0;
    }a.l && (a.l.fc--, delete a.l);for (var b = a.ga, d = c = !1; a.Sb.length && !a.ec;) {
      var e = a.Sb.shift(),
          f = e[0],
          g = e[1],
          e = e[2];if (f = a.ib ? g : f) try {
        var k = f.call(e || a.Rc, b);void 0 !== k && (a.ib = a.ib && (k == b || k instanceof Error), a.ga = b = k);if (kd(b) || "function" === typeof l.Promise && b instanceof l.Promise) d = !0, a.ec = !0;
      } catch (p) {
        b = p, a.ib = !0, Od(a) || (c = !0);
      }
    }a.ga = b;d && (k = _q2(a.Qc, a, !0), d = _q2(a.Qc, a, !1), b instanceof Ed ? (Md(b, k, d), b.Kc = !0) : b.then(k, d));c && (b = new Qd(b), Pd[b.jb] = b, a.Zb = b.jb);
  },
      Jd = function Jd() {
    t.call(this);
  };r(Jd, t);Jd.prototype.message = "Deferred has already fired";Jd.prototype.name = "AlreadyCalledError";var Gd = function Gd() {
    t.call(this);
  };r(Gd, t);Gd.prototype.message = "Deferred was canceled";Gd.prototype.name = "CanceledError";var Qd = function Qd(a) {
    this.jb = l.setTimeout(_q2(this.De, this), 0);this.I = a;
  };
  Qd.prototype.De = function () {
    v(Pd[this.jb], "Cannot throw an error that is not scheduled.");delete Pd[this.jb];throw this.I;
  };var Pd = {};var Vd = function Vd(a) {
    var b = {},
        c = b.document || document,
        d = document.createElement("SCRIPT"),
        e = { pd: d, ub: void 0 },
        f = new Ed(Rd, e),
        g = null,
        k = null != b.timeout ? b.timeout : 5E3;0 < k && (g = window.setTimeout(function () {
      Sd(d, !0);Fd(f, new Td(1, "Timeout reached for loading script " + a));
    }, k), e.ub = g);d.onload = d.onreadystatechange = function () {
      d.readyState && "loaded" != d.readyState && "complete" != d.readyState || (Sd(d, b.Le || !1, g), f.callback(null));
    };d.onerror = function () {
      Sd(d, !0, g);Fd(f, new Td(0, "Error while loading script " + a));
    };e = b.attributes || {};Za(e, { type: "text/javascript", charset: "UTF-8", src: a });Wc(d, e);Ud(c).appendChild(d);return f;
  },
      Ud = function Ud(a) {
    var b = a.getElementsByTagName("HEAD");return b && 0 != b.length ? b[0] : a.documentElement;
  },
      Rd = function Rd() {
    if (this && this.pd) {
      var a = this.pd;a && "SCRIPT" == a.tagName && Sd(a, !0, this.ub);
    }
  },
      Sd = function Sd(a, b, c) {
    null != c && l.clearTimeout(c);a.onload = ba;a.onerror = ba;a.onreadystatechange = ba;b && window.setTimeout(function () {
      a && a.parentNode && a.parentNode.removeChild(a);
    }, 0);
  },
      Td = function Td(a, b) {
    var c = "Jsloader error (code #" + a + ")";b && (c += ": " + b);t.call(this, c);this.code = a;
  };r(Td, t);var Wd = function Wd() {
    Kb.call(this);this.V = new Rb(this);this.Hd = this;this.vc = null;
  };r(Wd, Kb);Wd.prototype[Nb] = !0;h = Wd.prototype;h.addEventListener = function (a, b, c, d) {
    Xb(this, a, b, c, d);
  };h.removeEventListener = function (a, b, c, d) {
    fc(this, a, b, c, d);
  };
  h.dispatchEvent = function (a) {
    Xd(this);var b,
        c = this.vc;if (c) {
      b = [];for (var d = 1; c; c = c.vc) {
        b.push(c), v(1E3 > ++d, "infinite loop");
      }
    }c = this.Hd;d = a.type || a;if (m(a)) a = new Lb(a, c);else if (a instanceof Lb) a.target = a.target || c;else {
      var e = a;a = new Lb(d, c);Za(a, e);
    }var e = !0,
        f;if (b) for (var g = b.length - 1; !a.Ta && 0 <= g; g--) {
      f = a.currentTarget = b[g], e = Yd(f, d, !0, a) && e;
    }a.Ta || (f = a.currentTarget = c, e = Yd(f, d, !0, a) && e, a.Ta || (e = Yd(f, d, !1, a) && e));if (b) for (g = 0; !a.Ta && g < b.length; g++) {
      f = a.currentTarget = b[g], e = Yd(f, d, !1, a) && e;
    }return e;
  };
  h.Ka = function () {
    Wd.Ic.Ka.call(this);if (this.V) {
      var a = this.V,
          b = 0,
          c;for (c in a.v) {
        for (var d = a.v[c], e = 0; e < d.length; e++) {
          ++b, Qb(d[e]);
        }delete a.v[c];a.vb--;
      }
    }this.vc = null;
  };h.listen = function (a, b, c, d) {
    Xd(this);return this.V.add(String(a), b, !1, c, d);
  };
  var ec = function ec(a, b, c, d, e) {
    a.V.add(String(b), c, !0, d, e);
  },
      Yd = function Yd(a, b, c, d) {
    b = a.V.v[String(b)];if (!b) return !0;b = b.concat();for (var e = !0, f = 0; f < b.length; ++f) {
      var g = b[f];if (g && !g.Xa && g.xb == c) {
        var k = g.listener,
            p = g.Gb || g.src;g.wb && Tb(a.V, g);e = !1 !== k.call(p, d) && e;
      }
    }return e && 0 != d.od;
  };Wd.prototype.mc = function (a, b, c, d) {
    return this.V.mc(String(a), b, c, d);
  };var Xd = function Xd(a) {
    v(a.V, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
  };var Zd = "StopIteration" in l ? l.StopIteration : { message: "StopIteration", stack: "" },
      $d = function $d() {};$d.prototype.next = function () {
    throw Zd;
  };$d.prototype.Gd = function () {
    return this;
  };var ae = function ae(a, b) {
    this.W = {};this.m = [];this.ha = this.i = 0;var c = arguments.length;if (1 < c) {
      if (c % 2) throw Error("Uneven number of arguments");for (var d = 0; d < c; d += 2) {
        this.set(arguments[d], arguments[d + 1]);
      }
    } else a && this.addAll(a);
  };h = ae.prototype;h.Wc = function () {
    return this.i;
  };h.R = function () {
    be(this);for (var a = [], b = 0; b < this.m.length; b++) {
      a.push(this.W[this.m[b]]);
    }return a;
  };h.ca = function () {
    be(this);return this.m.concat();
  };h.gb = function (a) {
    return ce(this.W, a);
  };
  h.Ab = function (a, b) {
    if (this === a) return !0;if (this.i != a.Wc()) return !1;var c = b || de;be(this);for (var d, e = 0; d = this.m[e]; e++) {
      if (!c(this.get(d), a.get(d))) return !1;
    }return !0;
  };var de = function de(a, b) {
    return a === b;
  };ae.prototype.remove = function (a) {
    return ce(this.W, a) ? (delete this.W[a], this.i--, this.ha++, this.m.length > 2 * this.i && be(this), !0) : !1;
  };
  var be = function be(a) {
    if (a.i != a.m.length) {
      for (var b = 0, c = 0; b < a.m.length;) {
        var d = a.m[b];ce(a.W, d) && (a.m[c++] = d);b++;
      }a.m.length = c;
    }if (a.i != a.m.length) {
      for (var e = {}, c = b = 0; b < a.m.length;) {
        d = a.m[b], ce(e, d) || (a.m[c++] = d, e[d] = 1), b++;
      }a.m.length = c;
    }
  };h = ae.prototype;h.get = function (a, b) {
    return ce(this.W, a) ? this.W[a] : b;
  };h.set = function (a, b) {
    ce(this.W, a) || (this.i++, this.m.push(a), this.ha++);this.W[a] = b;
  };
  h.addAll = function (a) {
    var b;a instanceof ae ? (b = a.ca(), a = a.R()) : (b = Sa(a), a = Ra(a));for (var c = 0; c < b.length; c++) {
      this.set(b[c], a[c]);
    }
  };h.forEach = function (a, b) {
    for (var c = this.ca(), d = 0; d < c.length; d++) {
      var e = c[d],
          f = this.get(e);a.call(b, f, e, this);
    }
  };h.clone = function () {
    return new ae(this);
  };h.Gd = function (a) {
    be(this);var b = 0,
        c = this.ha,
        d = this,
        e = new $d();e.next = function () {
      if (c != d.ha) throw Error("The map has changed since the iterator was created");if (b >= d.m.length) throw Zd;var e = d.m[b++];return a ? e : d.W[e];
    };return e;
  };
  var ce = function ce(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  };var ee = function ee(a) {
    if (a.R && "function" == typeof a.R) return a.R();if (m(a)) return a.split("");if (fa(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++) {
        b.push(a[d]);
      }return b;
    }return Ra(a);
  },
      fe = function fe(a) {
    if (a.ca && "function" == typeof a.ca) return a.ca();if (!a.R || "function" != typeof a.R) {
      if (fa(a) || m(a)) {
        var b = [];a = a.length;for (var c = 0; c < a; c++) {
          b.push(c);
        }return b;
      }return Sa(a);
    }
  },
      ge = function ge(a, b) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, void 0);else if (fa(a) || m(a)) w(a, b, void 0);else for (var c = fe(a), d = ee(a), e = d.length, f = 0; f < e; f++) {
      b.call(void 0, d[f], c && c[f], a);
    }
  };var he = function he(a, b, c, d, e) {
    this.reset(a, b, c, d, e);
  };he.prototype.Tc = null;var ie = 0;he.prototype.reset = function (a, b, c, d, e) {
    "number" == typeof e || ie++;d || la();this.ob = a;this.le = b;delete this.Tc;
  };he.prototype.sd = function (a) {
    this.ob = a;
  };var je = function je(a) {
    this.me = a;this.Zc = this.gc = this.ob = this.l = null;
  },
      ke = function ke(a, b) {
    this.name = a;this.value = b;
  };ke.prototype.toString = function () {
    return this.name;
  };var le = new ke("SEVERE", 1E3),
      me = new ke("CONFIG", 700),
      ne = new ke("FINE", 500);je.prototype.getParent = function () {
    return this.l;
  };je.prototype.sd = function (a) {
    this.ob = a;
  };var oe = function oe(a) {
    if (a.ob) return a.ob;if (a.l) return oe(a.l);ya("Root logger has no level set.");return null;
  };
  je.prototype.log = function (a, b, c) {
    if (a.value >= oe(this).value) for (n(b) && (b = b()), a = new he(a, String(b), this.me), c && (a.Tc = c), c = "log:" + a.le, l.console && (l.console.timeStamp ? l.console.timeStamp(c) : l.console.markTimeline && l.console.markTimeline(c)), l.msWriteProfilerMark && l.msWriteProfilerMark(c), c = this; c;) {
      b = c;var d = a;if (b.Zc) for (var e = 0, f; f = b.Zc[e]; e++) {
        f(d);
      }c = c.getParent();
    }
  };
  var pe = {},
      qe = null,
      re = function re(a) {
    qe || (qe = new je(""), pe[""] = qe, qe.sd(me));var b;if (!(b = pe[a])) {
      b = new je(a);var c = a.lastIndexOf("."),
          d = a.substr(c + 1),
          c = re(a.substr(0, c));c.gc || (c.gc = {});c.gc[d] = b;b.l = c;pe[a] = b;
    }return b;
  };var K = function K(a, b) {
    a && a.log(ne, b, void 0);
  };var se = function se(a, b, c) {
    if (n(a)) c && (a = _q2(a, c));else if (a && "function" == typeof a.handleEvent) a = _q2(a.handleEvent, a);else throw Error("Invalid listener argument");return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
  },
      te = function te(a) {
    var b = null;return new H(function (c, d) {
      b = se(function () {
        c(void 0);
      }, a);-1 == b && d(Error("Failed to schedule timer."));
    }).F(function (a) {
      l.clearTimeout(b);throw a;
    });
  };var ue = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/,
      ve = function ve(a, b) {
    if (a) for (var c = a.split("&"), d = 0; d < c.length; d++) {
      var e = c[d].indexOf("="),
          f,
          g = null;0 <= e ? (f = c[d].substring(0, e), g = c[d].substring(e + 1)) : f = c[d];b(f, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "");
    }
  };var L = function L(a) {
    Wd.call(this);this.headers = new ae();this.cc = a || null;this.ja = !1;this.bc = this.a = null;this.nb = this.dd = this.Jb = "";this.ya = this.qc = this.Ib = this.jc = !1;this.ab = 0;this.Yb = null;this.nd = "";this.$b = this.te = this.yd = !1;
  };r(L, Wd);var we = L.prototype,
      xe = re("goog.net.XhrIo");we.N = xe;var ye = /^https?$/i,
      ze = ["POST", "PUT"];
  L.prototype.send = function (a, b, c, d) {
    if (this.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.Jb + "; newUri=" + a);b = b ? b.toUpperCase() : "GET";this.Jb = a;this.nb = "";this.dd = b;this.jc = !1;this.ja = !0;this.a = this.cc ? this.cc.yb() : uc.yb();this.bc = this.cc ? tc(this.cc) : tc(uc);this.a.onreadystatechange = _q2(this.kd, this);this.te && "onprogress" in this.a && (this.a.onprogress = _q2(function (a) {
      this.jd(a, !0);
    }, this), this.a.upload && (this.a.upload.onprogress = _q2(this.jd, this)));try {
      K(this.N, Ae(this, "Opening Xhr")), this.qc = !0, this.a.open(b, String(a), !0), this.qc = !1;
    } catch (f) {
      K(this.N, Ae(this, "Error opening Xhr: " + f.message));this.I(5, f);return;
    }a = c || "";var e = this.headers.clone();d && ge(d, function (a, b) {
      e.set(b, a);
    });d = Ha(e.ca());c = l.FormData && a instanceof l.FormData;!Ia(ze, b) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");e.forEach(function (a, b) {
      this.a.setRequestHeader(b, a);
    }, this);this.nd && (this.a.responseType = this.nd);"withCredentials" in this.a && this.a.withCredentials !== this.yd && (this.a.withCredentials = this.yd);try {
      Be(this), 0 < this.ab && (this.$b = Ce(this.a), K(this.N, Ae(this, "Will abort after " + this.ab + "ms if incomplete, xhr2 " + this.$b)), this.$b ? (this.a.timeout = this.ab, this.a.ontimeout = _q2(this.ub, this)) : this.Yb = se(this.ub, this.ab, this)), K(this.N, Ae(this, "Sending request")), this.Ib = !0, this.a.send(a), this.Ib = !1;
    } catch (f) {
      K(this.N, Ae(this, "Send error: " + f.message)), this.I(5, f);
    }
  };var Ce = function Ce(a) {
    return y && z(9) && ga(a.timeout) && void 0 !== a.ontimeout;
  },
      Ga = function Ga(a) {
    return "content-type" == a.toLowerCase();
  };
  L.prototype.ub = function () {
    "undefined" != typeof aa && this.a && (this.nb = "Timed out after " + this.ab + "ms, aborting", K(this.N, Ae(this, this.nb)), this.dispatchEvent("timeout"), this.abort(8));
  };L.prototype.I = function (a, b) {
    this.ja = !1;this.a && (this.ya = !0, this.a.abort(), this.ya = !1);this.nb = b;De(this);Ee(this);
  };var De = function De(a) {
    a.jc || (a.jc = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"));
  };
  L.prototype.abort = function () {
    this.a && this.ja && (K(this.N, Ae(this, "Aborting")), this.ja = !1, this.ya = !0, this.a.abort(), this.ya = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), Ee(this));
  };L.prototype.Ka = function () {
    this.a && (this.ja && (this.ja = !1, this.ya = !0, this.a.abort(), this.ya = !1), Ee(this, !0));L.Ic.Ka.call(this);
  };L.prototype.kd = function () {
    this.isDisposed() || (this.qc || this.Ib || this.ya ? Fe(this) : this.re());
  };L.prototype.re = function () {
    Fe(this);
  };
  var Fe = function Fe(a) {
    if (a.ja && "undefined" != typeof aa) if (a.bc[1] && 4 == Ge(a) && 2 == He(a)) K(a.N, Ae(a, "Local request error detected and ignored"));else if (a.Ib && 4 == Ge(a)) se(a.kd, 0, a);else if (a.dispatchEvent("readystatechange"), 4 == Ge(a)) {
      K(a.N, Ae(a, "Request complete"));a.ja = !1;try {
        var b = He(a),
            c;a: switch (b) {case 200:case 201:case 202:case 204:case 206:case 304:case 1223:
            c = !0;break a;default:
            c = !1;}var d;if (!(d = c)) {
          var e;if (e = 0 === b) {
            var f = String(a.Jb).match(ue)[1] || null;if (!f && l.self && l.self.location) var g = l.self.location.protocol,
                f = g.substr(0, g.length - 1);e = !ye.test(f ? f.toLowerCase() : "");
          }d = e;
        }if (d) a.dispatchEvent("complete"), a.dispatchEvent("success");else {
          var k;try {
            k = 2 < Ge(a) ? a.a.statusText : "";
          } catch (p) {
            K(a.N, "Can not get status: " + p.message), k = "";
          }a.nb = k + " [" + He(a) + "]";De(a);
        }
      } finally {
        Ee(a);
      }
    }
  };L.prototype.jd = function (a, b) {
    v("progress" === a.type, "goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");this.dispatchEvent(Ie(a, "progress"));this.dispatchEvent(Ie(a, b ? "downloadprogress" : "uploadprogress"));
  };
  var Ie = function Ie(a, b) {
    return { type: b, lengthComputable: a.lengthComputable, loaded: a.loaded, total: a.total };
  },
      Ee = function Ee(a, b) {
    if (a.a) {
      Be(a);var c = a.a,
          d = a.bc[0] ? ba : null;a.a = null;a.bc = null;b || a.dispatchEvent("ready");try {
        c.onreadystatechange = d;
      } catch (e) {
        (c = a.N) && c.log(le, "Problem encountered resetting onreadystatechange: " + e.message, void 0);
      }
    }
  },
      Be = function Be(a) {
    a.a && a.$b && (a.a.ontimeout = null);ga(a.Yb) && (l.clearTimeout(a.Yb), a.Yb = null);
  },
      Ge = function Ge(a) {
    return a.a ? a.a.readyState : 0;
  },
      He = function He(a) {
    try {
      return 2 < Ge(a) ? a.a.status : -1;
    } catch (b) {
      return -1;
    }
  },
      Je = function Je(a) {
    try {
      return a.a ? a.a.responseText : "";
    } catch (b) {
      return K(a.N, "Can not get responseText: " + b.message), "";
    }
  },
      Ae = function Ae(a, b) {
    return b + " [" + a.dd + " " + a.Jb + " " + He(a) + "]";
  };var Ke = function Ke(a, b) {
    this.ka = this.Ga = this.pa = "";this.Sa = null;this.xa = this.ma = "";this.K = this.ie = !1;var c;if (a instanceof Ke) this.K = void 0 !== b ? b : a.K, Le(this, a.pa), c = a.Ga, M(this), this.Ga = c, Me(this, a.ka), Ne(this, a.Sa), Oe(this, a.ma), Pe(this, a.Y.clone()), c = a.xa, M(this), this.xa = c;else if (a && (c = String(a).match(ue))) {
      this.K = !!b;Le(this, c[1] || "", !0);var d = c[2] || "";M(this);this.Ga = Qe(d);Me(this, c[3] || "", !0);Ne(this, c[4]);Oe(this, c[5] || "", !0);Pe(this, c[6] || "", !0);c = c[7] || "";M(this);this.xa = Qe(c);
    } else this.K = !!b, this.Y = new N(null, 0, this.K);
  };Ke.prototype.toString = function () {
    var a = [],
        b = this.pa;b && a.push(Re(b, Se, !0), ":");var c = this.ka;if (c || "file" == b) a.push("//"), (b = this.Ga) && a.push(Re(b, Se, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.Sa, null != c && a.push(":", String(c));if (c = this.ma) this.ka && "/" != c.charAt(0) && a.push("/"), a.push(Re(c, "/" == c.charAt(0) ? Te : Ue, !0));(c = this.Y.toString()) && a.push("?", c);(c = this.xa) && a.push("#", Re(c, Ve));return a.join("");
  };
  Ke.prototype.resolve = function (a) {
    var b = this.clone(),
        c = !!a.pa;c ? Le(b, a.pa) : c = !!a.Ga;if (c) {
      var d = a.Ga;M(b);b.Ga = d;
    } else c = !!a.ka;c ? Me(b, a.ka) : c = null != a.Sa;d = a.ma;if (c) Ne(b, a.Sa);else if (c = !!a.ma) {
      if ("/" != d.charAt(0)) if (this.ka && !this.ma) d = "/" + d;else {
        var e = b.ma.lastIndexOf("/");-1 != e && (d = b.ma.substr(0, e + 1) + d);
      }e = d;if (".." == e || "." == e) d = "";else if (u(e, "./") || u(e, "/.")) {
        for (var d = 0 == e.lastIndexOf("/", 0), e = e.split("/"), f = [], g = 0; g < e.length;) {
          var k = e[g++];"." == k ? d && g == e.length && f.push("") : ".." == k ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(), d && g == e.length && f.push("")) : (f.push(k), d = !0);
        }d = f.join("/");
      } else d = e;
    }c ? Oe(b, d) : c = "" !== a.Y.toString();c ? Pe(b, Qe(a.Y.toString())) : c = !!a.xa;c && (a = a.xa, M(b), b.xa = a);return b;
  };Ke.prototype.clone = function () {
    return new Ke(this);
  };
  var Le = function Le(a, b, c) {
    M(a);a.pa = c ? Qe(b, !0) : b;a.pa && (a.pa = a.pa.replace(/:$/, ""));
  },
      Me = function Me(a, b, c) {
    M(a);a.ka = c ? Qe(b, !0) : b;
  },
      Ne = function Ne(a, b) {
    M(a);if (b) {
      b = Number(b);if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);a.Sa = b;
    } else a.Sa = null;
  },
      Oe = function Oe(a, b, c) {
    M(a);a.ma = c ? Qe(b, !0) : b;
  },
      Pe = function Pe(a, b, c) {
    M(a);b instanceof N ? (a.Y = b, a.Y.Fc(a.K)) : (c || (b = Re(b, We)), a.Y = new N(b, 0, a.K));
  },
      O = function O(a, b, c) {
    M(a);a.Y.set(b, c);
  },
      M = function M(a) {
    if (a.ie) throw Error("Tried to modify a read-only Uri");
  };
  Ke.prototype.Fc = function (a) {
    this.K = a;this.Y && this.Y.Fc(a);return this;
  };
  var Xe = function Xe(a, b) {
    var c = new Ke(null, void 0);Le(c, "https");a && Me(c, a);b && Oe(c, b);return c;
  },
      Qe = function Qe(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  },
      Re = function Re(a, b, c) {
    return m(a) ? (a = encodeURI(a).replace(b, Ye), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  },
      Ye = function Ye(a) {
    a = a.charCodeAt(0);return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  },
      Se = /[#\/\?@]/g,
      Ue = /[\#\?:]/g,
      Te = /[\#\?]/g,
      We = /[\#\?@]/g,
      Ve = /#/g,
      N = function N(a, b, c) {
    this.i = this.j = null;this.H = a || null;
    this.K = !!c;
  },
      Ze = function Ze(a) {
    a.j || (a.j = new ae(), a.i = 0, a.H && ve(a.H, function (b, c) {
      a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
  },
      af = function af(a) {
    var b = fe(a);if ("undefined" == typeof b) throw Error("Keys are undefined");var c = new N(null, 0, void 0);a = ee(a);for (var d = 0; d < b.length; d++) {
      var e = b[d],
          f = a[d];ea(f) ? $e(c, e, f) : c.add(e, f);
    }return c;
  };h = N.prototype;h.Wc = function () {
    Ze(this);return this.i;
  };
  h.add = function (a, b) {
    Ze(this);this.H = null;a = this.J(a);var c = this.j.get(a);c || this.j.set(a, c = []);c.push(b);this.i = za(this.i) + 1;return this;
  };h.remove = function (a) {
    Ze(this);a = this.J(a);return this.j.gb(a) ? (this.H = null, this.i = za(this.i) - this.j.get(a).length, this.j.remove(a)) : !1;
  };h.gb = function (a) {
    Ze(this);a = this.J(a);return this.j.gb(a);
  };h.ca = function () {
    Ze(this);for (var a = this.j.R(), b = this.j.ca(), c = [], d = 0; d < b.length; d++) {
      for (var e = a[d], f = 0; f < e.length; f++) {
        c.push(b[d]);
      }
    }return c;
  };
  h.R = function (a) {
    Ze(this);var b = [];if (m(a)) this.gb(a) && (b = Ma(b, this.j.get(this.J(a))));else {
      a = this.j.R();for (var c = 0; c < a.length; c++) {
        b = Ma(b, a[c]);
      }
    }return b;
  };h.set = function (a, b) {
    Ze(this);this.H = null;a = this.J(a);this.gb(a) && (this.i = za(this.i) - this.j.get(a).length);this.j.set(a, [b]);this.i = za(this.i) + 1;return this;
  };h.get = function (a, b) {
    var c = a ? this.R(a) : [];return 0 < c.length ? String(c[0]) : b;
  };var $e = function $e(a, b, c) {
    a.remove(b);0 < c.length && (a.H = null, a.j.set(a.J(b), Oa(c)), a.i = za(a.i) + c.length);
  };
  N.prototype.toString = function () {
    if (this.H) return this.H;if (!this.j) return "";for (var a = [], b = this.j.ca(), c = 0; c < b.length; c++) {
      for (var d = b[c], e = encodeURIComponent(String(d)), d = this.R(d), f = 0; f < d.length; f++) {
        var g = e;"" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));a.push(g);
      }
    }return this.H = a.join("&");
  };N.prototype.clone = function () {
    var a = new N();a.H = this.H;this.j && (a.j = this.j.clone(), a.i = this.i);return a;
  };N.prototype.J = function (a) {
    a = String(a);this.K && (a = a.toLowerCase());return a;
  };
  N.prototype.Fc = function (a) {
    a && !this.K && (Ze(this), this.H = null, this.j.forEach(function (a, c) {
      var d = c.toLowerCase();c != d && (this.remove(c), $e(this, d, a));
    }, this));this.K = a;
  };var bf = function bf() {
    return l.window && l.window.location.href || "";
  },
      cf = function cf(a, b) {
    var c = [],
        d;for (d in a) {
      d in b ? _typeof(a[d]) != _typeof(b[d]) ? c.push(d) : ea(a[d]) ? Ua(a[d], b[d]) || c.push(d) : "object" == _typeof(a[d]) && null != a[d] && null != b[d] ? 0 < cf(a[d], b[d]).length && c.push(d) : a[d] !== b[d] && c.push(d) : c.push(d);
    }for (d in b) {
      d in a || c.push(d);
    }return c;
  },
      ff = function ff() {
    var a;a = df();a = "Chrome" != ef(a) ? null : (a = a.match(/\sChrome\/(\d+)/i)) && 2 == a.length ? parseInt(a[1], 10) : null;return a && 30 > a ? !1 : !y || !pb || 9 < pb;
  },
      gf = function gf(a) {
    (a || l.window).close();
  },
      hf = function hf(a, b, c) {
    var d = Math.floor(1E9 * Math.random()).toString();b = b || 500;c = c || 600;var e = (window.screen.availHeight - c) / 2,
        f = (window.screen.availWidth - b) / 2;b = { width: b, height: c, top: 0 < e ? e : 0, left: 0 < f ? f : 0, location: !0, resizable: !0, statusbar: !0, toolbar: !1 };d && (b.target = d);"Firefox" == ef(df()) && (a = a || "http://localhost", b.scrollbars = !0);var g;c = a || "about:blank";(d = b) || (d = {});a = window;b = c instanceof A ? c : Cb("undefined" != typeof c.href ? c.href : String(c));c = d.target || c.target;e = [];for (g in d) {
      switch (g) {case "width":case "height":case "top":case "left":
          e.push(g + "=" + d[g]);break;case "target":case "noreferrer":
          break;default:
          e.push(g + "=" + (d[g] ? 1 : 0));}
    }g = e.join(",");(x("iPhone") && !x("iPod") && !x("iPad") || x("iPad") || x("iPod")) && a.navigator && a.navigator.standalone && c && "_self" != c ? (g = a.document.createElement("A"), b = b instanceof A ? b : Cb(b), g.href = zb(b), g.setAttribute("target", c), d.noreferrer && g.setAttribute("rel", "noreferrer"), d = document.createEvent("MouseEvent"), d.initMouseEvent("click", !0, !0, a, 1), g.dispatchEvent(d), g = {}) : d.noreferrer ? (g = a.open("", c, g), d = zb(b), g && (eb && u(d, ";") && (d = "'" + d.replace(/'/g, "%27") + "'"), g.opener = null, a = new wb(), a.Wb = "b/12014412, meta tag with sanitized URL", ua.test(d) && (-1 != d.indexOf("&") && (d = d.replace(oa, "&amp;")), -1 != d.indexOf("<") && (d = d.replace(pa, "&lt;")), -1 != d.indexOf(">") && (d = d.replace(qa, "&gt;")), -1 != d.indexOf('"') && (d = d.replace(ra, "&quot;")), -1 != d.indexOf("'") && (d = d.replace(sa, "&#39;")), -1 != d.indexOf("\x00") && (d = d.replace(ta, "&#0;"))), d = '<META HTTP-EQUIV="refresh" content="0; url=' + d + '">', Aa(xb(a), "must provide justification"), v(!/^[\s\xa0]*$/.test(xb(a)), "must provide non-empty justification"), g.document.write(Fb(new Eb().he(d))), g.document.close())) : g = a.open(zb(b), c, g);if (g) try {
      g.focus();
    } catch (k) {}return g;
  },
      jf = function jf(a) {
    return new H(function (b) {
      var c = function c() {
        te(2E3).then(function () {
          if (!a || a.closed) b();else return c();
        });
      };return c();
    });
  },
      kf = function kf() {
    var a = null;return new H(function (b) {
      "complete" == l.document.readyState ? b() : (a = function a() {
        b();
      }, dc(window, "load", a));
    }).F(function (b) {
      fc(window, "load", a);throw b;
    });
  },
      lf = function lf(a) {
    switch (a || l.navigator && l.navigator.product || "") {case "ReactNative":
        return "ReactNative";default:
        return "undefined" !== typeof l.process ? "Node" : "Browser";}
  },
      mf = function mf() {
    var a = lf();return "ReactNative" === a || "Node" === a;
  },
      ef = function ef(a) {
    var b = a.toLowerCase();if (u(b, "opera/") || u(b, "opr/") || u(b, "opios/")) return "Opera";if (u(b, "iemobile")) return "IEMobile";if (u(b, "msie") || u(b, "trident/")) return "IE";if (u(b, "edge/")) return "Edge";if (u(b, "firefox/")) return "Firefox";if (u(b, "silk/")) return "Silk";if (u(b, "blackberry")) return "Blackberry";if (u(b, "webos")) return "Webos";if (!u(b, "safari/") || u(b, "chrome/") || u(b, "crios/") || u(b, "android")) {
      if (!u(b, "chrome/") && !u(b, "crios/") || u(b, "edge/")) {
        if (u(b, "android")) return "Android";if ((a = a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/)) && 2 == a.length) return a[1];
      } else return "Chrome";
    } else return "Safari";return "Other";
  },
      nf = function nf(a) {
    var b = lf(void 0);return ("Browser" === b ? ef(df()) : b) + "/JsCore/" + a;
  },
      df = function df() {
    return l.navigator && l.navigator.userAgent || "";
  },
      of = function of(a) {
    a = a.split(".");for (var b = l, c = 0; c < a.length && "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && null != b; c++) {
      b = b[a[c]];
    }c != a.length && (b = void 0);return b;
  },
      qf = function qf() {
    var a;if (!(a = !l.location || !l.location.protocol || "http:" != l.location.protocol && "https:" != l.location.protocol || mf())) {
      var b;a: {
        try {
          var c = l.localStorage,
              d = pf();if (c) {
            c.setItem(d, "1");c.removeItem(d);b = !0;break a;
          }
        } catch (e) {}b = !1;
      }a = !b;
    }return !a;
  },
      rf = function rf(a) {
    a = a || df();var b = (a || df()).toLowerCase();return b.match(/android/) || b.match(/webos/) || b.match(/iphone|ipad|ipod/) || b.match(/blackberry/) || b.match(/windows phone/) || b.match(/iemobile/) || "Firefox" == ef(a) ? !1 : !0;
  },
      sf = function sf(a) {
    return "undefined" === typeof a ? null : oc(a);
  },
      tf = function tf(a) {
    if (null !== a) {
      var b;try {
        b = lc(a);
      } catch (c) {
        try {
          b = JSON.parse(a);
        } catch (d) {
          throw c;
        }
      }return b;
    }
  },
      pf = function pf(a) {
    return a ? a : "" + Math.floor(1E9 * Math.random()).toString();
  };var uf;try {
    var vf = {};Object.defineProperty(vf, "abcd", { configurable: !0, enumerable: !0, value: 1 });Object.defineProperty(vf, "abcd", { configurable: !0, enumerable: !0, value: 2 });uf = 2 == vf.abcd;
  } catch (a) {
    uf = !1;
  }
  var P = function P(a, b, c) {
    uf ? Object.defineProperty(a, b, { configurable: !0, enumerable: !0, value: c }) : a[b] = c;
  },
      wf = function wf(a, b) {
    if (b) for (var c in b) {
      b.hasOwnProperty(c) && P(a, c, b[c]);
    }
  },
      xf = function xf(a) {
    var b = {},
        c;for (c in a) {
      a.hasOwnProperty(c) && (b[c] = a[c]);
    }return b;
  },
      yf = function yf(a, b) {
    if (!b || !b.length) return !0;if (!a) return !1;for (var c = 0; c < b.length; c++) {
      var d = a[b[c]];if (void 0 === d || null === d || "" === d) return !1;
    }return !0;
  };var zf = { zd: { rb: 985, qb: 735, providerId: "facebook.com" }, Ad: { rb: 500, qb: 620, providerId: "github.com" }, Bd: { rb: 515, qb: 680, providerId: "google.com" }, Fd: { rb: 485, qb: 705, providerId: "twitter.com" } },
      Af = function Af(a) {
    for (var b in zf) {
      if (zf[b].providerId == a) return zf[b];
    }return null;
  };var Q = function Q(a, b) {
    this.code = "auth/" + a;this.message = b || Bf[a] || "";
  };r(Q, Error);Q.prototype.G = function () {
    return { name: this.code, code: this.code, message: this.message };
  };
  var Bf = { "argument-error": "", "app-not-authorized": "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.", "cors-unsupported": "This browser is not supported.", "credential-already-in-use": "This credential is already associated with a different user account.", "custom-token-mismatch": "The custom token corresponds to a different audience.", "requires-recent-login": "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
    "email-already-in-use": "The email address is already in use by another account.", "expired-action-code": "The action code has expired. ", "cancelled-popup-request": "This operation has been cancelled due to another conflicting popup being opened.", "internal-error": "An internal error has occurred.", "invalid-user-token": "The user's credential is no longer valid. The user must sign in again.", "invalid-auth-event": "An internal error has occurred.", "invalid-custom-token": "The custom token format is incorrect. Please check the documentation.",
    "invalid-email": "The email address is badly formatted.", "invalid-api-key": "Your API key is invalid, please check you have copied it correctly.", "invalid-credential": "The supplied auth credential is malformed or has expired.", "invalid-oauth-provider": "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.", "unauthorized-domain": "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
    "invalid-action-code": "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.", "wrong-password": "The password is invalid or the user does not have a password.", "missing-iframe-start": "An internal error has occurred.", "auth-domain-config-required": "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.", "app-deleted": "This instance of FirebaseApp has been deleted.", "account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
    "network-request-failed": "A network error (such as timeout, interrupted connection or unreachable host) has occurred.", "no-auth-event": "An internal error has occurred.", "no-such-provider": "User was not linked to an account with the given provider.", "operation-not-allowed": "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.", "operation-not-supported-in-this-environment": 'This operation is not supported in the environment this application is running on. "location.protocol" must be http or https and web storage must be enabled.',
    "popup-blocked": "Unable to establish a connection with the popup. It may have been blocked by the browser.", "popup-closed-by-user": "The popup has been closed by the user before finalizing the operation.", "provider-already-linked": "User can only be linked to one identity for the given provider.", timeout: "The operation has timed out.", "user-token-expired": "The user's credential is no longer valid. The user must sign in again.", "too-many-requests": "We have blocked all requests from this device due to unusual activity. Try again later.",
    "user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.", "user-disabled": "The user account has been disabled by an administrator.", "user-mismatch": "The supplied credentials do not correspond to the previously signed in user.", "user-signed-out": "", "weak-password": "The password must be 6 characters long or more.", "web-storage-unsupported": "This browser is not supported." };var Cf = function Cf(a, b, c, d, e) {
    this.ra = a;this.wa = b || null;this.cb = c || null;this.Tb = d || null;this.I = e || null;if (this.cb || this.I) {
      if (this.cb && this.I) throw new Q("invalid-auth-event");if (this.cb && !this.Tb) throw new Q("invalid-auth-event");
    } else throw new Q("invalid-auth-event");
  };Cf.prototype.getError = function () {
    return this.I;
  };Cf.prototype.G = function () {
    return { type: this.ra, eventId: this.wa, urlResponse: this.cb, sessionId: this.Tb, error: this.I && this.I.G() };
  };var Df = function Df(a) {
    this.ke = a.sub;la();this.zb = a.email || null;
  };var Ef = function Ef(a, b, c, d) {
    var e = {};ha(c) ? e = c : b && m(c) && m(d) ? e = { oauthToken: c, oauthTokenSecret: d } : !b && m(c) && (e = { accessToken: c });if (b || !e.idToken && !e.accessToken) {
      if (b && e.oauthToken && e.oauthTokenSecret) P(this, "accessToken", e.oauthToken), P(this, "secret", e.oauthTokenSecret);else {
        if (b) throw new Q("argument-error", "credential failed: expected 2 arguments (the OAuth access token and secret).");throw new Q("argument-error", "credential failed: expected 1 argument (the OAuth access token).");
      }
    } else e.idToken && P(this, "idToken", e.idToken), e.accessToken && P(this, "accessToken", e.accessToken);P(this, "provider", a);
  };Ef.prototype.Db = function (a) {
    return Ff(a, Gf(this));
  };Ef.prototype.ed = function (a, b) {
    var c = Gf(this);c.idToken = b;return R(a, Hf, c);
  };var Gf = function Gf(a) {
    var b = {};a.idToken && (b.id_token = a.idToken);a.accessToken && (b.access_token = a.accessToken);a.secret && (b.oauth_token_secret = a.secret);b.providerId = a.provider;return { postBody: af(b).toString(), requestUri: qf() ? bf() : "http://localhost" };
  };
  Ef.prototype.G = function () {
    var a = { provider: this.provider };this.idToken && (a.oauthIdToken = this.idToken);this.accessToken && (a.oauthAccessToken = this.accessToken);this.secret && (a.oauthTokenSecret = this.secret);return a;
  };
  var If = function If(a, b) {
    var c = !!b,
        d = function d() {
      wf(this, { providerId: a, isOAuthProvider: !0 });this.Ec = [];"google.com" == a && this.addScope("profile");
    };c || (d.prototype.addScope = function (a) {
      Ia(this.Ec, a) || this.Ec.push(a);
    });d.prototype.Eb = function () {
      return Oa(this.Ec);
    };d.credential = function (b, d) {
      return new Ef(a, c, b, d);
    };wf(d, { PROVIDER_ID: a });return d;
  },
      Jf = If("facebook.com");Jf.prototype.addScope = Jf.prototype.addScope || void 0;var Kf = If("github.com");Kf.prototype.addScope = Kf.prototype.addScope || void 0;var Lf = If("google.com");
  Lf.prototype.addScope = Lf.prototype.addScope || void 0;Lf.credential = function (a, b) {
    if (!a && !b) throw new Q("argument-error", "credential failed: must provide the ID token and/or the access token.");return new Ef("google.com", !1, ha(a) ? a : { idToken: a || null, accessToken: b || null });
  };var Mf = If("twitter.com", !0),
      Nf = function Nf(a, b) {
    this.zb = a;this.wc = b;P(this, "provider", "password");
  };Nf.prototype.Db = function (a) {
    return R(a, Of, { email: this.zb, password: this.wc });
  };
  Nf.prototype.ed = function (a, b) {
    return R(a, Pf, { idToken: b, email: this.zb, password: this.wc });
  };Nf.prototype.G = function () {
    return { email: this.zb, password: this.wc };
  };var Qf = function Qf() {
    wf(this, { providerId: "password", isOAuthProvider: !1 });
  };wf(Qf, { PROVIDER_ID: "password" });
  var Rf = { Je: Qf, zd: Jf, Bd: Lf, Ad: Kf, Fd: Mf },
      Sf = function Sf(a) {
    var b = a && a.providerId;if (!b) return null;var c = a && a.oauthAccessToken,
        d = a && a.oauthTokenSecret;a = a && a.oauthIdToken;for (var e in Rf) {
      if (Rf[e].PROVIDER_ID == b) try {
        return Rf[e].credential({ accessToken: c, idToken: a, oauthToken: c, oauthTokenSecret: d });
      } catch (f) {
        break;
      }
    }return null;
  };var Tf = function Tf(a, b, c) {
    Q.call(this, "account-exists-with-different-credential", c);P(this, "email", a);P(this, "credential", b);
  };r(Tf, Q);Tf.prototype.G = function () {
    var a = { code: this.code, message: this.message, email: this.email },
        b = this.credential && this.credential.G();b && (Za(a, b), a.providerId = b.provider, delete a.provider);return a;
  };var Uf = function Uf(a) {
    this.Ie = a;
  };r(Uf, sc);Uf.prototype.yb = function () {
    return new this.Ie();
  };Uf.prototype.sc = function () {
    return {};
  };
  var S = function S(a, b, c) {
    var d;d = "Node" == lf();d = l.XMLHttpRequest || d && firebase.INTERNAL.node && firebase.INTERNAL.node.XMLHttpRequest;if (!d) throw new Q("internal-error", "The XMLHttpRequest compatibility library was not found.");this.u = a;a = b || {};this.xe = a.secureTokenEndpoint || "https://securetoken.googleapis.com/v1/token";this.ye = a.secureTokenTimeout || 1E4;this.qd = Xa(a.secureTokenHeaders || Vf);this.Sd = a.firebaseEndpoint || "https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.Td = a.firebaseTimeout || 1E4;this.Vc = Xa(a.firebaseHeaders || Wf);c && (this.Vc["X-Client-Version"] = c, this.qd["X-Client-Version"] = c);this.Kd = new xc();this.He = new Uf(d);
  },
      Xf,
      Vf = { "Content-Type": "application/x-www-form-urlencoded" },
      Wf = { "Content-Type": "application/json" },
      Zf = function Zf(a, b, c, d, e, f, g) {
    ff() ? a = _q2(a.Ae, a) : (Xf || (Xf = new H(function (a, b) {
      Yf(a, b);
    })), a = _q2(a.ze, a));a(b, c, d, e, f, g);
  };
  S.prototype.Ae = function (a, b, c, d, e, f) {
    var g = "Node" == lf(),
        k = mf() ? g ? new L(this.He) : new L() : new L(this.Kd),
        p;f && (k.ab = Math.max(0, f), p = setTimeout(function () {
      k.dispatchEvent("timeout");
    }, f));k.listen("complete", function () {
      p && clearTimeout(p);var a = null;try {
        var c;c = this.a ? lc(this.a.responseText) : void 0;a = c || null;
      } catch (d) {
        try {
          a = JSON.parse(Je(this)) || null;
        } catch (e) {
          a = null;
        }
      }b && b(a);
    });ec(k, "ready", function () {
      p && clearTimeout(p);this.va || (this.va = !0, this.Ka());
    });ec(k, "timeout", function () {
      p && clearTimeout(p);this.va || (this.va = !0, this.Ka());b && b(null);
    });k.send(a, c, d, e);
  };var $f = "__fcb" + Math.floor(1E6 * Math.random()).toString(),
      Yf = function Yf(a, b) {
    ((window.gapi || {}).client || {}).request ? a() : (l[$f] = function () {
      ((window.gapi || {}).client || {}).request ? a() : b(Error("CORS_UNSUPPORTED"));
    }, Nd(Vd("https://apis.google.com/js/client.js?onload=" + $f), function () {
      b(Error("CORS_UNSUPPORTED"));
    }));
  };
  S.prototype.ze = function (a, b, c, d, e) {
    var f = this;Xf.then(function () {
      window.gapi.client.setApiKey(f.u);var g = window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({ path: a, method: c, body: d, headers: e, authType: "none", callback: function callback(a) {
          window.gapi.auth.setToken(g);b && b(a);
        } });
    }).F(function (a) {
      b && b({ error: { message: a && a.message || "CORS_UNSUPPORTED" } });
    });
  };
  var bg = function bg(a, b) {
    return new H(function (c, d) {
      "refresh_token" == b.grant_type && b.refresh_token || "authorization_code" == b.grant_type && b.code ? Zf(a, a.xe + "?key=" + encodeURIComponent(a.u), function (a) {
        a ? a.error ? d(ag(a)) : a.access_token && a.refresh_token ? c(a) : d(new Q("internal-error")) : d(new Q("network-request-failed"));
      }, "POST", af(b).toString(), a.qd, a.ye) : d(new Q("internal-error"));
    });
  },
      cg = function cg(a) {
    var b = {},
        c;for (c in a) {
      null !== a[c] && void 0 !== a[c] && (b[c] = a[c]);
    }return oc(b);
  },
      dg = function dg(a, b, c, d, e) {
    var f = a.Sd + b + "?key=" + encodeURIComponent(a.u);e && (f += "&cb=" + la().toString());return new H(function (b, e) {
      Zf(a, f, function (a) {
        a ? a.error ? e(ag(a)) : b(a) : e(new Q("network-request-failed"));
      }, c, cg(d), a.Vc, a.Td);
    });
  },
      eg = function eg(a) {
    if (!kc.test(a.email)) throw new Q("invalid-email");
  },
      fg = function fg(a) {
    "email" in a && eg(a);
  },
      hg = function hg(a, b) {
    var c = qf() ? bf() : "http://localhost";return R(a, gg, { identifier: b, continueUri: c }).then(function (a) {
      return a.allProviders || [];
    });
  },
      jg = function jg(a) {
    return R(a, ig, {}).then(function (a) {
      return a.authorizedDomains || [];
    });
  },
      kg = function kg(a) {
    if (!a.idToken) throw new Q("internal-error");
  };S.prototype.signInAnonymously = function () {
    return R(this, lg, {});
  };S.prototype.updateEmail = function (a, b) {
    return R(this, mg, { idToken: a, email: b });
  };S.prototype.updatePassword = function (a, b) {
    return R(this, Pf, { idToken: a, password: b });
  };var ng = { displayName: "DISPLAY_NAME", photoUrl: "PHOTO_URL" };
  S.prototype.updateProfile = function (a, b) {
    var c = { idToken: a },
        d = [];Qa(ng, function (a, f) {
      var g = b[f];null === g ? d.push(a) : f in b && (c[f] = g);
    });d.length && (c.deleteAttribute = d);return R(this, mg, c);
  };S.prototype.sendPasswordResetEmail = function (a) {
    return R(this, og, { requestType: "PASSWORD_RESET", email: a });
  };S.prototype.sendEmailVerification = function (a) {
    return R(this, pg, { requestType: "VERIFY_EMAIL", idToken: a });
  };
  var rg = function rg(a, b, c) {
    return R(a, qg, { idToken: b, deleteProvider: c });
  },
      sg = function sg(a) {
    if (!a.requestUri || !a.sessionId && !a.postBody) throw new Q("internal-error");
  },
      tg = function tg(a) {
    if (a.needConfirmation) throw (a && a.email ? new Tf(a.email, Sf(a), a.message) : null) || new Q("account-exists-with-different-credential");if (!a.idToken) throw new Q("internal-error");
  },
      Ff = function Ff(a, b) {
    return R(a, ug, b);
  },
      vg = function vg(a) {
    if (!a.oobCode) throw new Q("invalid-action-code");
  };
  S.prototype.confirmPasswordReset = function (a, b) {
    return R(this, wg, { oobCode: a, newPassword: b });
  };S.prototype.checkActionCode = function (a) {
    return R(this, xg, { oobCode: a });
  };S.prototype.applyActionCode = function (a) {
    return R(this, yg, { oobCode: a });
  };
  var yg = { endpoint: "setAccountInfo", C: vg, Za: "email" },
      xg = { endpoint: "resetPassword", C: vg, na: function na(a) {
      if (!kc.test(a.email)) throw new Q("internal-error");
    } },
      zg = { endpoint: "signupNewUser", C: function C(a) {
      eg(a);if (!a.password) throw new Q("weak-password");
    }, na: kg, oa: !0 },
      gg = { endpoint: "createAuthUri" },
      Ag = { endpoint: "deleteAccount", Ya: ["idToken"] },
      qg = { endpoint: "setAccountInfo", Ya: ["idToken", "deleteProvider"], C: function C(a) {
      if (!ea(a.deleteProvider)) throw new Q("internal-error");
    } },
      Bg = { endpoint: "getAccountInfo" },
      pg = { endpoint: "getOobConfirmationCode", Ya: ["idToken", "requestType"], C: function C(a) {
      if ("VERIFY_EMAIL" != a.requestType) throw new Q("internal-error");
    }, Za: "email" },
      og = { endpoint: "getOobConfirmationCode", Ya: ["requestType"], C: function C(a) {
      if ("PASSWORD_RESET" != a.requestType) throw new Q("internal-error");eg(a);
    }, Za: "email" },
      ig = { Jd: !0, endpoint: "getProjectConfig", ae: "GET" },
      wg = { endpoint: "resetPassword", C: vg, Za: "email" },
      mg = { endpoint: "setAccountInfo", Ya: ["idToken"], C: fg, oa: !0 },
      Pf = { endpoint: "setAccountInfo", Ya: ["idToken"],
    C: function C(a) {
      fg(a);if (!a.password) throw new Q("weak-password");
    }, na: kg, oa: !0 },
      lg = { endpoint: "signupNewUser", na: kg, oa: !0 },
      ug = { endpoint: "verifyAssertion", C: sg, na: tg, oa: !0 },
      Hf = { endpoint: "verifyAssertion", C: function C(a) {
      sg(a);if (!a.idToken) throw new Q("internal-error");
    }, na: tg, oa: !0 },
      Cg = { endpoint: "verifyCustomToken", C: function C(a) {
      if (!a.token) throw new Q("invalid-custom-token");
    }, na: kg, oa: !0 },
      Of = { endpoint: "verifyPassword", C: function C(a) {
      eg(a);if (!a.password) throw new Q("wrong-password");
    }, na: kg, oa: !0 },
      R = function R(a, b, c) {
    if (!yf(c, b.Ya)) return J(new Q("internal-error"));var d = b.ae || "POST",
        e;return I(c).then(b.C).then(function () {
      b.oa && (c.returnSecureToken = !0);return dg(a, b.endpoint, d, c, b.Jd || !1);
    }).then(function (a) {
      return e = a;
    }).then(b.na).then(function () {
      if (!b.Za) return e;if (!(b.Za in e)) throw new Q("internal-error");return e[b.Za];
    });
  },
      ag = function ag(a) {
    var b, c;c = (a.error && a.error.errors && a.error.errors[0] || {}).reason || "";var d = { keyInvalid: "invalid-api-key", ipRefererBlocked: "app-not-authorized" };if (c = d[c] ? new Q(d[c]) : null) return c;c = a.error && a.error.message || "";d = { INVALID_CUSTOM_TOKEN: "invalid-custom-token", CREDENTIAL_MISMATCH: "custom-token-mismatch", MISSING_CUSTOM_TOKEN: "internal-error", INVALID_IDENTIFIER: "invalid-email", MISSING_CONTINUE_URI: "internal-error", INVALID_EMAIL: "invalid-email", INVALID_PASSWORD: "wrong-password", USER_DISABLED: "user-disabled", MISSING_PASSWORD: "internal-error", EMAIL_EXISTS: "email-already-in-use", PASSWORD_LOGIN_DISABLED: "operation-not-allowed", INVALID_IDP_RESPONSE: "invalid-credential",
      FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use", EMAIL_NOT_FOUND: "user-not-found", EXPIRED_OOB_CODE: "expired-action-code", INVALID_OOB_CODE: "invalid-action-code", MISSING_OOB_CODE: "internal-error", CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login", INVALID_ID_TOKEN: "invalid-user-token", TOKEN_EXPIRED: "user-token-expired", USER_NOT_FOUND: "user-token-expired", CORS_UNSUPPORTED: "cors-unsupported", TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests", WEAK_PASSWORD: "weak-password", OPERATION_NOT_ALLOWED: "operation-not-allowed" };
    b = (b = c.match(/:\s*(.*)$/)) && 1 < b.length ? b[1] : void 0;for (var e in d) {
      if (0 === c.indexOf(e)) return new Q(d[e], b);
    }!b && a && (b = sf(a));return new Q("internal-error", b);
  };var Dg = function Dg(a) {
    this.O = a;
  };Dg.prototype.value = function () {
    return this.O;
  };Dg.prototype.td = function (a) {
    this.O.style = a;return this;
  };var Eg = function Eg(a) {
    this.O = a || {};
  };Eg.prototype.value = function () {
    return this.O;
  };Eg.prototype.td = function (a) {
    this.O.style = a;return this;
  };var Gg = function Gg(a) {
    this.Ge = a;this.oc = null;this.pe = Fg(this);
  },
      Hg,
      Ig = function Ig(a) {
    var b = new Eg();b.O.where = document.body;b.O.url = a.Ge;b.O.messageHandlersFilter = of("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER");b.O.attributes = b.O.attributes || {};new Dg(b.O.attributes).td({ position: "absolute", top: "-100px", width: "1px", height: "1px" });b.O.dontclear = !0;return b;
  },
      Fg = function Fg(a) {
    return Jg().then(function () {
      return new H(function (b) {
        of("gapi.iframes.getContext")().open(Ig(a).value(), function (c) {
          a.oc = c;a.oc.restyle({ setHideOnLeave: !1 });
          b();
        });
      });
    });
  },
      Kg = function Kg(a, b) {
    a.pe.then(function () {
      a.oc.register("authEvent", b, of("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));
    });
  },
      Lg = "__iframefcb" + Math.floor(1E6 * Math.random()).toString(),
      Jg = function Jg() {
    return Hg ? Hg : Hg = new H(function (a, b) {
      var c = function c() {
        of("gapi.load")("gapi.iframes", function () {
          a();
        });
      };of("gapi.iframes.Iframe") ? a() : of("gapi.load") ? c() : (l[Lg] = function () {
        of("gapi.load") ? c() : b();
      }, Nd(Vd("https://apis.google.com/js/api.js?onload=" + Lg), function () {
        b();
      }));
    });
  };var Ng = function Ng(a, b, c, d) {
    this.U = a;this.u = b;this.aa = c;d = this.ua = d || null;a = Xe(a, "/__/auth/iframe");O(a, "apiKey", b);O(a, "appName", c);d && O(a, "v", d);this.ce = a.toString();this.de = new Gg(this.ce);this.dc = [];Mg(this);
  },
      Og = function Og(a, b, c, d, e, f, g, k, p) {
    a = Xe(a, "/__/auth/handler");O(a, "apiKey", b);O(a, "appName", c);O(a, "authType", d);O(a, "providerId", e);f && f.length && O(a, "scopes", f.join(","));g && O(a, "redirectUrl", g);k && O(a, "eventId", k);p && O(a, "v", p);return a.toString();
  },
      Mg = function Mg(a) {
    Kg(a.de, function (b) {
      var c = {};
      if (b && b.authEvent) {
        var d = !1;b = b.authEvent || {};if (b.type) {
          if (c = b.error) var e = (c = b.error) && (c.name || c.code),
              c = e ? new Q(e.substring(5), c.message) : null;b = new Cf(b.type, b.eventId, b.urlResponse, b.sessionId, c);
        } else b = null;for (c = 0; c < a.dc.length; c++) {
          d = a.dc[c](b) || d;
        }c = {};c.status = d ? "ACK" : "ERROR";return I(c);
      }c.status = "ERROR";return I(c);
    });
  };var Pg = function Pg(a) {
    this.o = a || firebase.INTERNAL.reactNative && firebase.INTERNAL.reactNative.AsyncStorage;if (!this.o) throw new Q("internal-error", "The React Native compatibility library was not found.");
  };h = Pg.prototype;h.get = function (a) {
    return I(this.o.getItem(a)).then(function (a) {
      return a && tf(a);
    });
  };h.set = function (a, b) {
    return I(this.o.setItem(a, sf(b)));
  };h.remove = function (a) {
    return I(this.o.removeItem(a));
  };h.ta = function () {};h.Ea = function () {};var Qg = function Qg() {
    this.o = {};
  };h = Qg.prototype;h.get = function (a) {
    return I(this.o[a]);
  };h.set = function (a, b) {
    this.o[a] = b;return I();
  };h.remove = function (a) {
    delete this.o[a];return I();
  };h.ta = function () {};h.Ea = function () {};var Sg = function Sg() {
    if (!Rg()) {
      if ("Node" == lf()) throw new Q("internal-error", "The LocalStorage compatibility library was not found.");throw new Q("web-storage-unsupported");
    }this.o = l.localStorage || firebase.INTERNAL.node.localStorage;
  },
      Rg = function Rg() {
    var a = "Node" == lf(),
        a = l.localStorage || a && firebase.INTERNAL.node && firebase.INTERNAL.node.localStorage;if (!a) return !1;try {
      return a.setItem("__sak", "1"), a.removeItem("__sak"), !0;
    } catch (b) {
      return !1;
    }
  };h = Sg.prototype;
  h.get = function (a) {
    var b = this;return I().then(function () {
      var c = b.o.getItem(a);return tf(c);
    });
  };h.set = function (a, b) {
    var c = this;return I().then(function () {
      var d = sf(b);null === d ? c.remove(a) : c.o.setItem(a, d);
    });
  };h.remove = function (a) {
    var b = this;return I().then(function () {
      b.o.removeItem(a);
    });
  };h.ta = function (a) {
    l.window && Xb(l.window, "storage", a);
  };h.Ea = function (a) {
    l.window && fc(l.window, "storage", a);
  };var Tg = function Tg() {
    this.o = {};
  };h = Tg.prototype;h.get = function () {
    return I(null);
  };h.set = function () {
    return I();
  };h.remove = function () {
    return I();
  };h.ta = function () {};h.Ea = function () {};var Vg = function Vg() {
    if (!Ug()) {
      if ("Node" == lf()) throw new Q("internal-error", "The SessionStorage compatibility library was not found.");throw new Q("web-storage-unsupported");
    }this.o = l.sessionStorage || firebase.INTERNAL.node.sessionStorage;
  },
      Ug = function Ug() {
    var a = "Node" == lf(),
        a = l.sessionStorage || a && firebase.INTERNAL.node && firebase.INTERNAL.node.sessionStorage;if (!a) return !1;try {
      return a.setItem("__sak", "1"), a.removeItem("__sak"), !0;
    } catch (b) {
      return !1;
    }
  };h = Vg.prototype;
  h.get = function (a) {
    var b = this;return I().then(function () {
      var c = b.o.getItem(a);return tf(c);
    });
  };h.set = function (a, b) {
    var c = this;return I().then(function () {
      var d = sf(b);null === d ? c.remove(a) : c.o.setItem(a, d);
    });
  };h.remove = function (a) {
    var b = this;return I().then(function () {
      b.o.removeItem(a);
    });
  };h.ta = function () {};h.Ea = function () {};var Zg = function Zg() {
    this.Sc = { Browser: Wg, Node: Xg, ReactNative: Yg }[lf()];
  },
      $g,
      Wg = { A: Sg, Jc: Vg },
      Xg = { A: Sg, Jc: Vg },
      Yg = { A: Pg, Jc: Tg };var ah = "First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" "),
      T = function T(a, b) {
    return { name: a || "", Z: "a valid string", optional: !!b, $: m };
  },
      bh = function bh(a) {
    return { name: a || "", Z: "a valid object", optional: !1, $: ha };
  },
      ch = function ch(a, b) {
    return { name: a || "", Z: "a function", optional: !!b, $: n };
  },
      dh = function dh() {
    return { name: "", Z: "null", optional: !1, $: da };
  },
      eh = function eh() {
    return { name: "credential", Z: "a valid credential", optional: !1, $: function $(a) {
        return !(!a || !a.Db);
      } };
  },
      fh = function fh() {
    return { name: "authProvider", Z: "a valid Auth provider",
      optional: !1, $: function $(a) {
        return !!(a && a.providerId && a.hasOwnProperty && a.hasOwnProperty("isOAuthProvider"));
      } };
  },
      gh = function gh(a, b, c, d) {
    return { name: c || "", Z: a.Z + " or " + b.Z, optional: !!d, $: function $(c) {
        return a.$(c) || b.$(c);
      } };
  };var ih = function ih(a, b) {
    for (var c in b) {
      var d = b[c].name;a[d] = hh(d, a[c], b[c].b);
    }
  },
      U = function U(a, b, c, d) {
    a[b] = hh(b, c, d);
  },
      hh = function hh(a, b, c) {
    if (!c) return b;var d = jh(a);a = function a() {
      var a = Array.prototype.slice.call(arguments),
          e;a: {
        e = Array.prototype.slice.call(a);var k;k = 0;for (var p = !1, Y = 0; Y < c.length; Y++) {
          if (c[Y].optional) p = !0;else {
            if (p) throw new Q("internal-error", "Argument validator encountered a required argument after an optional argument.");k++;
          }
        }p = c.length;if (e.length < k || p < e.length) e = "Expected " + (k == p ? 1 == k ? "1 argument" : k + " arguments" : k + "-" + p + " arguments") + " but got " + e.length + ".";else {
          for (k = 0; k < e.length; k++) {
            if (p = c[k].optional && void 0 === e[k], !c[k].$(e[k]) && !p) {
              e = c[k];if (0 > k || k >= ah.length) throw new Q("internal-error", "Argument validator received an unsupported number of arguments.");e = ah[k] + " argument " + (e.name ? '"' + e.name + '" ' : "") + "must be " + e.Z + ".";break a;
            }
          }e = null;
        }
      }if (e) throw new Q("argument-error", d + " failed: " + e);return b.apply(this, a);
    };for (var e in b) {
      a[e] = b[e];
    }for (e in b.prototype) {
      a.prototype[e] = b.prototype[e];
    }return a;
  },
      jh = function jh(a) {
    a = a.split(".");return a[a.length - 1];
  };var kh,
      lh = function lh(a, b, c, d, e, f) {
    this.Md = a;this.uc = b;this.hc = c;this.xd = d;this.ha = e;this.M = {};this.sb = [];this.pb = 0;this.ee = f || l.indexedDB;
  },
      mh = function mh(a) {
    return new H(function (b, c) {
      var d = a.ee.open(a.Md, a.ha);d.onerror = function (a) {
        c(Error(a.target.errorCode));
      };d.onupgradeneeded = function (b) {
        b = b.target.result;try {
          b.createObjectStore(a.uc, { keyPath: a.hc });
        } catch (d) {
          c(d);
        }
      };d.onsuccess = function (a) {
        b(a.target.result);
      };
    });
  },
      nh = function nh(a) {
    a.bd || (a.bd = mh(a));return a.bd;
  },
      oh = function oh(a, b) {
    return b.objectStore(a.uc);
  },
      ph = function ph(a, b, c) {
    return b.transaction([a.uc], c ? "readwrite" : "readonly");
  },
      qh = function qh(a) {
    return new H(function (b, c) {
      a.onsuccess = function (a) {
        a && a.target ? b(a.target.result) : b();
      };a.onerror = function (a) {
        c(Error(a.target.errorCode));
      };
    });
  };h = lh.prototype;
  h.set = function (a, b) {
    var c = !1,
        d,
        e = this;return vd(nh(this).then(function (b) {
      d = b;b = oh(e, ph(e, d, !0));return qh(b.get(a));
    }).then(function (f) {
      var g = oh(e, ph(e, d, !0));if (f) return f.value = b, qh(g.put(f));e.pb++;c = !0;f = {};f[e.hc] = a;f[e.xd] = b;return qh(g.add(f));
    }).then(function () {
      e.M[a] = b;
    }), function () {
      c && e.pb--;
    });
  };h.get = function (a) {
    var b = this;return nh(this).then(function (c) {
      return qh(oh(b, ph(b, c, !1)).get(a));
    });
  };
  h.remove = function (a) {
    var b = !1,
        c = this;return vd(nh(this).then(function (d) {
      b = !0;c.pb++;return qh(oh(c, ph(c, d, !0))["delete"](a));
    }).then(function () {
      delete c.M[a];
    }), function () {
      b && c.pb--;
    });
  };
  h.Ce = function () {
    var a = this;return nh(this).then(function (b) {
      var c = oh(a, ph(a, b, !1));return c.getAll ? qh(c.getAll()) : new H(function (a, b) {
        var f = [],
            g = c.openCursor();g.onsuccess = function (b) {
          (b = b.target.result) ? (f.push(b.value), b["continue"]()) : a(f);
        };g.onerror = function (a) {
          b(Error(a.target.errorCode));
        };
      });
    }).then(function (b) {
      var c = {},
          d = [];if (0 == a.pb) {
        for (d = 0; d < b.length; d++) {
          c[b[d][a.hc]] = b[d][a.xd];
        }d = cf(a.M, c);a.M = c;
      }return d;
    });
  };h.ta = function (a) {
    0 == this.sb.length && this.Hc();this.sb.push(a);
  };
  h.Ea = function (a) {
    La(this.sb, function (b) {
      return b == a;
    });0 == this.sb.length && this.Vb();
  };h.Hc = function () {
    var a = this;this.Vb();var b = function b() {
      a.yc = te(1E3).then(_q2(a.Ce, a)).then(function (b) {
        0 < b.length && w(a.sb, function (a) {
          a(b);
        });
      }).then(b).F(function (a) {
        "STOP_EVENT" != a.message && b();
      });return a.yc;
    };b();
  };h.Vb = function () {
    this.yc && this.yc.cancel("STOP_EVENT");
  };var rh = function rh(a, b, c, d, e, f) {
    this.ne = a;this.rd = b;this.Oa = d;this.we = e;this.$a = f;this.L = {};$g || ($g = new Zg());a = $g;try {
      this.Ra = new a.Sc.A();
    } catch (g) {
      this.Ra = new Qg(), this.Oa = !1, this.$a = !0;
    }try {
      this.Xb = new a.Sc.Jc();
    } catch (g) {
      this.Xb = new Qg();
    }this.kb = c;this.fd = _q2(this.gd, this);this.ad = _q2(this.fe, this);this.M = {};
  },
      sh,
      th = function th() {
    sh || (kh || (kh = new lh("firebaseLocalStorageDb", "firebaseLocalStorage", "fbase_key", "value", 1)), sh = new rh("firebase", ":", kh, y && !!pb && 11 == pb || /Edge\/\d+/.test($a), "Safari" == ef(df()) && l.window && l.window != l.window.top ? !0 : !1, rf()));return sh;
  };h = rh.prototype;h.J = function (a, b) {
    return this.ne + this.rd + a.name + (b ? this.rd + b : "");
  };h.get = function (a, b) {
    var c = this.J(a, b);return this.Oa && a.A ? this.kb.get(c).then(function (a) {
      return a && a.value;
    }) : (a.A ? this.Ra : this.Xb).get(c);
  };h.remove = function (a, b) {
    var c = this.J(a, b);if (this.Oa && a.A) return this.kb.remove(c);a.A && !this.$a && (this.M[c] = null);return (a.A ? this.Ra : this.Xb).remove(c);
  };
  h.set = function (a, b, c) {
    var d = this.J(a, c);if (this.Oa && a.A) return this.kb.set(d, b);var e = this,
        f = a.A ? this.Ra : this.Xb;return f.set(d, b).then(function () {
      return f.get(d);
    }).then(function (b) {
      a.A && !this.$a && (e.M[d] = b);
    });
  };h.addListener = function (a, b, c) {
    a = this.J(a, b);this.$a || (this.M[a] = l.localStorage.getItem(a));Ta(this.L) && this.Hc();this.L[a] || (this.L[a] = []);this.L[a].push(c);
  };
  h.removeListener = function (a, b, c) {
    a = this.J(a, b);this.L[a] && (La(this.L[a], function (a) {
      return a == c;
    }), 0 == this.L[a].length && delete this.L[a]);Ta(this.L) && this.Vb();
  };h.Hc = function () {
    this.Oa ? this.kb.ta(this.ad) : (this.Ra.ta(this.fd), this.$a || uh(this));
  };
  var uh = function uh(a) {
    vh(a);a.tc = setInterval(function () {
      for (var b in a.L) {
        var c = l.localStorage.getItem(b);c != a.M[b] && (a.M[b] = c, c = new Mb({ type: "storage", key: b, target: window, oldValue: a.M[b], newValue: c }), a.gd(c));
      }
    }, 2E3);
  },
      vh = function vh(a) {
    a.tc && (clearInterval(a.tc), a.tc = null);
  };rh.prototype.Vb = function () {
    this.Oa ? this.kb.Ea(this.ad) : (this.Ra.Ea(this.fd), this.$a || vh(this));
  };
  rh.prototype.gd = function (a) {
    var b = a.Bb.key;if (this.we) {
      var c = l.localStorage.getItem(b);a = a.Bb.newValue;a != c && (a ? l.localStorage.setItem(b, a) : a || l.localStorage.removeItem(b));
    }this.M[b] = l.localStorage.getItem(b);this.Nc(b);
  };rh.prototype.fe = function (a) {
    w(a, _q2(this.Nc, this));
  };rh.prototype.Nc = function (a) {
    this.L[a] && w(this.L[a], function (a) {
      a();
    });
  };var wh = function wh(a) {
    this.B = a;this.w = th();
  },
      xh = { name: "pendingRedirect", A: !1 },
      yh = function yh(a) {
    return a.w.set(xh, "pending", a.B);
  },
      zh = function zh(a) {
    return a.w.remove(xh, a.B);
  },
      Ah = function Ah(a) {
    return a.w.get(xh, a.B).then(function (a) {
      return "pending" == a;
    });
  };var Dh = function Dh(a, b, c) {
    var d = this,
        e = (this.ua = firebase.SDK_VERSION || null) ? nf(this.ua) : null;this.c = new S(b, null, e);this.Qa = null;this.U = a;this.u = b;this.aa = c;this.tb = [];this.rc = !1;this.Id = _q2(this.Vd, this);this.Ua = new Bh(this);this.ld = new Ch(this);this.xc = new wh(this.u + ":" + this.aa);this.bb = {};this.bb.unknown = this.Ua;this.bb.signInViaRedirect = this.Ua;this.bb.linkViaRedirect = this.Ua;this.bb.signInViaPopup = this.ld;this.bb.linkViaPopup = this.ld;this.ue = this.Rb = null;this.qe = new H(function (a, b) {
      d.Rb = a;d.ue = b;
    });
  },
      Eh = function Eh(a) {
    var b = bf();return jg(a).then(function (a) {
      a: {
        for (var d = (b instanceof Ke ? b.clone() : new Ke(b, void 0)).ka, e = 0; e < a.length; e++) {
          var f;var g = a[e];f = d;var k = Pc(g);k ? f = (f = Pc(f)) ? k.Ab(f) : !1 : (k = g.split(".").join("\\."), f = new RegExp("^(.+\\." + k + "|" + k + ")$", "i").test(f));if (f) {
            a = !0;break a;
          }
        }a = !1;
      }if (!a) throw new Q("unauthorized-domain");
    });
  },
      Fh = function Fh(a) {
    a.rc || (a.rc = !0, kf().then(function () {
      a.be = new Ng(a.U, a.u, a.aa, a.ua);a.be.dc.push(a.Id);
    }));return a.qe;
  };
  Dh.prototype.subscribe = function (a) {
    Ia(this.tb, a) || this.tb.push(a);if (!this.rc) {
      var b = this,
          c = function c() {
        var a = df(),
            c;(c = rf(a)) || (a = a || df(), c = "Safari" == ef(a) || a.toLowerCase().match(/iphone|ipad|ipod/) ? !1 : !0);c ? Gh(b.Ua) : Fh(b);
      };Ah(this.xc).then(function (a) {
        a ? zh(b.xc).then(function () {
          Fh(b);
        }) : c();
      }).F(function () {
        c();
      });
    }
  };Dh.prototype.unsubscribe = function (a) {
    La(this.tb, function (b) {
      return b == a;
    });
  };
  Dh.prototype.Vd = function (a) {
    if (!a) throw new Q("invalid-auth-event");this.Rb && (this.Rb(), this.Rb = null);for (var b = !1, c = 0; c < this.tb.length; c++) {
      var d = this.tb[c];if (d.Oc(a.ra, a.wa)) {
        (b = this.bb[a.ra]) && b.md(a, d);b = !0;break;
      }
    }Gh(this.Ua);return b;
  };Dh.prototype.getRedirectResult = function () {
    return this.Ua.getRedirectResult();
  };
  var Ih = function Ih(a, b, c, d, e, f) {
    var g = Fh(a);if (f) return I();if (!b) return J(new Q("popup-blocked"));a.Qa || (a.Qa = Eh(a.c));return a.Qa.then(function () {
      return g;
    }).then(function () {
      Hh(d);var f = Og(a.U, a.u, a.aa, c, d.providerId, d.Eb(), null, e, a.ua);Gb((b || l.window).location, f);
    });
  },
      Jh = function Jh(a, b, c, d) {
    a.Qa || (a.Qa = Eh(a.c));return a.Qa.then(function () {
      Hh(c);var e = Og(a.U, a.u, a.aa, b, c.providerId, c.Eb(), bf(), d, a.ua);yh(a.xc).then(function () {
        Gb(l.window.location, e);
      });
    });
  },
      Kh = function Kh(a, b, c, d) {
    var e = new Q("popup-closed-by-user");
    return jf(c).then(function () {
      return te(3E4).then(function () {
        a.Fa(b, null, e, d);
      });
    });
  },
      Hh = function Hh(a) {
    if (!a.isOAuthProvider) throw new Q("invalid-oauth-provider");
  },
      Lh = {},
      Mh = function Mh(a, b, c) {
    var d = b + ":" + c;Lh[d] || (Lh[d] = new Dh(a, b, c));return Lh[d];
  },
      Bh = function Bh(a) {
    this.w = a;this.Cc = this.Pb = this.Va = this.T = null;this.Bc = !1;
  };
  Bh.prototype.md = function (a, b) {
    if (!a) return J(new Q("invalid-auth-event"));this.Bc = !0;var c = a.ra,
        d = a.wa;"unknown" == c ? (this.T || Nh(this, !1, null, null), c = I()) : c = a.I ? this.zc(a, b) : b.hb(c, d) ? this.Ac(a, b) : J(new Q("invalid-auth-event"));return c;
  };var Gh = function Gh(a) {
    a.Bc || (a.Bc = !0, Nh(a, !1, null, null));
  };Bh.prototype.zc = function (a) {
    this.T || Nh(this, !0, null, a.getError());return I();
  };
  Bh.prototype.Ac = function (a, b) {
    var c = this,
        d = a.ra,
        e = b.hb(d, a.wa),
        f = a.cb,
        g = a.Tb,
        k = "signInViaRedirect" == d || "linkViaRedirect" == d;return this.T ? I() : e(f, g).then(function (a) {
      c.T || Nh(c, k, a, null);
    }).F(function (a) {
      c.T || Nh(c, k, null, a);
    });
  };var Nh = function Nh(a, b, c, d) {
    b ? d ? (a.T = function () {
      return J(d);
    }, a.Pb && a.Pb(d)) : (a.T = function () {
      return I(c);
    }, a.Va && a.Va(c)) : (a.T = function () {
      return I({ user: null });
    }, a.Va && a.Va({ user: null }));a.Va = null;a.Pb = null;
  };
  Bh.prototype.getRedirectResult = function () {
    var a = this;this.Mc || (this.Mc = new H(function (b, c) {
      a.T ? a.T().then(b, c) : (a.Va = b, a.Pb = c, Oh(a));
    }));return this.Mc;
  };var Oh = function Oh(a) {
    var b = new Q("timeout");a.Cc && a.Cc.cancel();a.Cc = te(3E4).then(function () {
      a.T || Nh(a, !0, null, b);
    });
  },
      Ch = function Ch(a) {
    this.w = a;
  };Ch.prototype.md = function (a, b) {
    if (!a) return J(new Q("invalid-auth-event"));var c = a.ra,
        d = a.wa;return a.I ? this.zc(a, b) : b.hb(c, d) ? this.Ac(a, b) : J(new Q("invalid-auth-event"));
  };
  Ch.prototype.zc = function (a, b) {
    b.Fa(a.ra, null, a.getError(), a.wa);return I();
  };Ch.prototype.Ac = function (a, b) {
    var c = a.wa,
        d = a.ra;return b.hb(d, c)(a.cb, a.Tb).then(function (a) {
      b.Fa(d, a, null, c);
    }).F(function (a) {
      b.Fa(d, null, a, c);
    });
  };var Ph = function Ph(a) {
    this.c = a;this.Ia = this.fa = null;this.La = 0;
  };Ph.prototype.G = function () {
    return { apiKey: this.c.u, refreshToken: this.fa, accessToken: this.Ia, expirationTime: this.La };
  };var Rh = function Rh(a, b) {
    var c = b.idToken,
        d = b.refreshToken,
        e = Qh(b.expiresIn);a.Ia = c;a.La = e;a.fa = d;
  },
      Qh = function Qh(a) {
    return la() + 1E3 * parseInt(a, 10);
  },
      Sh = function Sh(a, b) {
    return bg(a.c, b).then(function (b) {
      a.Ia = b.access_token;a.La = Qh(b.expires_in);a.fa = b.refresh_token;return { accessToken: a.Ia, expirationTime: a.La, refreshToken: a.fa };
    });
  };
  Ph.prototype.getToken = function (a) {
    return a || !this.Ia || la() > this.La - 3E4 ? this.fa ? Sh(this, { grant_type: "refresh_token", refresh_token: this.fa }) : I(null) : I({ accessToken: this.Ia, expirationTime: this.La, refreshToken: this.fa });
  };var Th = function Th(a, b, c, d, e) {
    wf(this, { uid: a, displayName: d || null, photoURL: e || null, email: c || null, providerId: b });
  },
      Uh = function Uh(a, b) {
    Lb.call(this, a);for (var c in b) {
      this[c] = b[c];
    }
  };r(Uh, Lb);
  var V = function V(a, b, c) {
    this.S = [];this.u = a.apiKey;this.aa = a.appName;this.U = a.authDomain || null;a = firebase.SDK_VERSION ? nf(firebase.SDK_VERSION) : null;this.c = new S(this.u, null, a);this.qa = new Ph(this.c);Vh(this, b.idToken);Rh(this.qa, b);P(this, "refreshToken", this.qa.fa);Wh(this, c || {});Wd.call(this);this.Mb = !1;this.U && qf() && (this.s = Mh(this.U, this.u, this.aa));this.Ub = [];
  };r(V, Wd);
  var Vh = function Vh(a, b) {
    a.cd = b;P(a, "_lat", b);
  },
      Xh = function Xh(a, b) {
    La(a.Ub, function (a) {
      return a == b;
    });
  },
      Yh = function Yh(a) {
    for (var b = [], c = 0; c < a.Ub.length; c++) {
      b.push(a.Ub[c](a));
    }return sd(b).then(function () {
      return a;
    });
  },
      Zh = function Zh(a) {
    a.s && !a.Mb && (a.Mb = !0, a.s.subscribe(a));
  },
      Wh = function Wh(a, b) {
    wf(a, { uid: b.uid, displayName: b.displayName || null, photoURL: b.photoURL || null, email: b.email || null, emailVerified: b.emailVerified || !1, isAnonymous: b.isAnonymous || !1, providerData: [] });
  };P(V.prototype, "providerId", "firebase");
  var $h = function $h() {},
      ai = function ai(a) {
    return I().then(function () {
      if (a.Nd) throw new Q("app-deleted");
    });
  },
      bi = function bi(a) {
    return Ea(a.providerData, function (a) {
      return a.providerId;
    });
  },
      di = function di(a, b) {
    b && (ci(a, b.providerId), a.providerData.push(b));
  },
      ci = function ci(a, b) {
    La(a.providerData, function (a) {
      return a.providerId == b;
    });
  },
      ei = function ei(a, b, c) {
    ("uid" != b || c) && a.hasOwnProperty(b) && P(a, b, c);
  };
  V.prototype.copy = function (a) {
    var b = this;b != a && (wf(this, { uid: a.uid, displayName: a.displayName, photoURL: a.photoURL, email: a.email, emailVerified: a.emailVerified, isAnonymous: a.isAnonymous, providerData: [] }), w(a.providerData, function (a) {
      di(b, a);
    }), this.qa = a.qa, P(this, "refreshToken", this.qa.fa));
  };V.prototype.reload = function () {
    var a = this;return ai(this).then(function () {
      return fi(a).then(function () {
        return Yh(a);
      }).then($h);
    });
  };
  var fi = function fi(a) {
    return a.getToken().then(function (b) {
      var c = a.isAnonymous;return gi(a, b).then(function () {
        c || ei(a, "isAnonymous", !1);return b;
      }).F(function (b) {
        "auth/user-token-expired" == b.code && (a.dispatchEvent(new Uh("userDeleted")), hi(a));throw b;
      });
    });
  };V.prototype.getToken = function (a) {
    var b = this;return ai(this).then(function () {
      return b.qa.getToken(a);
    }).then(function (a) {
      if (!a) throw new Q("internal-error");a.accessToken != b.cd && (Vh(b, a.accessToken), b.la());ei(b, "refreshToken", a.refreshToken);return a.accessToken;
    });
  };
  var ii = function ii(a, b) {
    b.idToken && a.cd != b.idToken && (Rh(a.qa, b), a.la(), Vh(a, b.idToken));
  };V.prototype.la = function () {
    this.dispatchEvent(new Uh("tokenChanged"));
  };var gi = function gi(a, b) {
    return R(a.c, Bg, { idToken: b }).then(_q2(a.se, a));
  };
  V.prototype.se = function (a) {
    a = a.users;if (!a || !a.length) throw new Q("internal-error");a = a[0];Wh(this, { uid: a.localId, displayName: a.displayName, photoURL: a.photoUrl, email: a.email, emailVerified: !!a.emailVerified });for (var b = ji(a), c = 0; c < b.length; c++) {
      di(this, b[c]);
    }ei(this, "isAnonymous", !(this.email && a.passwordHash) && !(this.providerData && this.providerData.length));
  };
  var ji = function ji(a) {
    return (a = a.providerUserInfo) && a.length ? Ea(a, function (a) {
      return new Th(a.rawId, a.providerId, a.email, a.displayName, a.photoUrl);
    }) : [];
  };V.prototype.reauthenticate = function (a) {
    var b = this;return this.f(a.Db(this.c).then(function (a) {
      var d;a: {
        var e = a.idToken.split(".");if (3 == e.length) {
          for (var e = e[1], f = (4 - e.length % 4) % 4, g = 0; g < f; g++) {
            e += ".";
          }try {
            var k = lc(tb(e));if (k.sub && k.iss && k.aud && k.exp) {
              d = new Df(k);break a;
            }
          } catch (p) {}
        }d = null;
      }if (!d || b.uid != d.ke) throw new Q("user-mismatch");ii(b, a);return b.reload();
    }));
  };
  var ki = function ki(a, b) {
    return fi(a).then(function () {
      if (Ia(bi(a), b)) return Yh(a).then(function () {
        throw new Q("provider-already-linked");
      });
    });
  };h = V.prototype;h.link = function (a) {
    var b = this;return this.f(ki(this, a.provider).then(function () {
      return b.getToken();
    }).then(function (c) {
      return a.ed(b.c, c);
    }).then(_q2(this.Uc, this)));
  };h.Uc = function (a) {
    ii(this, a);var b = this;return this.reload().then(function () {
      return b;
    });
  };
  h.updateEmail = function (a) {
    var b = this;return this.f(this.getToken().then(function (c) {
      return b.c.updateEmail(c, a);
    }).then(function (a) {
      ii(b, a);return b.reload();
    }));
  };h.updatePassword = function (a) {
    var b = this;return this.f(this.getToken().then(function (c) {
      return b.c.updatePassword(c, a);
    }).then(function (a) {
      ii(b, a);return b.reload();
    }));
  };
  h.updateProfile = function (a) {
    if (void 0 === a.displayName && void 0 === a.photoURL) return ai(this);var b = this;return this.f(this.getToken().then(function (c) {
      return b.c.updateProfile(c, { displayName: a.displayName, photoUrl: a.photoURL });
    }).then(function (a) {
      ii(b, a);ei(b, "displayName", a.displayName || null);ei(b, "photoURL", a.photoUrl || null);return Yh(b);
    }).then($h));
  };
  h.unlink = function (a) {
    var b = this;return this.f(fi(this).then(function (c) {
      return Ia(bi(b), a) ? rg(b.c, c, [a]).then(function (a) {
        var c = {};w(a.providerUserInfo || [], function (a) {
          c[a.providerId] = !0;
        });w(bi(b), function (a) {
          c[a] || ci(b, a);
        });return Yh(b);
      }) : Yh(b).then(function () {
        throw new Q("no-such-provider");
      });
    }));
  };h["delete"] = function () {
    var a = this;return this.f(this.getToken().then(function (b) {
      return R(a.c, Ag, { idToken: b });
    }).then(function () {
      a.dispatchEvent(new Uh("userDeleted"));
    })).then(function () {
      hi(a);
    });
  };
  h.Oc = function (a, b) {
    return "linkViaPopup" == a && (this.da || null) == b && this.X || "linkViaRedirect" == a && (this.Ob || null) == b ? !0 : !1;
  };h.Fa = function (a, b, c, d) {
    "linkViaPopup" == a && d == (this.da || null) && (c && this.Ba ? this.Ba(c) : b && !c && this.X && this.X(b), this.Ca && (this.Ca.cancel(), this.Ca = null), delete this.X, delete this.Ba);
  };h.hb = function (a, b) {
    return "linkViaPopup" == a && b == (this.da || null) || "linkViaRedirect" == a && (this.Ob || null) == b ? _q2(this.Qd, this) : null;
  };h.Cb = function () {
    return pf(this.uid + ":::");
  };
  h.linkWithPopup = function (a) {
    if (!qf()) return J(new Q("operation-not-supported-in-this-environment"));var b = this,
        c = Af(a.providerId),
        d = this.Cb(),
        e = null;!rf() && this.U && a.isOAuthProvider && (e = Og(this.U, this.u, this.aa, "linkViaPopup", a.providerId, a.Eb(), null, d, firebase.SDK_VERSION || null));var f = hf(e, c && c.rb, c && c.qb),
        c = ki(this, a.providerId).then(function () {
      return Yh(b);
    }).then(function () {
      li(b);return b.getToken();
    }).then(function () {
      return Ih(b.s, f, "linkViaPopup", a, d, !!e);
    }).then(function () {
      return new H(function (a, c) {
        b.Fa("linkViaPopup", null, new Q("cancelled-popup-request"), b.da || null);b.X = a;b.Ba = c;b.da = d;b.Ca = Kh(b, "linkViaPopup", f, d);
      });
    }).then(function (a) {
      f && gf(f);return a;
    }).F(function (a) {
      f && gf(f);throw a;
    });return this.f(c);
  };
  h.linkWithRedirect = function (a) {
    if (!qf()) return J(new Q("operation-not-supported-in-this-environment"));var b = this,
        c = null,
        d = this.Cb(),
        e = ki(this, a.providerId).then(function () {
      li(b);return b.getToken();
    }).then(function () {
      b.Ob = d;return Yh(b);
    }).then(function (a) {
      b.Da && (a = b.Da, a = a.w.set(mi, b.G(), a.B));return a;
    }).then(function () {
      return Jh(b.s, "linkViaRedirect", a, d);
    }).F(function (a) {
      c = a;if (b.Da) return ni(b.Da);throw c;
    }).then(function () {
      if (c) throw c;
    });return this.f(e);
  };
  var li = function li(a) {
    if (a.s && a.Mb) return;if (a.s && !a.Mb) throw new Q("internal-error");throw new Q("auth-domain-config-required");
  };V.prototype.Qd = function (a, b) {
    var c = this,
        d = null,
        e = this.getToken().then(function (d) {
      return R(c.c, Hf, { requestUri: a, sessionId: b, idToken: d });
    }).then(function (a) {
      d = Sf(a);return c.Uc(a);
    }).then(function (a) {
      return { user: a, credential: d };
    });return this.f(e);
  };
  V.prototype.sendEmailVerification = function () {
    var a = this;return this.f(this.getToken().then(function (b) {
      return a.c.sendEmailVerification(b);
    }).then(function (b) {
      if (a.email != b) return a.reload();
    }).then(function () {}));
  };var hi = function hi(a) {
    for (var b = 0; b < a.S.length; b++) {
      a.S[b].cancel("app-deleted");
    }a.S = [];a.Nd = !0;P(a, "refreshToken", null);a.s && a.s.unsubscribe(a);
  };V.prototype.f = function (a) {
    var b = this;this.S.push(a);vd(a, function () {
      Ka(b.S, a);
    });return a;
  };V.prototype.toJSON = function () {
    return this.G();
  };
  V.prototype.G = function () {
    var a = { uid: this.uid, displayName: this.displayName, photoURL: this.photoURL, email: this.email, emailVerified: this.emailVerified, isAnonymous: this.isAnonymous, providerData: [], apiKey: this.u, appName: this.aa, authDomain: this.U, stsTokenManager: this.qa.G(), redirectEventId: this.Ob || null };w(this.providerData, function (b) {
      a.providerData.push(xf(b));
    });return a;
  };
  var oi = function oi(a) {
    if (!a.apiKey) return null;var b = { apiKey: a.apiKey, authDomain: a.authDomain, appName: a.appName },
        c = {};if (a.stsTokenManager && a.stsTokenManager.accessToken && a.stsTokenManager.refreshToken && a.stsTokenManager.expirationTime) c.idToken = a.stsTokenManager.accessToken, c.refreshToken = a.stsTokenManager.refreshToken, c.expiresIn = (a.stsTokenManager.expirationTime - la()) / 1E3;else return null;var d = new V(b, c, a);a.providerData && w(a.providerData, function (a) {
      if (a) {
        var b = {};wf(b, a);di(d, b);
      }
    });a.redirectEventId && (d.Ob = a.redirectEventId);return d;
  },
      pi = function pi(a, b, c) {
    var d = new V(a, b);c && (d.Da = c);return d.reload().then(function () {
      return d;
    });
  };var qi = function qi(a) {
    this.B = a;this.w = th();
  },
      mi = { name: "redirectUser", A: !1 },
      ni = function ni(a) {
    return a.w.remove(mi, a.B);
  },
      ri = function ri(a, b) {
    return a.w.get(mi, a.B).then(function (a) {
      a && b && (a.authDomain = b);return oi(a || {});
    });
  };var si = function si(a) {
    this.B = a;this.w = th();
  },
      ti = { name: "authUser", A: !0 },
      ui = function ui(a) {
    return a.w.remove(ti, a.B);
  },
      vi = function vi(a, b) {
    return a.w.get(ti, a.B).then(function (a) {
      a && b && (a.authDomain = b);return oi(a || {});
    });
  };var X = function X(a) {
    this.ic = !1;P(this, "app", a);if (W(this).options && W(this).options.apiKey) a = firebase.SDK_VERSION ? nf(firebase.SDK_VERSION) : null, this.c = new S(W(this).options && W(this).options.apiKey, null, a);else throw new Q("invalid-api-key");this.S = [];this.fb = [];this.oe = firebase.INTERNAL.createSubscribe(_q2(this.ge, this));wi(this, null);this.sa = new si(W(this).options.apiKey + ":" + W(this).name);this.Wa = new qi(W(this).options.apiKey + ":" + W(this).name);this.P = this.f(xi(this));this.mb = !1;this.Xc = _q2(this.Be, this);
    this.vd = _q2(this.Na, this);this.wd = _q2(this.$d, this);this.ud = _q2(this.Zd, this);yi(this);this.INTERNAL = {};this.INTERNAL["delete"] = _q2(this["delete"], this);
  };X.prototype.toJSON = function () {
    return { apiKey: W(this).options.apiKey, authDomain: W(this).options.authDomain, appName: W(this).name, currentUser: Z(this) && Z(this).G() };
  };
  var zi = function zi(a) {
    return a.Od || J(new Q("auth-domain-config-required"));
  },
      yi = function yi(a) {
    var b = W(a).options.authDomain,
        c = W(a).options.apiKey;b && qf() && (a.Od = a.P.then(function () {
      a.s = Mh(b, c, W(a).name);a.s.subscribe(a);Z(a) && Zh(Z(a));a.Dc && (Zh(a.Dc), a.Dc = null);return a.s;
    }));
  };h = X.prototype;h.Oc = function (a, b) {
    switch (a) {case "unknown":case "signInViaRedirect":
        return !0;case "signInViaPopup":
        return this.da == b && !!this.X;default:
        return !1;}
  };
  h.Fa = function (a, b, c, d) {
    "signInViaPopup" == a && this.da == d && (c && this.Ba ? this.Ba(c) : b && !c && this.X && this.X(b), this.Ca && (this.Ca.cancel(), this.Ca = null), delete this.X, delete this.Ba);
  };h.hb = function (a, b) {
    return "signInViaRedirect" == a || "signInViaPopup" == a && this.da == b && this.X ? _q2(this.Rd, this) : null;
  };
  h.Rd = function (a, b) {
    var c = this,
        d = null,
        e = Ff(c.c, { requestUri: a, sessionId: b }).then(function (a) {
      d = Sf(a);return a;
    }),
        f = c.P.then(function () {
      return e;
    }).then(function (a) {
      return Ai(c, a);
    }).then(function () {
      return { user: Z(c), credential: d };
    });return this.f(f);
  };h.Cb = function () {
    return pf();
  };
  h.signInWithPopup = function (a) {
    if (!qf()) return J(new Q("operation-not-supported-in-this-environment"));var b = this,
        c = Af(a.providerId),
        d = this.Cb(),
        e = null;!rf() && W(this).options.authDomain && a.isOAuthProvider && (e = Og(W(this).options.authDomain, W(this).options.apiKey, W(this).name, "signInViaPopup", a.providerId, a.Eb(), null, d, firebase.SDK_VERSION || null));var f = hf(e, c && c.rb, c && c.qb),
        c = zi(this).then(function (b) {
      return Ih(b, f, "signInViaPopup", a, d, !!e);
    }).then(function () {
      return new H(function (a, c) {
        b.Fa("signInViaPopup", null, new Q("cancelled-popup-request"), b.da);b.X = a;b.Ba = c;b.da = d;b.Ca = Kh(b, "signInViaPopup", f, d);
      });
    }).then(function (a) {
      f && gf(f);return a;
    }).F(function (a) {
      f && gf(f);throw a;
    });return this.f(c);
  };h.signInWithRedirect = function (a) {
    if (!qf()) return J(new Q("operation-not-supported-in-this-environment"));var b = this,
        c = zi(this).then(function () {
      return Jh(b.s, "signInViaRedirect", a);
    });return this.f(c);
  };
  h.getRedirectResult = function () {
    if (!qf()) return J(new Q("operation-not-supported-in-this-environment"));var a = this,
        b = zi(this).then(function () {
      return a.s.getRedirectResult();
    });return this.f(b);
  };
  var Ai = function Ai(a, b) {
    var c = {};c.apiKey = W(a).options.apiKey;c.authDomain = W(a).options.authDomain;c.appName = W(a).name;return a.P.then(function () {
      return pi(c, b, a.Wa);
    }).then(function (b) {
      if (Z(a) && b.uid == Z(a).uid) return Z(a).copy(b), a.Na(b);wi(a, b);Zh(b);return a.Na(b);
    }).then(function () {
      a.la();
    });
  },
      wi = function wi(a, b) {
    Z(a) && (Xh(Z(a), a.vd), fc(Z(a), "tokenChanged", a.wd), fc(Z(a), "userDeleted", a.ud));b && (b.Ub.push(a.vd), Xb(b, "tokenChanged", a.wd), Xb(b, "userDeleted", a.ud));P(a, "currentUser", b);
  };
  X.prototype.signOut = function () {
    var a = this,
        b = this.P.then(function () {
      if (!Z(a)) return I();wi(a, null);return ui(a.sa).then(function () {
        a.la();
      });
    });return this.f(b);
  };
  var Bi = function Bi(a) {
    var b = ri(a.Wa, W(a).options.authDomain).then(function (b) {
      if (a.Dc = b) b.Da = a.Wa;return ni(a.Wa);
    });return a.f(b);
  },
      xi = function xi(a) {
    var b = W(a).options.authDomain,
        c = vd(Bi(a).then(function () {
      return vi(a.sa, b);
    }).then(function (b) {
      return b ? (b.Da = a.Wa, b.reload().then(function () {
        return b;
      }).F(function (c) {
        return "auth/network-request-failed" == c.code ? b : ui(a.sa);
      })) : null;
    }).then(function (b) {
      wi(a, b || null);a.mb = !0;a.la();
    }), function () {
      if (!a.ic) {
        a.mb = !0;var b = a.sa;b.w.addListener(ti, b.B, a.Xc);
      }
    });return a.f(c);
  };
  X.prototype.Be = function () {
    var a = this;return vi(this.sa, W(this).options.authDomain).then(function (b) {
      if (!a.ic) {
        var c;if (c = Z(a) && b) {
          c = Z(a).uid;var d = b.uid;c = void 0 === c || null === c || "" === c || void 0 === d || null === d || "" === d ? !1 : c == d;
        }if (c) return Z(a).copy(b), Z(a).getToken();wi(a, b);b && (Zh(b), b.Da = a.Wa);a.s.subscribe(a);a.la();
      }
    });
  };X.prototype.Na = function (a) {
    var b = this.sa;return b.w.set(ti, a.G(), b.B);
  };X.prototype.$d = function () {
    this.mb = !0;this.la();this.Na(Z(this));
  };X.prototype.Zd = function () {
    this.signOut();
  };
  var Ci = function Ci(a, b) {
    return a.f(b.then(function (b) {
      return Ai(a, b);
    }).then(function () {
      return Z(a);
    }));
  };h = X.prototype;h.ge = function (a) {
    var b = this;this.addAuthTokenListener(function () {
      a.next(Z(b));
    });
  };h.onAuthStateChanged = function (a, b, c) {
    var d = this;this.mb && firebase.Promise.resolve().then(function () {
      n(a) ? a(Z(d)) : n(a.next) && a.next(Z(d));
    });return this.oe(a, b, c);
  };h.getToken = function (a) {
    var b = this,
        c = this.P.then(function () {
      return Z(b) ? Z(b).getToken(a).then(function (a) {
        return { accessToken: a };
      }) : null;
    });return this.f(c);
  };
  h.signInWithCustomToken = function (a) {
    var b = this;return this.P.then(function () {
      return Ci(b, R(b.c, Cg, { token: a }));
    }).then(function (a) {
      ei(a, "isAnonymous", !1);return b.Na(a);
    }).then(function () {
      return Z(b);
    });
  };h.signInWithEmailAndPassword = function (a, b) {
    var c = this;return this.P.then(function () {
      return Ci(c, R(c.c, Of, { email: a, password: b }));
    });
  };h.createUserWithEmailAndPassword = function (a, b) {
    var c = this;return this.P.then(function () {
      return Ci(c, R(c.c, zg, { email: a, password: b }));
    });
  };
  h.signInWithCredential = function (a) {
    var b = this;return this.P.then(function () {
      return Ci(b, a.Db(b.c));
    });
  };h.signInAnonymously = function () {
    var a = Z(this),
        b = this;return a && a.isAnonymous ? I(a) : this.P.then(function () {
      return Ci(b, b.c.signInAnonymously());
    }).then(function (a) {
      ei(a, "isAnonymous", !0);return b.Na(a);
    }).then(function () {
      return Z(b);
    });
  };var W = function W(a) {
    return a.app;
  },
      Z = function Z(a) {
    return a.currentUser;
  };h = X.prototype;
  h.la = function () {
    for (var a = 0; a < this.fb.length; a++) {
      if (this.fb[a]) this.fb[a](Z(this) && Z(this)._lat || null);
    }
  };h.addAuthTokenListener = function (a) {
    this.fb.push(a);var b = this;this.mb && this.P.then(function () {
      a(Z(b) && Z(b)._lat || null);
    });
  };h.removeAuthTokenListener = function (a) {
    La(this.fb, function (b) {
      return b == a;
    });
  };h["delete"] = function () {
    this.ic = !0;for (var a = 0; a < this.S.length; a++) {
      this.S[a].cancel("app-deleted");
    }this.S = [];this.sa && (a = this.sa, a.w.removeListener(ti, a.B, this.Xc));this.s && this.s.unsubscribe(this);
  };
  h.f = function (a) {
    var b = this;this.S.push(a);vd(a, function () {
      Ka(b.S, a);
    });return a;
  };h.fetchProvidersForEmail = function (a) {
    return this.f(hg(this.c, a));
  };h.verifyPasswordResetCode = function (a) {
    return this.checkActionCode(a).then(function (a) {
      return a.data.email;
    });
  };h.confirmPasswordReset = function (a, b) {
    return this.f(this.c.confirmPasswordReset(a, b).then(function () {}));
  };h.checkActionCode = function (a) {
    return this.f(this.c.checkActionCode(a).then(function (a) {
      return { data: { email: a.email } };
    }));
  };h.applyActionCode = function (a) {
    return this.f(this.c.applyActionCode(a).then(function () {}));
  };
  h.sendPasswordResetEmail = function (a) {
    return this.f(this.c.sendPasswordResetEmail(a).then(function () {}));
  };ih(X.prototype, { applyActionCode: { name: "applyActionCode", b: [T("code")] }, checkActionCode: { name: "checkActionCode", b: [T("code")] }, confirmPasswordReset: { name: "confirmPasswordReset", b: [T("code"), T("newPassword")] }, createUserWithEmailAndPassword: { name: "createUserWithEmailAndPassword", b: [T("email"), T("password")] }, fetchProvidersForEmail: { name: "fetchProvidersForEmail", b: [T("email")] }, getRedirectResult: { name: "getRedirectResult", b: [] }, onAuthStateChanged: { name: "onAuthStateChanged", b: [gh(bh(), ch(), "nextOrObserver"), ch("opt_error", !0), ch("opt_completed", !0)] }, sendPasswordResetEmail: { name: "sendPasswordResetEmail", b: [T("email")] }, signInAnonymously: { name: "signInAnonymously", b: [] }, signInWithCredential: { name: "signInWithCredential", b: [eh()] }, signInWithCustomToken: { name: "signInWithCustomToken", b: [T("token")] }, signInWithEmailAndPassword: { name: "signInWithEmailAndPassword", b: [T("email"), T("password")] }, signInWithPopup: { name: "signInWithPopup", b: [fh()] }, signInWithRedirect: { name: "signInWithRedirect", b: [fh()] }, signOut: { name: "signOut",
      b: [] }, toJSON: { name: "toJSON", b: [T(null, !0)] }, verifyPasswordResetCode: { name: "verifyPasswordResetCode", b: [T("code")] } });
  ih(V.prototype, { "delete": { name: "delete", b: [] }, getToken: { name: "getToken", b: [{ name: "opt_forceRefresh", Z: "a boolean", optional: !0, $: function $(a) {
          return "boolean" == typeof a;
        } }] }, link: { name: "link", b: [eh()] }, linkWithPopup: { name: "linkWithPopup", b: [fh()] }, linkWithRedirect: { name: "linkWithRedirect", b: [fh()] }, reauthenticate: { name: "reauthenticate", b: [eh()] }, reload: { name: "reload", b: [] }, sendEmailVerification: { name: "sendEmailVerification", b: [] }, toJSON: { name: "toJSON", b: [T(null, !0)] }, unlink: { name: "unlink", b: [T("provider")] },
    updateEmail: { name: "updateEmail", b: [T("email")] }, updatePassword: { name: "updatePassword", b: [T("password")] }, updateProfile: { name: "updateProfile", b: [bh("profile")] } });ih(H.prototype, { F: { name: "catch" }, then: { name: "then" } });U(Qf, "credential", function (a, b) {
    return new Nf(a, b);
  }, [T("email"), T("password")]);ih(Jf.prototype, { addScope: { name: "addScope", b: [T("scope")] } });U(Jf, "credential", Jf.credential, [gh(T(), bh(), "token")]);ih(Kf.prototype, { addScope: { name: "addScope", b: [T("scope")] } });
  U(Kf, "credential", Kf.credential, [gh(T(), bh(), "token")]);ih(Lf.prototype, { addScope: { name: "addScope", b: [T("scope")] } });U(Lf, "credential", Lf.credential, [gh(T(), gh(bh(), dh()), "idToken"), gh(T(), dh(), "accessToken", !0)]);U(Mf, "credential", Mf.credential, [gh(T(), bh(), "token"), T("secret", !0)]);
  (function () {
    if ("undefined" !== typeof firebase && firebase.INTERNAL && firebase.INTERNAL.registerService) {
      var a = { Auth: X, Error: Q };U(a, "EmailAuthProvider", Qf, []);U(a, "FacebookAuthProvider", Jf, []);U(a, "GithubAuthProvider", Kf, []);U(a, "GoogleAuthProvider", Lf, []);U(a, "TwitterAuthProvider", Mf, []);firebase.INTERNAL.registerService("auth", function (a, c) {
        var d = new X(a);c({ INTERNAL: { getToken: _q2(d.getToken, d), addAuthTokenListener: _q2(d.addAuthTokenListener, d), removeAuthTokenListener: _q2(d.removeAuthTokenListener, d) } });return d;
      }, a);firebase.INTERNAL.registerAppHook(function (a, c) {
        "create" === a && c.auth();
      });firebase.INTERNAL.extendNamespace({ User: V });
    } else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");
  })();
})();
(function () {
  var g,
      n = this;function p(a) {
    return void 0 !== a;
  }function aa() {}function ba(a) {
    a.Wb = function () {
      return a.af ? a.af : a.af = new a();
    };
  }
  function ca(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);if ("object" == b) {
      if (a) {
        if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
      } else return "null";
    } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
  }function da(a) {
    return "array" == ca(a);
  }function ea(a) {
    var b = ca(a);return "array" == b || "object" == b && "number" == typeof a.length;
  }function q(a) {
    return "string" == typeof a;
  }function fa(a) {
    return "number" == typeof a;
  }function ga(a) {
    return "function" == ca(a);
  }function ha(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);return "object" == b && null != a || "function" == b;
  }function ia(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function ja(a, b, c) {
    if (!a) throw Error();if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);return function () {
        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
      };
    }return function () {
      return a.apply(b, arguments);
    };
  }function r(a, b, c) {
    r = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ia : ja;return r.apply(null, arguments);
  }
  function ka(a, b) {
    function c() {}c.prototype = b.prototype;a.Fg = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.Cg = function (a, c, f) {
      for (var h = Array(arguments.length - 2), k = 2; k < arguments.length; k++) {
        h[k - 2] = arguments[k];
      }return b.prototype[c].apply(a, h);
    };
  };function t(a, b) {
    for (var c in a) {
      b.call(void 0, a[c], c, a);
    }
  }function la(a, b) {
    var c = {},
        d;for (d in a) {
      c[d] = b.call(void 0, a[d], d, a);
    }return c;
  }function ma(a, b) {
    for (var c in a) {
      if (!b.call(void 0, a[c], c, a)) return !1;
    }return !0;
  }function na(a) {
    var b = 0,
        c;for (c in a) {
      b++;
    }return b;
  }function oa(a) {
    for (var b in a) {
      return b;
    }
  }function pa(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = a[d];
    }return b;
  }function qa(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = d;
    }return b;
  }function ra(a, b) {
    for (var c in a) {
      if (a[c] == b) return !0;
    }return !1;
  }
  function sa(a, b, c) {
    for (var d in a) {
      if (b.call(c, a[d], d, a)) return d;
    }
  }function ta(a, b) {
    var c = sa(a, b, void 0);return c && a[c];
  }function ua(a) {
    for (var b in a) {
      return !1;
    }return !0;
  }function va(a) {
    var b = {},
        c;for (c in a) {
      b[c] = a[c];
    }return b;
  };function wa(a) {
    a = String(a);if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) try {
      return eval("(" + a + ")");
    } catch (b) {}throw Error("Invalid JSON string: " + a);
  }function xa() {
    this.Fd = void 0;
  }
  function ya(a, b, c) {
    switch (typeof b === "undefined" ? "undefined" : _typeof(b)) {case "string":
        za(b, c);break;case "number":
        c.push(isFinite(b) && !isNaN(b) ? b : "null");break;case "boolean":
        c.push(b);break;case "undefined":
        c.push("null");break;case "object":
        if (null == b) {
          c.push("null");break;
        }if (da(b)) {
          var d = b.length;c.push("[");for (var e = "", f = 0; f < d; f++) {
            c.push(e), e = b[f], ya(a, a.Fd ? a.Fd.call(b, String(f), e) : e, c), e = ",";
          }c.push("]");break;
        }c.push("{");d = "";for (f in b) {
          Object.prototype.hasOwnProperty.call(b, f) && (e = b[f], "function" != typeof e && (c.push(d), za(f, c), c.push(":"), ya(a, a.Fd ? a.Fd.call(b, f, e) : e, c), d = ","));
        }c.push("}");break;case "function":
        break;default:
        throw Error("Unknown type: " + (typeof b === "undefined" ? "undefined" : _typeof(b)));}
  }var Aa = { '"': '\\"', "\\": "\\\\", "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b" },
      Ba = /\uffff/.test("\uFFFF") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
  function za(a, b) {
    b.push('"', a.replace(Ba, function (a) {
      if (a in Aa) return Aa[a];var b = a.charCodeAt(0),
          e = "\\u";16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");return Aa[a] = e + b.toString(16);
    }), '"');
  };var v;a: {
    var Ca = n.navigator;if (Ca) {
      var Da = Ca.userAgent;if (Da) {
        v = Da;break a;
      }
    }v = "";
  };function Ea(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, Ea);else {
      var b = Error().stack;b && (this.stack = b);
    }a && (this.message = String(a));
  }ka(Ea, Error);Ea.prototype.name = "CustomError";var w = Array.prototype,
      Fa = w.indexOf ? function (a, b, c) {
    return w.indexOf.call(a, b, c);
  } : function (a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;if (q(a)) return q(b) && 1 == b.length ? a.indexOf(b, c) : -1;for (; c < a.length; c++) {
      if (c in a && a[c] === b) return c;
    }return -1;
  },
      Ga = w.forEach ? function (a, b, c) {
    w.forEach.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = q(a) ? a.split("") : a, f = 0; f < d; f++) {
      f in e && b.call(c, e[f], f, a);
    }
  },
      Ha = w.filter ? function (a, b, c) {
    return w.filter.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = [], f = 0, h = q(a) ? a.split("") : a, k = 0; k < d; k++) {
      if (k in h) {
        var m = h[k];b.call(c, m, k, a) && (e[f++] = m);
      }
    }return e;
  },
      Ia = w.map ? function (a, b, c) {
    return w.map.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = Array(d), f = q(a) ? a.split("") : a, h = 0; h < d; h++) {
      h in f && (e[h] = b.call(c, f[h], h, a));
    }return e;
  },
      Ja = w.reduce ? function (a, b, c, d) {
    for (var e = [], f = 1, h = arguments.length; f < h; f++) {
      e.push(arguments[f]);
    }d && (e[0] = r(b, d));return w.reduce.apply(a, e);
  } : function (a, b, c, d) {
    var e = c;Ga(a, function (c, h) {
      e = b.call(d, e, c, h, a);
    });return e;
  },
      Ka = w.every ? function (a, b, c) {
    return w.every.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = q(a) ? a.split("") : a, f = 0; f < d; f++) {
      if (f in e && !b.call(c, e[f], f, a)) return !1;
    }return !0;
  };function La(a, b) {
    var c = Ma(a, b, void 0);return 0 > c ? null : q(a) ? a.charAt(c) : a[c];
  }function Ma(a, b, c) {
    for (var d = a.length, e = q(a) ? a.split("") : a, f = 0; f < d; f++) {
      if (f in e && b.call(c, e[f], f, a)) return f;
    }return -1;
  }function Na(a, b) {
    var c = Fa(a, b);0 <= c && w.splice.call(a, c, 1);
  }function Oa(a, b, c) {
    return 2 >= arguments.length ? w.slice.call(a, b) : w.slice.call(a, b, c);
  }
  function Pa(a, b) {
    a.sort(b || Qa);
  }function Qa(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  };var Ra = -1 != v.indexOf("Opera") || -1 != v.indexOf("OPR"),
      Sa = -1 != v.indexOf("Trident") || -1 != v.indexOf("MSIE"),
      Ta = -1 != v.indexOf("Gecko") && -1 == v.toLowerCase().indexOf("webkit") && !(-1 != v.indexOf("Trident") || -1 != v.indexOf("MSIE")),
      Ua = -1 != v.toLowerCase().indexOf("webkit");
  (function () {
    var a = "",
        b;if (Ra && n.opera) return a = n.opera.version, ga(a) ? a() : a;Ta ? b = /rv\:([^\);]+)(\)|;)/ : Sa ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : Ua && (b = /WebKit\/(\S+)/);b && (a = (a = b.exec(v)) ? a[1] : "");return Sa && (b = (b = n.document) ? b.documentMode : void 0, b > parseFloat(a)) ? String(b) : a;
  })();function Va(a) {
    n.setTimeout(function () {
      throw a;
    }, 0);
  }var Wa;
  function Xa() {
    var a = n.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && -1 == v.indexOf("Presto") && (a = function a() {
      var a = document.createElement("iframe");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);var b = a.contentWindow,
          a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
          d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
          a = r(function (a) {
        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
      }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
          b.postMessage(c, d);
        } };
    });if ("undefined" !== typeof a && -1 == v.indexOf("Trident") && -1 == v.indexOf("MSIE")) {
      var b = new a(),
          c = {},
          d = c;b.port1.onmessage = function () {
        if (p(c.next)) {
          c = c.next;var a = c.Le;c.Le = null;a();
        }
      };return function (a) {
        d.next = { Le: a };d = d.next;b.port2.postMessage(0);
      };
    }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("script") ? function (a) {
      var b = document.createElement("script");b.onreadystatechange = function () {
        b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
      };document.documentElement.appendChild(b);
    } : function (a) {
      n.setTimeout(a, 0);
    };
  };function Ya(a, b) {
    Za || $a();ab || (Za(), ab = !0);bb.push(new cb(a, b));
  }var Za;function $a() {
    if (n.Promise && n.Promise.resolve) {
      var a = n.Promise.resolve();Za = function Za() {
        a.then(db);
      };
    } else Za = function Za() {
      var a = db;!ga(n.setImmediate) || n.Window && n.Window.prototype && n.Window.prototype.setImmediate == n.setImmediate ? (Wa || (Wa = Xa()), Wa(a)) : n.setImmediate(a);
    };
  }var ab = !1,
      bb = [];[].push(function () {
    ab = !1;bb = [];
  });
  function db() {
    for (; bb.length;) {
      var a = bb;bb = [];for (var b = 0; b < a.length; b++) {
        var c = a[b];try {
          c.Vf.call(c.scope);
        } catch (d) {
          Va(d);
        }
      }
    }ab = !1;
  }function cb(a, b) {
    this.Vf = a;this.scope = b;
  };function eb(a, b) {
    this.L = fb;this.tf = void 0;this.Ca = this.Ha = null;this.jd = this.be = !1;if (a == gb) hb(this, ib, b);else try {
      var c = this;a.call(b, function (a) {
        hb(c, ib, a);
      }, function (a) {
        if (!(a instanceof jb)) try {
          if (a instanceof Error) throw a;throw Error("Promise rejected.");
        } catch (b) {}hb(c, kb, a);
      });
    } catch (d) {
      hb(this, kb, d);
    }
  }var fb = 0,
      ib = 2,
      kb = 3;function gb() {}eb.prototype.then = function (a, b, c) {
    return lb(this, ga(a) ? a : null, ga(b) ? b : null, c);
  };eb.prototype.then = eb.prototype.then;eb.prototype.$goog_Thenable = !0;g = eb.prototype;
  g.yg = function (a, b) {
    return lb(this, null, a, b);
  };g.cancel = function (a) {
    this.L == fb && Ya(function () {
      var b = new jb(a);mb(this, b);
    }, this);
  };function mb(a, b) {
    if (a.L == fb) if (a.Ha) {
      var c = a.Ha;if (c.Ca) {
        for (var d = 0, e = -1, f = 0, h; h = c.Ca[f]; f++) {
          if (h = h.m) if (d++, h == a && (e = f), 0 <= e && 1 < d) break;
        }0 <= e && (c.L == fb && 1 == d ? mb(c, b) : (d = c.Ca.splice(e, 1)[0], nb(c, d, kb, b)));
      }a.Ha = null;
    } else hb(a, kb, b);
  }function ob(a, b) {
    a.Ca && a.Ca.length || a.L != ib && a.L != kb || pb(a);a.Ca || (a.Ca = []);a.Ca.push(b);
  }
  function lb(a, b, c, d) {
    var e = { m: null, gf: null, jf: null };e.m = new eb(function (a, h) {
      e.gf = b ? function (c) {
        try {
          var e = b.call(d, c);a(e);
        } catch (l) {
          h(l);
        }
      } : a;e.jf = c ? function (b) {
        try {
          var e = c.call(d, b);!p(e) && b instanceof jb ? h(b) : a(e);
        } catch (l) {
          h(l);
        }
      } : h;
    });e.m.Ha = a;ob(a, e);return e.m;
  }g.Bf = function (a) {
    this.L = fb;hb(this, ib, a);
  };g.Cf = function (a) {
    this.L = fb;hb(this, kb, a);
  };
  function hb(a, b, c) {
    if (a.L == fb) {
      if (a == c) b = kb, c = new TypeError("Promise cannot resolve to itself");else {
        var d;if (c) try {
          d = !!c.$goog_Thenable;
        } catch (e) {
          d = !1;
        } else d = !1;if (d) {
          a.L = 1;c.then(a.Bf, a.Cf, a);return;
        }if (ha(c)) try {
          var f = c.then;if (ga(f)) {
            qb(a, c, f);return;
          }
        } catch (h) {
          b = kb, c = h;
        }
      }a.tf = c;a.L = b;a.Ha = null;pb(a);b != kb || c instanceof jb || rb(a, c);
    }
  }function qb(a, b, c) {
    function d(b) {
      f || (f = !0, a.Cf(b));
    }function e(b) {
      f || (f = !0, a.Bf(b));
    }a.L = 1;var f = !1;try {
      c.call(b, e, d);
    } catch (h) {
      d(h);
    }
  }
  function pb(a) {
    a.be || (a.be = !0, Ya(a.Tf, a));
  }g.Tf = function () {
    for (; this.Ca && this.Ca.length;) {
      var a = this.Ca;this.Ca = null;for (var b = 0; b < a.length; b++) {
        nb(this, a[b], this.L, this.tf);
      }
    }this.be = !1;
  };function nb(a, b, c, d) {
    if (c == ib) b.gf(d);else {
      if (b.m) for (; a && a.jd; a = a.Ha) {
        a.jd = !1;
      }b.jf(d);
    }
  }function rb(a, b) {
    a.jd = !0;Ya(function () {
      a.jd && sb.call(null, b);
    });
  }var sb = Va;function jb(a) {
    Ea.call(this, a);
  }ka(jb, Ea);jb.prototype.name = "cancel";var tb = null,
      ub = null,
      vb = null;function wb(a, b) {
    if (!ea(a)) throw Error("encodeByteArray takes an array as a parameter");xb();for (var c = b ? ub : tb, d = [], e = 0; e < a.length; e += 3) {
      var f = a[e],
          h = e + 1 < a.length,
          k = h ? a[e + 1] : 0,
          m = e + 2 < a.length,
          l = m ? a[e + 2] : 0,
          u = f >> 2,
          f = (f & 3) << 4 | k >> 4,
          k = (k & 15) << 2 | l >> 6,
          l = l & 63;m || (l = 64, h || (k = 64));d.push(c[u], c[f], c[k], c[l]);
    }return d.join("");
  }
  function xb() {
    if (!tb) {
      tb = {};ub = {};vb = {};for (var a = 0; 65 > a; a++) {
        tb[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), ub[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a), vb[ub[a]] = a, 62 <= a && (vb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)] = a);
      }
    }
  };function yb() {
    this.Ya = -1;
  };function zb() {
    this.Ya = -1;this.Ya = 64;this.N = [];this.Wd = [];this.If = [];this.zd = [];this.zd[0] = 128;for (var a = 1; a < this.Ya; ++a) {
      this.zd[a] = 0;
    }this.Pd = this.ac = 0;this.reset();
  }ka(zb, yb);zb.prototype.reset = function () {
    this.N[0] = 1732584193;this.N[1] = 4023233417;this.N[2] = 2562383102;this.N[3] = 271733878;this.N[4] = 3285377520;this.Pd = this.ac = 0;
  };
  function Ab(a, b, c) {
    c || (c = 0);var d = a.If;if (q(b)) for (var e = 0; 16 > e; e++) {
      d[e] = b.charCodeAt(c) << 24 | b.charCodeAt(c + 1) << 16 | b.charCodeAt(c + 2) << 8 | b.charCodeAt(c + 3), c += 4;
    } else for (e = 0; 16 > e; e++) {
      d[e] = b[c] << 24 | b[c + 1] << 16 | b[c + 2] << 8 | b[c + 3], c += 4;
    }for (e = 16; 80 > e; e++) {
      var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];d[e] = (f << 1 | f >>> 31) & 4294967295;
    }b = a.N[0];c = a.N[1];for (var h = a.N[2], k = a.N[3], m = a.N[4], l, e = 0; 80 > e; e++) {
      40 > e ? 20 > e ? (f = k ^ c & (h ^ k), l = 1518500249) : (f = c ^ h ^ k, l = 1859775393) : 60 > e ? (f = c & h | k & (c | h), l = 2400959708) : (f = c ^ h ^ k, l = 3395469782), f = (b << 5 | b >>> 27) + f + m + l + d[e] & 4294967295, m = k, k = h, h = (c << 30 | c >>> 2) & 4294967295, c = b, b = f;
    }a.N[0] = a.N[0] + b & 4294967295;a.N[1] = a.N[1] + c & 4294967295;a.N[2] = a.N[2] + h & 4294967295;a.N[3] = a.N[3] + k & 4294967295;a.N[4] = a.N[4] + m & 4294967295;
  }
  zb.prototype.update = function (a, b) {
    if (null != a) {
      p(b) || (b = a.length);for (var c = b - this.Ya, d = 0, e = this.Wd, f = this.ac; d < b;) {
        if (0 == f) for (; d <= c;) {
          Ab(this, a, d), d += this.Ya;
        }if (q(a)) for (; d < b;) {
          if (e[f] = a.charCodeAt(d), ++f, ++d, f == this.Ya) {
            Ab(this, e);f = 0;break;
          }
        } else for (; d < b;) {
          if (e[f] = a[d], ++f, ++d, f == this.Ya) {
            Ab(this, e);f = 0;break;
          }
        }
      }this.ac = f;this.Pd += b;
    }
  };function x(a, b, c, d) {
    var e;d < b ? e = "at least " + b : d > c && (e = 0 === c ? "none" : "no more than " + c);if (e) throw Error(a + " failed: Was called with " + d + (1 === d ? " argument." : " arguments.") + " Expects " + e + ".");
  }function Bb(a, b, c) {
    var d = "";switch (b) {case 1:
        d = c ? "first" : "First";break;case 2:
        d = c ? "second" : "Second";break;case 3:
        d = c ? "third" : "Third";break;case 4:
        d = c ? "fourth" : "Fourth";break;default:
        throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a = a + " failed: " + (d + " argument ");
  }
  function y(a, b, c, d) {
    if ((!d || p(c)) && !ga(c)) throw Error(Bb(a, b, d) + "must be a valid function.");
  }function Cb(a, b, c) {
    if (p(c) && (!ha(c) || null === c)) throw Error(Bb(a, b, !0) + "must be a valid context object.");
  };var Db = n.Promise || eb;eb.prototype["catch"] = eb.prototype.yg;function Eb() {
    var a = this;this.reject = this.resolve = null;this.ra = new Db(function (b, c) {
      a.resolve = b;a.reject = c;
    });
  }function Fb(a, b) {
    return function (c, d) {
      c ? a.reject(c) : a.resolve(d);ga(b) && (Gb(a.ra), 1 === b.length ? b(c) : b(c, d));
    };
  }function Gb(a) {
    a.then(void 0, aa);
  };function Hb(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }function A(a, b) {
    if (Object.prototype.hasOwnProperty.call(a, b)) return a[b];
  }function Ib(a, b) {
    for (var c in a) {
      Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
    }
  };function Jb(a) {
    var b = [];Ib(a, function (a, d) {
      da(d) ? Ga(d, function (d) {
        b.push(encodeURIComponent(a) + "=" + encodeURIComponent(d));
      }) : b.push(encodeURIComponent(a) + "=" + encodeURIComponent(d));
    });return b.length ? "&" + b.join("&") : "";
  };function Kb(a) {
    return "undefined" !== typeof JSON && p(JSON.parse) ? JSON.parse(a) : wa(a);
  }function B(a) {
    if ("undefined" !== typeof JSON && p(JSON.stringify)) a = JSON.stringify(a);else {
      var b = [];ya(new xa(), a, b);a = b.join("");
    }return a;
  };function Lb(a, b) {
    if (!a) throw Mb(b);
  }function Mb(a) {
    return Error("Firebase Database (" + firebase.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + a);
  };function Nb(a) {
    for (var b = [], c = 0, d = 0; d < a.length; d++) {
      var e = a.charCodeAt(d);55296 <= e && 56319 >= e && (e -= 55296, d++, Lb(d < a.length, "Surrogate pair missing trail surrogate."), e = 65536 + (e << 10) + (a.charCodeAt(d) - 56320));128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (65536 > e ? b[c++] = e >> 12 | 224 : (b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128), b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128);
    }return b;
  }function Ob(a) {
    for (var b = 0, c = 0; c < a.length; c++) {
      var d = a.charCodeAt(c);128 > d ? b++ : 2048 > d ? b += 2 : 55296 <= d && 56319 >= d ? (b += 4, c++) : b += 3;
    }return b;
  };function Pb() {
    return "undefined" !== typeof window && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined" !== typeof navigator && "string" === typeof navigator.userAgent ? navigator.userAgent : "");
  };function Qb(a) {
    this.te = a;this.Bd = [];this.Rb = 0;this.Yd = -1;this.Gb = null;
  }function Rb(a, b, c) {
    a.Yd = b;a.Gb = c;a.Yd < a.Rb && (a.Gb(), a.Gb = null);
  }function Sb(a, b, c) {
    for (a.Bd[b] = c; a.Bd[a.Rb];) {
      var d = a.Bd[a.Rb];delete a.Bd[a.Rb];for (var e = 0; e < d.length; ++e) {
        if (d[e]) {
          var f = a;Tb(function () {
            f.te(d[e]);
          });
        }
      }if (a.Rb === a.Yd) {
        a.Gb && (clearTimeout(a.Gb), a.Gb(), a.Gb = null);break;
      }a.Rb++;
    }
  };function Ub() {
    this.qc = {};
  }Ub.prototype.set = function (a, b) {
    null == b ? delete this.qc[a] : this.qc[a] = b;
  };Ub.prototype.get = function (a) {
    return Hb(this.qc, a) ? this.qc[a] : null;
  };Ub.prototype.remove = function (a) {
    delete this.qc[a];
  };Ub.prototype.bf = !0;function Vb(a) {
    this.vc = a;this.Cd = "firebase:";
  }g = Vb.prototype;g.set = function (a, b) {
    null == b ? this.vc.removeItem(this.Cd + a) : this.vc.setItem(this.Cd + a, B(b));
  };g.get = function (a) {
    a = this.vc.getItem(this.Cd + a);return null == a ? null : Kb(a);
  };g.remove = function (a) {
    this.vc.removeItem(this.Cd + a);
  };g.bf = !1;g.toString = function () {
    return this.vc.toString();
  };function Wb(a) {
    try {
      if ("undefined" !== typeof window && "undefined" !== typeof window[a]) {
        var b = window[a];b.setItem("firebase:sentinel", "cache");b.removeItem("firebase:sentinel");return new Vb(b);
      }
    } catch (c) {}return new Ub();
  }var Xb = Wb("localStorage"),
      Yb = Wb("sessionStorage");function Zb(a, b) {
    this.type = $b;this.source = a;this.path = b;
  }Zb.prototype.Nc = function () {
    return this.path.e() ? new Zb(this.source, C) : new Zb(this.source, D(this.path));
  };Zb.prototype.toString = function () {
    return "Operation(" + this.path + ": " + this.source.toString() + " listen_complete)";
  };function ac(a, b, c) {
    this.type = bc;this.source = a;this.path = b;this.Ja = c;
  }ac.prototype.Nc = function (a) {
    return this.path.e() ? new ac(this.source, C, this.Ja.R(a)) : new ac(this.source, D(this.path), this.Ja);
  };ac.prototype.toString = function () {
    return "Operation(" + this.path + ": " + this.source.toString() + " overwrite: " + this.Ja.toString() + ")";
  };function cc(a, b, c, d, e) {
    this.host = a.toLowerCase();this.domain = this.host.substr(this.host.indexOf(".") + 1);this.Sc = b;this.pe = c;this.Ag = d;this.mf = e || "";this.bb = Xb.get("host:" + a) || this.host;
  }function dc(a, b) {
    b !== a.bb && (a.bb = b, "s-" === a.bb.substr(0, 2) && Xb.set("host:" + a.host, a.bb));
  }
  function ec(a, b, c) {
    E("string" === typeof b, "typeof type must == string");E("object" === (typeof c === "undefined" ? "undefined" : _typeof(c)), "typeof params must == object");if ("websocket" === b) b = (a.Sc ? "wss://" : "ws://") + a.bb + "/.ws?";else if ("long_polling" === b) b = (a.Sc ? "https://" : "http://") + a.bb + "/.lp?";else throw Error("Unknown connection type: " + b);a.host !== a.bb && (c.ns = a.pe);var d = [];t(c, function (a, b) {
      d.push(b + "=" + a);
    });return b + d.join("&");
  }
  cc.prototype.toString = function () {
    var a = (this.Sc ? "https://" : "http://") + this.host;this.mf && (a += "<" + this.mf + ">");return a;
  };function fc() {
    this.Jd = F;
  }fc.prototype.j = function (a) {
    return this.Jd.Q(a);
  };fc.prototype.toString = function () {
    return this.Jd.toString();
  };function H(a, b, c, d) {
    this.type = a;this.Ma = b;this.Za = c;this.qe = d;this.Dd = void 0;
  }function gc(a) {
    return new H(hc, a);
  }var hc = "value";function ic(a, b, c, d) {
    this.ae = b;this.Md = c;this.Dd = d;this.gd = a;
  }ic.prototype.Zb = function () {
    var a = this.Md.xb();return "value" === this.gd ? a.path : a.getParent().path;
  };ic.prototype.ge = function () {
    return this.gd;
  };ic.prototype.Ub = function () {
    return this.ae.Ub(this);
  };ic.prototype.toString = function () {
    return this.Zb().toString() + ":" + this.gd + ":" + B(this.Md.Te());
  };function jc(a, b, c) {
    this.ae = a;this.error = b;this.path = c;
  }jc.prototype.Zb = function () {
    return this.path;
  };jc.prototype.ge = function () {
    return "cancel";
  };
  jc.prototype.Ub = function () {
    return this.ae.Ub(this);
  };jc.prototype.toString = function () {
    return this.path.toString() + ":cancel";
  };function kc() {}kc.prototype.We = function () {
    return null;
  };kc.prototype.fe = function () {
    return null;
  };var lc = new kc();function mc(a, b, c) {
    this.Ff = a;this.Na = b;this.yd = c;
  }mc.prototype.We = function (a) {
    var b = this.Na.O;if (nc(b, a)) return b.j().R(a);b = null != this.yd ? new oc(this.yd, !0, !1) : this.Na.u();return this.Ff.rc(a, b);
  };mc.prototype.fe = function (a, b, c) {
    var d = null != this.yd ? this.yd : pc(this.Na);a = this.Ff.Xd(d, b, 1, c, a);return 0 === a.length ? null : a[0];
  };function qc() {
    this.wb = [];
  }function rc(a, b) {
    for (var c = null, d = 0; d < b.length; d++) {
      var e = b[d],
          f = e.Zb();null === c || f.ca(c.Zb()) || (a.wb.push(c), c = null);null === c && (c = new sc(f));c.add(e);
    }c && a.wb.push(c);
  }function tc(a, b, c) {
    rc(a, c);uc(a, function (a) {
      return a.ca(b);
    });
  }function vc(a, b, c) {
    rc(a, c);uc(a, function (a) {
      return a.contains(b) || b.contains(a);
    });
  }
  function uc(a, b) {
    for (var c = !0, d = 0; d < a.wb.length; d++) {
      var e = a.wb[d];if (e) if (e = e.Zb(), b(e)) {
        for (var e = a.wb[d], f = 0; f < e.hd.length; f++) {
          var h = e.hd[f];if (null !== h) {
            e.hd[f] = null;var k = h.Ub();wc && I("event: " + h.toString());Tb(k);
          }
        }a.wb[d] = null;
      } else c = !1;
    }c && (a.wb = []);
  }function sc(a) {
    this.qa = a;this.hd = [];
  }sc.prototype.add = function (a) {
    this.hd.push(a);
  };sc.prototype.Zb = function () {
    return this.qa;
  };function oc(a, b, c) {
    this.A = a;this.ea = b;this.Tb = c;
  }function xc(a) {
    return a.ea;
  }function yc(a) {
    return a.Tb;
  }function zc(a, b) {
    return b.e() ? a.ea && !a.Tb : nc(a, J(b));
  }function nc(a, b) {
    return a.ea && !a.Tb || a.A.Fa(b);
  }oc.prototype.j = function () {
    return this.A;
  };function Ac(a, b) {
    this.Oa = a;this.ba = b ? b : Bc;
  }g = Ac.prototype;g.Ra = function (a, b) {
    return new Ac(this.Oa, this.ba.Ra(a, b, this.Oa).Y(null, null, !1, null, null));
  };g.remove = function (a) {
    return new Ac(this.Oa, this.ba.remove(a, this.Oa).Y(null, null, !1, null, null));
  };g.get = function (a) {
    for (var b, c = this.ba; !c.e();) {
      b = this.Oa(a, c.key);if (0 === b) return c.value;0 > b ? c = c.left : 0 < b && (c = c.right);
    }return null;
  };
  function Cc(a, b) {
    for (var c, d = a.ba, e = null; !d.e();) {
      c = a.Oa(b, d.key);if (0 === c) {
        if (d.left.e()) return e ? e.key : null;for (d = d.left; !d.right.e();) {
          d = d.right;
        }return d.key;
      }0 > c ? d = d.left : 0 < c && (e = d, d = d.right);
    }throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
  }g.e = function () {
    return this.ba.e();
  };g.count = function () {
    return this.ba.count();
  };g.Hc = function () {
    return this.ba.Hc();
  };g.fc = function () {
    return this.ba.fc();
  };g.ia = function (a) {
    return this.ba.ia(a);
  };
  g.Xb = function (a) {
    return new Dc(this.ba, null, this.Oa, !1, a);
  };g.Yb = function (a, b) {
    return new Dc(this.ba, a, this.Oa, !1, b);
  };g.$b = function (a, b) {
    return new Dc(this.ba, a, this.Oa, !0, b);
  };g.Ze = function (a) {
    return new Dc(this.ba, null, this.Oa, !0, a);
  };function Dc(a, b, c, d, e) {
    this.Hd = e || null;this.le = d;this.Sa = [];for (e = 1; !a.e();) {
      if (e = b ? c(a.key, b) : 1, d && (e *= -1), 0 > e) a = this.le ? a.left : a.right;else if (0 === e) {
        this.Sa.push(a);break;
      } else this.Sa.push(a), a = this.le ? a.right : a.left;
    }
  }
  function K(a) {
    if (0 === a.Sa.length) return null;var b = a.Sa.pop(),
        c;c = a.Hd ? a.Hd(b.key, b.value) : { key: b.key, value: b.value };if (a.le) for (b = b.left; !b.e();) {
      a.Sa.push(b), b = b.right;
    } else for (b = b.right; !b.e();) {
      a.Sa.push(b), b = b.left;
    }return c;
  }function Ec(a) {
    if (0 === a.Sa.length) return null;var b;b = a.Sa;b = b[b.length - 1];return a.Hd ? a.Hd(b.key, b.value) : { key: b.key, value: b.value };
  }function Fc(a, b, c, d, e) {
    this.key = a;this.value = b;this.color = null != c ? c : !0;this.left = null != d ? d : Bc;this.right = null != e ? e : Bc;
  }g = Fc.prototype;
  g.Y = function (a, b, c, d, e) {
    return new Fc(null != a ? a : this.key, null != b ? b : this.value, null != c ? c : this.color, null != d ? d : this.left, null != e ? e : this.right);
  };g.count = function () {
    return this.left.count() + 1 + this.right.count();
  };g.e = function () {
    return !1;
  };g.ia = function (a) {
    return this.left.ia(a) || a(this.key, this.value) || this.right.ia(a);
  };function Gc(a) {
    return a.left.e() ? a : Gc(a.left);
  }g.Hc = function () {
    return Gc(this).key;
  };g.fc = function () {
    return this.right.e() ? this.key : this.right.fc();
  };
  g.Ra = function (a, b, c) {
    var d, e;e = this;d = c(a, e.key);e = 0 > d ? e.Y(null, null, null, e.left.Ra(a, b, c), null) : 0 === d ? e.Y(null, b, null, null, null) : e.Y(null, null, null, null, e.right.Ra(a, b, c));return Hc(e);
  };function Ic(a) {
    if (a.left.e()) return Bc;a.left.fa() || a.left.left.fa() || (a = Jc(a));a = a.Y(null, null, null, Ic(a.left), null);return Hc(a);
  }
  g.remove = function (a, b) {
    var c, d;c = this;if (0 > b(a, c.key)) c.left.e() || c.left.fa() || c.left.left.fa() || (c = Jc(c)), c = c.Y(null, null, null, c.left.remove(a, b), null);else {
      c.left.fa() && (c = Kc(c));c.right.e() || c.right.fa() || c.right.left.fa() || (c = Lc(c), c.left.left.fa() && (c = Kc(c), c = Lc(c)));if (0 === b(a, c.key)) {
        if (c.right.e()) return Bc;d = Gc(c.right);c = c.Y(d.key, d.value, null, null, Ic(c.right));
      }c = c.Y(null, null, null, null, c.right.remove(a, b));
    }return Hc(c);
  };g.fa = function () {
    return this.color;
  };
  function Hc(a) {
    a.right.fa() && !a.left.fa() && (a = Mc(a));a.left.fa() && a.left.left.fa() && (a = Kc(a));a.left.fa() && a.right.fa() && (a = Lc(a));return a;
  }function Jc(a) {
    a = Lc(a);a.right.left.fa() && (a = a.Y(null, null, null, null, Kc(a.right)), a = Mc(a), a = Lc(a));return a;
  }function Mc(a) {
    return a.right.Y(null, null, a.color, a.Y(null, null, !0, null, a.right.left), null);
  }function Kc(a) {
    return a.left.Y(null, null, a.color, null, a.Y(null, null, !0, a.left.right, null));
  }
  function Lc(a) {
    return a.Y(null, null, !a.color, a.left.Y(null, null, !a.left.color, null, null), a.right.Y(null, null, !a.right.color, null, null));
  }function Nc() {}g = Nc.prototype;g.Y = function () {
    return this;
  };g.Ra = function (a, b) {
    return new Fc(a, b, null);
  };g.remove = function () {
    return this;
  };g.count = function () {
    return 0;
  };g.e = function () {
    return !0;
  };g.ia = function () {
    return !1;
  };g.Hc = function () {
    return null;
  };g.fc = function () {
    return null;
  };g.fa = function () {
    return !1;
  };var Bc = new Nc();var Oc = function () {
    var a = 1;return function () {
      return a++;
    };
  }(),
      E = Lb,
      Pc = Mb;
  function Qc(a) {
    try {
      var b;if ("undefined" !== typeof atob) b = atob(a);else {
        xb();for (var c = vb, d = [], e = 0; e < a.length;) {
          var f = c[a.charAt(e++)],
              h = e < a.length ? c[a.charAt(e)] : 0;++e;var k = e < a.length ? c[a.charAt(e)] : 64;++e;var m = e < a.length ? c[a.charAt(e)] : 64;++e;if (null == f || null == h || null == k || null == m) throw Error();d.push(f << 2 | h >> 4);64 != k && (d.push(h << 4 & 240 | k >> 2), 64 != m && d.push(k << 6 & 192 | m));
        }if (8192 > d.length) b = String.fromCharCode.apply(null, d);else {
          a = "";for (c = 0; c < d.length; c += 8192) {
            a += String.fromCharCode.apply(null, Oa(d, c, c + 8192));
          }b = a;
        }
      }return b;
    } catch (l) {
      I("base64Decode failed: ", l);
    }return null;
  }function Rc(a) {
    var b = Nb(a);a = new zb();a.update(b);var b = [],
        c = 8 * a.Pd;56 > a.ac ? a.update(a.zd, 56 - a.ac) : a.update(a.zd, a.Ya - (a.ac - 56));for (var d = a.Ya - 1; 56 <= d; d--) {
      a.Wd[d] = c & 255, c /= 256;
    }Ab(a, a.Wd);for (d = c = 0; 5 > d; d++) {
      for (var e = 24; 0 <= e; e -= 8) {
        b[c] = a.N[d] >> e & 255, ++c;
      }
    }return wb(b);
  }
  function Sc(a) {
    for (var b = "", c = 0; c < arguments.length; c++) {
      b = ea(arguments[c]) ? b + Sc.apply(null, arguments[c]) : "object" === _typeof(arguments[c]) ? b + B(arguments[c]) : b + arguments[c], b += " ";
    }return b;
  }var wc = null,
      Tc = !0;
  function Uc(a, b) {
    Lb(!b || !0 === a || !1 === a, "Can't turn on custom loggers persistently.");!0 === a ? ("undefined" !== typeof console && ("function" === typeof console.log ? wc = r(console.log, console) : "object" === _typeof(console.log) && (wc = function wc(a) {
      console.log(a);
    })), b && Yb.set("logging_enabled", !0)) : ga(a) ? wc = a : (wc = null, Yb.remove("logging_enabled"));
  }function I(a) {
    !0 === Tc && (Tc = !1, null === wc && !0 === Yb.get("logging_enabled") && Uc(!0));if (wc) {
      var b = Sc.apply(null, arguments);wc(b);
    }
  }
  function Vc(a) {
    return function () {
      I(a, arguments);
    };
  }function Wc(a) {
    if ("undefined" !== typeof console) {
      var b = "FIREBASE INTERNAL ERROR: " + Sc.apply(null, arguments);"undefined" !== typeof console.error ? console.error(b) : console.log(b);
    }
  }function Xc(a) {
    var b = Sc.apply(null, arguments);throw Error("FIREBASE FATAL ERROR: " + b);
  }function L(a) {
    if ("undefined" !== typeof console) {
      var b = "FIREBASE WARNING: " + Sc.apply(null, arguments);"undefined" !== typeof console.warn ? console.warn(b) : console.log(b);
    }
  }
  function Yc(a) {
    var b,
        c,
        d,
        e,
        f,
        h = a;f = c = a = b = "";d = !0;e = "https";if (q(h)) {
      var k = h.indexOf("//");0 <= k && (e = h.substring(0, k - 1), h = h.substring(k + 2));k = h.indexOf("/");-1 === k && (k = h.length);b = h.substring(0, k);f = "";h = h.substring(k).split("/");for (k = 0; k < h.length; k++) {
        if (0 < h[k].length) {
          var m = h[k];try {
            m = decodeURIComponent(m.replace(/\+/g, " "));
          } catch (l) {}f += "/" + m;
        }
      }h = b.split(".");3 === h.length ? (a = h[1], c = h[0].toLowerCase()) : 2 === h.length && (a = h[0]);k = b.indexOf(":");0 <= k && (d = "https" === e || "wss" === e);
    }"firebase" === a && Xc(b + " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
    c && "undefined" != c || Xc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d || "undefined" !== typeof window && window.location && window.location.protocol && -1 !== window.location.protocol.indexOf("https:") && L("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");return { kc: new cc(b, d, c, "ws" === e || "wss" === e), path: new M(f) };
  }function Zc(a) {
    return fa(a) && (a != a || a == Number.POSITIVE_INFINITY || a == Number.NEGATIVE_INFINITY);
  }
  function $c(a) {
    if ("complete" === document.readyState) a();else {
      var b = !1,
          c = function c() {
        document.body ? b || (b = !0, a()) : setTimeout(c, Math.floor(10));
      };document.addEventListener ? (document.addEventListener("DOMContentLoaded", c, !1), window.addEventListener("load", c, !1)) : document.attachEvent && (document.attachEvent("onreadystatechange", function () {
        "complete" === document.readyState && c();
      }), window.attachEvent("onload", c));
    }
  }
  function ad(a, b) {
    if (a === b) return 0;if ("[MIN_NAME]" === a || "[MAX_NAME]" === b) return -1;if ("[MIN_NAME]" === b || "[MAX_NAME]" === a) return 1;var c = bd(a),
        d = bd(b);return null !== c ? null !== d ? 0 == c - d ? a.length - b.length : c - d : -1 : null !== d ? 1 : a < b ? -1 : 1;
  }function cd(a, b) {
    if (b && a in b) return b[a];throw Error("Missing required key (" + a + ") in object: " + B(b));
  }
  function dd(a) {
    if ("object" !== (typeof a === "undefined" ? "undefined" : _typeof(a)) || null === a) return B(a);var b = [],
        c;for (c in a) {
      b.push(c);
    }b.sort();c = "{";for (var d = 0; d < b.length; d++) {
      0 !== d && (c += ","), c += B(b[d]), c += ":", c += dd(a[b[d]]);
    }return c + "}";
  }function ed(a, b) {
    if (a.length <= b) return [a];for (var c = [], d = 0; d < a.length; d += b) {
      d + b > a ? c.push(a.substring(d, a.length)) : c.push(a.substring(d, d + b));
    }return c;
  }function fd(a, b) {
    if (da(a)) for (var c = 0; c < a.length; ++c) {
      b(c, a[c]);
    } else t(a, b);
  }
  function gd(a) {
    E(!Zc(a), "Invalid JSON number");var b, c, d, e;0 === a ? (d = c = 0, b = -Infinity === 1 / a ? 1 : 0) : (b = 0 > a, a = Math.abs(a), a >= Math.pow(2, -1022) ? (d = Math.min(Math.floor(Math.log(a) / Math.LN2), 1023), c = d + 1023, d = Math.round(a * Math.pow(2, 52 - d) - Math.pow(2, 52))) : (c = 0, d = Math.round(a / Math.pow(2, -1074))));e = [];for (a = 52; a; --a) {
      e.push(d % 2 ? 1 : 0), d = Math.floor(d / 2);
    }for (a = 11; a; --a) {
      e.push(c % 2 ? 1 : 0), c = Math.floor(c / 2);
    }e.push(b ? 1 : 0);e.reverse();b = e.join("");c = "";for (a = 0; 64 > a; a += 8) {
      d = parseInt(b.substr(a, 8), 2).toString(16), 1 === d.length && (d = "0" + d), c += d;
    }return c.toLowerCase();
  }var hd = /^-?\d{1,10}$/;function bd(a) {
    return hd.test(a) && (a = Number(a), -2147483648 <= a && 2147483647 >= a) ? a : null;
  }function Tb(a) {
    try {
      a();
    } catch (b) {
      setTimeout(function () {
        L("Exception was thrown by user callback.", b.stack || "");throw b;
      }, Math.floor(0));
    }
  }function id(a, b, c) {
    Object.defineProperty(a, b, { get: c });
  };function jd(a) {
    var b = {};try {
      var c = a.split(".");Kb(Qc(c[0]) || "");b = Kb(Qc(c[1]) || "");delete b.d;
    } catch (d) {}a = b;return "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && !0 === A(a, "admin");
  };function kd(a, b, c) {
    this.type = ld;this.source = a;this.path = b;this.children = c;
  }kd.prototype.Nc = function (a) {
    if (this.path.e()) return a = this.children.subtree(new M(a)), a.e() ? null : a.value ? new ac(this.source, C, a.value) : new kd(this.source, C, a);E(J(this.path) === a, "Can't get a merge for a child not on the path of the operation");return new kd(this.source, D(this.path), this.children);
  };kd.prototype.toString = function () {
    return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")";
  };function md(a) {
    this.g = a;
  }g = md.prototype;g.F = function (a, b, c, d, e, f) {
    E(a.zc(this.g), "A node must be indexed if only a child is updated");e = a.R(b);if (e.Q(d).ca(c.Q(d)) && e.e() == c.e()) return a;null != f && (c.e() ? a.Fa(b) ? nd(f, new H("child_removed", e, b)) : E(a.J(), "A child remove without an old child only makes sense on a leaf node") : e.e() ? nd(f, new H("child_added", c, b)) : nd(f, new H("child_changed", c, b, e)));return a.J() && c.e() ? a : a.U(b, c).ob(this.g);
  };
  g.za = function (a, b, c) {
    null != c && (a.J() || a.P(N, function (a, e) {
      b.Fa(a) || nd(c, new H("child_removed", e, a));
    }), b.J() || b.P(N, function (b, e) {
      if (a.Fa(b)) {
        var f = a.R(b);f.ca(e) || nd(c, new H("child_changed", e, b, f));
      } else nd(c, new H("child_added", e, b));
    }));return b.ob(this.g);
  };g.ga = function (a, b) {
    return a.e() ? F : a.ga(b);
  };g.Qa = function () {
    return !1;
  };g.Vb = function () {
    return this;
  };function od(a) {
    this.he = new md(a.g);this.g = a.g;var b;a.ka ? (b = pd(a), b = a.g.Fc(qd(a), b)) : b = a.g.Ic();this.Uc = b;a.na ? (b = rd(a), a = a.g.Fc(sd(a), b)) : a = a.g.Gc();this.wc = a;
  }g = od.prototype;g.matches = function (a) {
    return 0 >= this.g.compare(this.Uc, a) && 0 >= this.g.compare(a, this.wc);
  };g.F = function (a, b, c, d, e, f) {
    this.matches(new O(b, c)) || (c = F);return this.he.F(a, b, c, d, e, f);
  };
  g.za = function (a, b, c) {
    b.J() && (b = F);var d = b.ob(this.g),
        d = d.ga(F),
        e = this;b.P(N, function (a, b) {
      e.matches(new O(a, b)) || (d = d.U(a, F));
    });return this.he.za(a, d, c);
  };g.ga = function (a) {
    return a;
  };g.Qa = function () {
    return !0;
  };g.Vb = function () {
    return this.he;
  };function td() {
    this.hb = {};
  }
  function nd(a, b) {
    var c = b.type,
        d = b.Za;E("child_added" == c || "child_changed" == c || "child_removed" == c, "Only child changes supported for tracking");E(".priority" !== d, "Only non-priority child changes can be tracked.");var e = A(a.hb, d);if (e) {
      var f = e.type;if ("child_added" == c && "child_removed" == f) a.hb[d] = new H("child_changed", b.Ma, d, e.Ma);else if ("child_removed" == c && "child_added" == f) delete a.hb[d];else if ("child_removed" == c && "child_changed" == f) a.hb[d] = new H("child_removed", e.qe, d);else if ("child_changed" == c && "child_added" == f) a.hb[d] = new H("child_added", b.Ma, d);else if ("child_changed" == c && "child_changed" == f) a.hb[d] = new H("child_changed", b.Ma, d, e.qe);else throw Pc("Illegal combination of changes: " + b + " occurred after " + e);
    } else a.hb[d] = b;
  };function ud(a, b) {
    this.Sd = a;this.Lf = b;
  }function vd(a) {
    this.V = a;
  }
  vd.prototype.gb = function (a, b, c, d) {
    var e = new td(),
        f;if (b.type === bc) b.source.ee ? c = wd(this, a, b.path, b.Ja, c, d, e) : (E(b.source.Ve, "Unknown source."), f = b.source.Ee || yc(a.u()) && !b.path.e(), c = xd(this, a, b.path, b.Ja, c, d, f, e));else if (b.type === ld) b.source.ee ? c = yd(this, a, b.path, b.children, c, d, e) : (E(b.source.Ve, "Unknown source."), f = b.source.Ee || yc(a.u()), c = zd(this, a, b.path, b.children, c, d, f, e));else if (b.type === Ad) {
      if (b.Id) {
        if (b = b.path, null != c.mc(b)) c = a;else {
          f = new mc(c, a, d);d = a.O.j();if (b.e() || ".priority" === J(b)) xc(a.u()) ? b = c.Ba(pc(a)) : (b = a.u().j(), E(b instanceof P, "serverChildren would be complete if leaf node"), b = c.sc(b)), b = this.V.za(d, b, e);else {
            var h = J(b),
                k = c.rc(h, a.u());null == k && nc(a.u(), h) && (k = d.R(h));b = null != k ? this.V.F(d, h, k, D(b), f, e) : a.O.j().Fa(h) ? this.V.F(d, h, F, D(b), f, e) : d;b.e() && xc(a.u()) && (d = c.Ba(pc(a)), d.J() && (b = this.V.za(b, d, e)));
          }d = xc(a.u()) || null != c.mc(C);c = Cd(a, b, d, this.V.Qa());
        }
      } else c = Dd(this, a, b.path, b.Pb, c, d, e);
    } else if (b.type === $b) d = b.path, b = a.u(), f = b.j(), h = b.ea || d.e(), c = Ed(this, new Fd(a.O, new oc(f, h, b.Tb)), d, c, lc, e);else throw Pc("Unknown operation type: " + b.type);e = pa(e.hb);d = c;b = d.O;b.ea && (f = b.j().J() || b.j().e(), h = Gd(a), (0 < e.length || !a.O.ea || f && !b.j().ca(h) || !b.j().C().ca(h.C())) && e.push(gc(Gd(d))));return new ud(c, e);
  };
  function Ed(a, b, c, d, e, f) {
    var h = b.O;if (null != d.mc(c)) return b;var k;if (c.e()) E(xc(b.u()), "If change path is empty, we must have complete server data"), yc(b.u()) ? (e = pc(b), d = d.sc(e instanceof P ? e : F)) : d = d.Ba(pc(b)), f = a.V.za(b.O.j(), d, f);else {
      var m = J(c);if (".priority" == m) E(1 == Hd(c), "Can't have a priority with additional path components"), f = h.j(), k = b.u().j(), d = d.$c(c, f, k), f = null != d ? a.V.ga(f, d) : h.j();else {
        var l = D(c);nc(h, m) ? (k = b.u().j(), d = d.$c(c, h.j(), k), d = null != d ? h.j().R(m).F(l, d) : h.j().R(m)) : d = d.rc(m, b.u());f = null != d ? a.V.F(h.j(), m, d, l, e, f) : h.j();
      }
    }return Cd(b, f, h.ea || c.e(), a.V.Qa());
  }function xd(a, b, c, d, e, f, h, k) {
    var m = b.u();h = h ? a.V : a.V.Vb();if (c.e()) d = h.za(m.j(), d, null);else if (h.Qa() && !m.Tb) d = m.j().F(c, d), d = h.za(m.j(), d, null);else {
      var l = J(c);if (!zc(m, c) && 1 < Hd(c)) return b;var u = D(c);d = m.j().R(l).F(u, d);d = ".priority" == l ? h.ga(m.j(), d) : h.F(m.j(), l, d, u, lc, null);
    }m = m.ea || c.e();b = new Fd(b.O, new oc(d, m, h.Qa()));return Ed(a, b, c, e, new mc(e, b, f), k);
  }
  function wd(a, b, c, d, e, f, h) {
    var k = b.O;e = new mc(e, b, f);if (c.e()) h = a.V.za(b.O.j(), d, h), a = Cd(b, h, !0, a.V.Qa());else if (f = J(c), ".priority" === f) h = a.V.ga(b.O.j(), d), a = Cd(b, h, k.ea, k.Tb);else {
      c = D(c);var m = k.j().R(f);if (!c.e()) {
        var l = e.We(f);d = null != l ? ".priority" === Id(c) && l.Q(c.parent()).e() ? l : l.F(c, d) : F;
      }m.ca(d) ? a = b : (h = a.V.F(k.j(), f, d, c, e, h), a = Cd(b, h, k.ea, a.V.Qa()));
    }return a;
  }
  function yd(a, b, c, d, e, f, h) {
    var k = b;Jd(d, function (d, l) {
      var u = c.m(d);nc(b.O, J(u)) && (k = wd(a, k, u, l, e, f, h));
    });Jd(d, function (d, l) {
      var u = c.m(d);nc(b.O, J(u)) || (k = wd(a, k, u, l, e, f, h));
    });return k;
  }function Kd(a, b) {
    Jd(b, function (b, d) {
      a = a.F(b, d);
    });return a;
  }
  function zd(a, b, c, d, e, f, h, k) {
    if (b.u().j().e() && !xc(b.u())) return b;var m = b;c = c.e() ? d : Ld(Q, c, d);var l = b.u().j();c.children.ia(function (c, d) {
      if (l.Fa(c)) {
        var G = b.u().j().R(c),
            G = Kd(G, d);m = xd(a, m, new M(c), G, e, f, h, k);
      }
    });c.children.ia(function (c, d) {
      var G = !nc(b.u(), c) && null == d.value;l.Fa(c) || G || (G = b.u().j().R(c), G = Kd(G, d), m = xd(a, m, new M(c), G, e, f, h, k));
    });return m;
  }
  function Dd(a, b, c, d, e, f, h) {
    if (null != e.mc(c)) return b;var k = yc(b.u()),
        m = b.u();if (null != d.value) {
      if (c.e() && m.ea || zc(m, c)) return xd(a, b, c, m.j().Q(c), e, f, k, h);if (c.e()) {
        var l = Q;m.j().P(Md, function (a, b) {
          l = l.set(new M(a), b);
        });return zd(a, b, c, l, e, f, k, h);
      }return b;
    }l = Q;Jd(d, function (a) {
      var b = c.m(a);zc(m, b) && (l = l.set(a, m.j().Q(b)));
    });return zd(a, b, c, l, e, f, k, h);
  };var Nd = function () {
    var a = 0,
        b = [];return function (c) {
      var d = c === a;a = c;for (var e = Array(8), f = 7; 0 <= f; f--) {
        e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64), c = Math.floor(c / 64);
      }E(0 === c, "Cannot push at time == 0");c = e.join("");if (d) {
        for (f = 11; 0 <= f && 63 === b[f]; f--) {
          b[f] = 0;
        }b[f]++;
      } else for (f = 0; 12 > f; f++) {
        b[f] = Math.floor(64 * Math.random());
      }for (f = 0; 12 > f; f++) {
        c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
      }E(20 === c.length, "nextPushId: Length should be 20.");
      return c;
    };
  }();function M(a, b) {
    if (1 == arguments.length) {
      this.o = a.split("/");for (var c = 0, d = 0; d < this.o.length; d++) {
        0 < this.o[d].length && (this.o[c] = this.o[d], c++);
      }this.o.length = c;this.Z = 0;
    } else this.o = a, this.Z = b;
  }function R(a, b) {
    var c = J(a);if (null === c) return b;if (c === J(b)) return R(D(a), D(b));throw Error("INTERNAL ERROR: innerPath (" + b + ") is not within outerPath (" + a + ")");
  }
  function Od(a, b) {
    for (var c = a.slice(), d = b.slice(), e = 0; e < c.length && e < d.length; e++) {
      var f = ad(c[e], d[e]);if (0 !== f) return f;
    }return c.length === d.length ? 0 : c.length < d.length ? -1 : 1;
  }function J(a) {
    return a.Z >= a.o.length ? null : a.o[a.Z];
  }function Hd(a) {
    return a.o.length - a.Z;
  }function D(a) {
    var b = a.Z;b < a.o.length && b++;return new M(a.o, b);
  }function Id(a) {
    return a.Z < a.o.length ? a.o[a.o.length - 1] : null;
  }g = M.prototype;
  g.toString = function () {
    for (var a = "", b = this.Z; b < this.o.length; b++) {
      "" !== this.o[b] && (a += "/" + this.o[b]);
    }return a || "/";
  };g.slice = function (a) {
    return this.o.slice(this.Z + (a || 0));
  };g.parent = function () {
    if (this.Z >= this.o.length) return null;for (var a = [], b = this.Z; b < this.o.length - 1; b++) {
      a.push(this.o[b]);
    }return new M(a, 0);
  };
  g.m = function (a) {
    for (var b = [], c = this.Z; c < this.o.length; c++) {
      b.push(this.o[c]);
    }if (a instanceof M) for (c = a.Z; c < a.o.length; c++) {
      b.push(a.o[c]);
    } else for (a = a.split("/"), c = 0; c < a.length; c++) {
      0 < a[c].length && b.push(a[c]);
    }return new M(b, 0);
  };g.e = function () {
    return this.Z >= this.o.length;
  };g.ca = function (a) {
    if (Hd(this) !== Hd(a)) return !1;for (var b = this.Z, c = a.Z; b <= this.o.length; b++, c++) {
      if (this.o[b] !== a.o[c]) return !1;
    }return !0;
  };
  g.contains = function (a) {
    var b = this.Z,
        c = a.Z;if (Hd(this) > Hd(a)) return !1;for (; b < this.o.length;) {
      if (this.o[b] !== a.o[c]) return !1;++b;++c;
    }return !0;
  };var C = new M("");function Pd(a, b) {
    this.Ta = a.slice();this.Ka = Math.max(1, this.Ta.length);this.Se = b;for (var c = 0; c < this.Ta.length; c++) {
      this.Ka += Ob(this.Ta[c]);
    }Qd(this);
  }Pd.prototype.push = function (a) {
    0 < this.Ta.length && (this.Ka += 1);this.Ta.push(a);this.Ka += Ob(a);Qd(this);
  };Pd.prototype.pop = function () {
    var a = this.Ta.pop();this.Ka -= Ob(a);0 < this.Ta.length && --this.Ka;
  };
  function Qd(a) {
    if (768 < a.Ka) throw Error(a.Se + "has a key path longer than 768 bytes (" + a.Ka + ").");if (32 < a.Ta.length) throw Error(a.Se + "path specified exceeds the maximum depth that can be written (32) or object contains a cycle " + Rd(a));
  }function Rd(a) {
    return 0 == a.Ta.length ? "" : "in property '" + a.Ta.join(".") + "'";
  };var Sd = /[\[\].#$\/\u0000-\u001F\u007F]/,
      Td = /[\[\].#$\u0000-\u001F\u007F]/;function Ud(a) {
    return q(a) && 0 !== a.length && !Sd.test(a);
  }function Vd(a) {
    return null === a || q(a) || fa(a) && !Zc(a) || ha(a) && Hb(a, ".sv");
  }function Wd(a, b, c, d) {
    d && !p(b) || Xd(Bb(a, 1, d), b, c);
  }
  function Xd(a, b, c) {
    c instanceof M && (c = new Pd(c, a));if (!p(b)) throw Error(a + "contains undefined " + Rd(c));if (ga(b)) throw Error(a + "contains a function " + Rd(c) + " with contents: " + b.toString());if (Zc(b)) throw Error(a + "contains " + b.toString() + " " + Rd(c));if (q(b) && b.length > 10485760 / 3 && 10485760 < Ob(b)) throw Error(a + "contains a string greater than 10485760 utf8 bytes " + Rd(c) + " ('" + b.substring(0, 50) + "...')");if (ha(b)) {
      var d = !1,
          e = !1;Ib(b, function (b, h) {
        if (".value" === b) d = !0;else if (".priority" !== b && ".sv" !== b && (e = !0, !Ud(b))) throw Error(a + " contains an invalid key (" + b + ") " + Rd(c) + '.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Xd(a, h, c);c.pop();
      });if (d && e) throw Error(a + ' contains ".value" child ' + Rd(c) + " in addition to actual children.");
    }
  }
  function Yd(a, b) {
    var c, d;for (c = 0; c < b.length; c++) {
      d = b[c];for (var e = d.slice(), f = 0; f < e.length; f++) {
        if ((".priority" !== e[f] || f !== e.length - 1) && !Ud(e[f])) throw Error(a + "contains an invalid key (" + e[f] + ") in path " + d.toString() + '. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');
      }
    }b.sort(Od);e = null;for (c = 0; c < b.length; c++) {
      d = b[c];if (null !== e && e.contains(d)) throw Error(a + "contains a path " + e.toString() + " that is ancestor of another path " + d.toString());e = d;
    }
  }
  function Zd(a, b, c) {
    var d = Bb(a, 1, !1);if (!ha(b) || da(b)) throw Error(d + " must be an object containing the children to replace.");var e = [];Ib(b, function (a, b) {
      var k = new M(a);Xd(d, b, c.m(k));if (".priority" === Id(k) && !Vd(b)) throw Error(d + "contains an invalid value for '" + k.toString() + "', which must be a valid Firebase priority (a string, finite number, server value, or null).");e.push(k);
    });Yd(d, e);
  }
  function $d(a, b, c) {
    if (Zc(c)) throw Error(Bb(a, b, !1) + "is " + c.toString() + ", but must be a valid Firebase priority (a string, finite number, server value, or null).");if (!Vd(c)) throw Error(Bb(a, b, !1) + "must be a valid Firebase priority (a string, finite number, server value, or null).");
  }
  function ae(a, b, c) {
    if (!c || p(b)) switch (b) {case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":
        break;default:
        throw Error(Bb(a, 1, c) + 'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}
  }function be(a, b) {
    if (p(b) && !Ud(b)) throw Error(Bb(a, 2, !0) + 'was an invalid key: "' + b + '".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');
  }
  function ce(a, b) {
    if (!q(b) || 0 === b.length || Td.test(b)) throw Error(Bb(a, 1, !1) + 'was an invalid path: "' + b + '". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');
  }function de(a, b) {
    if (".info" === J(b)) throw Error(a + " failed: Can't modify data under /.info/");
  }
  function ee(a, b) {
    var c = b.path.toString(),
        d;!(d = !q(b.kc.host) || 0 === b.kc.host.length || !Ud(b.kc.pe)) && (d = 0 !== c.length) && (c && (c = c.replace(/^\/*\.info(\/|$)/, "/")), d = !(q(c) && 0 !== c.length && !Td.test(c)));if (d) throw Error(Bb(a, 1, !1) + 'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');
  };function fe() {
    this.children = {};this.ad = 0;this.value = null;
  }function ge(a, b, c) {
    this.ud = a ? a : "";this.Ha = b ? b : null;this.A = c ? c : new fe();
  }function he(a, b) {
    for (var c = b instanceof M ? b : new M(b), d = a, e; null !== (e = J(c));) {
      d = new ge(e, d, A(d.A.children, e) || new fe()), c = D(c);
    }return d;
  }g = ge.prototype;g.Ea = function () {
    return this.A.value;
  };function ie(a, b) {
    E("undefined" !== typeof b, "Cannot set value to undefined");a.A.value = b;je(a);
  }g.clear = function () {
    this.A.value = null;this.A.children = {};this.A.ad = 0;je(this);
  };
  g.kd = function () {
    return 0 < this.A.ad;
  };g.e = function () {
    return null === this.Ea() && !this.kd();
  };g.P = function (a) {
    var b = this;t(this.A.children, function (c, d) {
      a(new ge(d, b, c));
    });
  };function ke(a, b, c, d) {
    c && !d && b(a);a.P(function (a) {
      ke(a, b, !0, d);
    });c && d && b(a);
  }function le(a, b) {
    for (var c = a.parent(); null !== c && !b(c);) {
      c = c.parent();
    }
  }g.path = function () {
    return new M(null === this.Ha ? this.ud : this.Ha.path() + "/" + this.ud);
  };g.name = function () {
    return this.ud;
  };g.parent = function () {
    return this.Ha;
  };
  function je(a) {
    if (null !== a.Ha) {
      var b = a.Ha,
          c = a.ud,
          d = a.e(),
          e = Hb(b.A.children, c);d && e ? (delete b.A.children[c], b.A.ad--, je(b)) : d || e || (b.A.children[c] = a.A, b.A.ad++, je(b));
    }
  };function me(a) {
    E(da(a) && 0 < a.length, "Requires a non-empty array");this.Jf = a;this.Ec = {};
  }me.prototype.Ge = function (a, b) {
    var c;c = this.Ec[a] || [];var d = c.length;if (0 < d) {
      for (var e = Array(d), f = 0; f < d; f++) {
        e[f] = c[f];
      }c = e;
    } else c = [];for (d = 0; d < c.length; d++) {
      c[d].Ke.apply(c[d].Pa, Array.prototype.slice.call(arguments, 1));
    }
  };me.prototype.hc = function (a, b, c) {
    ne(this, a);this.Ec[a] = this.Ec[a] || [];this.Ec[a].push({ Ke: b, Pa: c });(a = this.Xe(a)) && b.apply(c, a);
  };
  me.prototype.Jc = function (a, b, c) {
    ne(this, a);a = this.Ec[a] || [];for (var d = 0; d < a.length; d++) {
      if (a[d].Ke === b && (!c || c === a[d].Pa)) {
        a.splice(d, 1);break;
      }
    }
  };function ne(a, b) {
    E(La(a.Jf, function (a) {
      return a === b;
    }), "Unknown event: " + b);
  };function oe(a, b) {
    this.value = a;this.children = b || pe;
  }var pe = new Ac(function (a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
  });function qe(a) {
    var b = Q;t(a, function (a, d) {
      b = b.set(new M(d), a);
    });return b;
  }g = oe.prototype;g.e = function () {
    return null === this.value && this.children.e();
  };function re(a, b, c) {
    if (null != a.value && c(a.value)) return { path: C, value: a.value };if (b.e()) return null;var d = J(b);a = a.children.get(d);return null !== a ? (b = re(a, D(b), c), null != b ? { path: new M(d).m(b.path), value: b.value } : null) : null;
  }
  function se(a, b) {
    return re(a, b, function () {
      return !0;
    });
  }g.subtree = function (a) {
    if (a.e()) return this;var b = this.children.get(J(a));return null !== b ? b.subtree(D(a)) : Q;
  };g.set = function (a, b) {
    if (a.e()) return new oe(b, this.children);var c = J(a),
        d = (this.children.get(c) || Q).set(D(a), b),
        c = this.children.Ra(c, d);return new oe(this.value, c);
  };
  g.remove = function (a) {
    if (a.e()) return this.children.e() ? Q : new oe(null, this.children);var b = J(a),
        c = this.children.get(b);return c ? (a = c.remove(D(a)), b = a.e() ? this.children.remove(b) : this.children.Ra(b, a), null === this.value && b.e() ? Q : new oe(this.value, b)) : this;
  };g.get = function (a) {
    if (a.e()) return this.value;var b = this.children.get(J(a));return b ? b.get(D(a)) : null;
  };
  function Ld(a, b, c) {
    if (b.e()) return c;var d = J(b);b = Ld(a.children.get(d) || Q, D(b), c);d = b.e() ? a.children.remove(d) : a.children.Ra(d, b);return new oe(a.value, d);
  }function te(a, b) {
    return ue(a, C, b);
  }function ue(a, b, c) {
    var d = {};a.children.ia(function (a, f) {
      d[a] = ue(f, b.m(a), c);
    });return c(b, a.value, d);
  }function ve(a, b, c) {
    return we(a, b, C, c);
  }function we(a, b, c, d) {
    var e = a.value ? d(c, a.value) : !1;if (e) return e;if (b.e()) return null;e = J(b);return (a = a.children.get(e)) ? we(a, D(b), c.m(e), d) : null;
  }
  function xe(a, b, c) {
    ye(a, b, C, c);
  }function ye(a, b, c, d) {
    if (b.e()) return a;a.value && d(c, a.value);var e = J(b);return (a = a.children.get(e)) ? ye(a, D(b), c.m(e), d) : Q;
  }function Jd(a, b) {
    ze(a, C, b);
  }function ze(a, b, c) {
    a.children.ia(function (a, e) {
      ze(e, b.m(a), c);
    });a.value && c(b, a.value);
  }function Ae(a, b) {
    a.children.ia(function (a, d) {
      d.value && b(a, d.value);
    });
  }var Q = new oe(null);oe.prototype.toString = function () {
    var a = {};Jd(this, function (b, c) {
      a[b.toString()] = c.toString();
    });return B(a);
  };function Be(a, b, c) {
    this.type = Ad;this.source = Ce;this.path = a;this.Pb = b;this.Id = c;
  }Be.prototype.Nc = function (a) {
    if (this.path.e()) {
      if (null != this.Pb.value) return E(this.Pb.children.e(), "affectedTree should not have overlapping affected paths."), this;a = this.Pb.subtree(new M(a));return new Be(C, a, this.Id);
    }E(J(this.path) === a, "operationForChild called for unrelated child.");return new Be(D(this.path), this.Pb, this.Id);
  };
  Be.prototype.toString = function () {
    return "Operation(" + this.path + ": " + this.source.toString() + " ack write revert=" + this.Id + " affectedTree=" + this.Pb + ")";
  };var bc = 0,
      ld = 1,
      Ad = 2,
      $b = 3;function De(a, b, c, d) {
    this.ee = a;this.Ve = b;this.Ib = c;this.Ee = d;E(!d || b, "Tagged queries must be from server.");
  }var Ce = new De(!0, !1, null, !1),
      Ee = new De(!1, !0, null, !1);De.prototype.toString = function () {
    return this.ee ? "user" : this.Ee ? "server(queryID=" + this.Ib + ")" : "server";
  };function Fe() {
    me.call(this, ["visible"]);var a, b;"undefined" !== typeof document && "undefined" !== typeof document.addEventListener && ("undefined" !== typeof document.hidden ? (b = "visibilitychange", a = "hidden") : "undefined" !== typeof document.mozHidden ? (b = "mozvisibilitychange", a = "mozHidden") : "undefined" !== typeof document.msHidden ? (b = "msvisibilitychange", a = "msHidden") : "undefined" !== typeof document.webkitHidden && (b = "webkitvisibilitychange", a = "webkitHidden"));this.Nb = !0;if (b) {
      var c = this;document.addEventListener(b, function () {
        var b = !document[a];b !== c.Nb && (c.Nb = b, c.Ge("visible", b));
      }, !1);
    }
  }ka(Fe, me);Fe.prototype.Xe = function (a) {
    E("visible" === a, "Unknown event type: " + a);return [this.Nb];
  };ba(Fe);function Ge() {
    this.set = {};
  }g = Ge.prototype;g.add = function (a, b) {
    this.set[a] = null !== b ? b : !0;
  };g.contains = function (a) {
    return Hb(this.set, a);
  };g.get = function (a) {
    return this.contains(a) ? this.set[a] : void 0;
  };g.remove = function (a) {
    delete this.set[a];
  };g.clear = function () {
    this.set = {};
  };g.e = function () {
    return ua(this.set);
  };g.count = function () {
    return na(this.set);
  };function He(a, b) {
    t(a.set, function (a, d) {
      b(d, a);
    });
  }g.keys = function () {
    var a = [];t(this.set, function (b, c) {
      a.push(c);
    });return a;
  };function Ie(a, b) {
    return a && "object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) ? (E(".sv" in a, "Unexpected leaf node or priority contents"), b[a[".sv"]]) : a;
  }function Je(a, b) {
    var c = new Ke();Le(a, new M(""), function (a, e) {
      Me(c, a, Ne(e, b));
    });return c;
  }function Ne(a, b) {
    var c = a.C().H(),
        c = Ie(c, b),
        d;if (a.J()) {
      var e = Ie(a.Ea(), b);return e !== a.Ea() || c !== a.C().H() ? new Oe(e, S(c)) : a;
    }d = a;c !== a.C().H() && (d = d.ga(new Oe(c)));a.P(N, function (a, c) {
      var e = Ne(c, b);e !== c && (d = d.U(a, e));
    });return d;
  };function Pe() {
    me.call(this, ["online"]);this.ic = !0;if ("undefined" !== typeof window && "undefined" !== typeof window.addEventListener && !Pb()) {
      var a = this;window.addEventListener("online", function () {
        a.ic || (a.ic = !0, a.Ge("online", !0));
      }, !1);window.addEventListener("offline", function () {
        a.ic && (a.ic = !1, a.Ge("online", !1));
      }, !1);
    }
  }ka(Pe, me);Pe.prototype.Xe = function (a) {
    E("online" === a, "Unknown event type: " + a);return [this.ic];
  };ba(Pe);function Qe() {}var Re = {};function Se(a) {
    return r(a.compare, a);
  }Qe.prototype.nd = function (a, b) {
    return 0 !== this.compare(new O("[MIN_NAME]", a), new O("[MIN_NAME]", b));
  };Qe.prototype.Ic = function () {
    return Te;
  };function Ue(a) {
    E(!a.e() && ".priority" !== J(a), "Can't create PathIndex with empty path or .priority key");this.cc = a;
  }ka(Ue, Qe);g = Ue.prototype;g.yc = function (a) {
    return !a.Q(this.cc).e();
  };g.compare = function (a, b) {
    var c = a.S.Q(this.cc),
        d = b.S.Q(this.cc),
        c = c.tc(d);return 0 === c ? ad(a.name, b.name) : c;
  };
  g.Fc = function (a, b) {
    var c = S(a),
        c = F.F(this.cc, c);return new O(b, c);
  };g.Gc = function () {
    var a = F.F(this.cc, Ve);return new O("[MAX_NAME]", a);
  };g.toString = function () {
    return this.cc.slice().join("/");
  };function We() {}ka(We, Qe);g = We.prototype;g.compare = function (a, b) {
    var c = a.S.C(),
        d = b.S.C(),
        c = c.tc(d);return 0 === c ? ad(a.name, b.name) : c;
  };g.yc = function (a) {
    return !a.C().e();
  };g.nd = function (a, b) {
    return !a.C().ca(b.C());
  };g.Ic = function () {
    return Te;
  };g.Gc = function () {
    return new O("[MAX_NAME]", new Oe("[PRIORITY-POST]", Ve));
  };
  g.Fc = function (a, b) {
    var c = S(a);return new O(b, new Oe("[PRIORITY-POST]", c));
  };g.toString = function () {
    return ".priority";
  };var N = new We();function Xe() {}ka(Xe, Qe);g = Xe.prototype;g.compare = function (a, b) {
    return ad(a.name, b.name);
  };g.yc = function () {
    throw Pc("KeyIndex.isDefinedOn not expected to be called.");
  };g.nd = function () {
    return !1;
  };g.Ic = function () {
    return Te;
  };g.Gc = function () {
    return new O("[MAX_NAME]", F);
  };g.Fc = function (a) {
    E(q(a), "KeyIndex indexValue must always be a string.");return new O(a, F);
  };g.toString = function () {
    return ".key";
  };
  var Md = new Xe();function Ye() {}ka(Ye, Qe);g = Ye.prototype;g.compare = function (a, b) {
    var c = a.S.tc(b.S);return 0 === c ? ad(a.name, b.name) : c;
  };g.yc = function () {
    return !0;
  };g.nd = function (a, b) {
    return !a.ca(b);
  };g.Ic = function () {
    return Te;
  };g.Gc = function () {
    return Ze;
  };g.Fc = function (a, b) {
    var c = S(a);return new O(b, c);
  };g.toString = function () {
    return ".value";
  };var $e = new Ye();function af(a, b) {
    return ad(a.name, b.name);
  }function bf(a, b) {
    return ad(a, b);
  };function cf(a, b) {
    this.od = a;this.dc = b;
  }cf.prototype.get = function (a) {
    var b = A(this.od, a);if (!b) throw Error("No index defined for " + a);return b === Re ? null : b;
  };function df(a, b, c) {
    var d = la(a.od, function (d, f) {
      var h = A(a.dc, f);E(h, "Missing index implementation for " + f);if (d === Re) {
        if (h.yc(b.S)) {
          for (var k = [], m = c.Xb(ef), l = K(m); l;) {
            l.name != b.name && k.push(l), l = K(m);
          }k.push(b);return ff(k, Se(h));
        }return Re;
      }h = c.get(b.name);k = d;h && (k = k.remove(new O(b.name, h)));return k.Ra(b, b.S);
    });return new cf(d, a.dc);
  }
  function gf(a, b, c) {
    var d = la(a.od, function (a) {
      if (a === Re) return a;var d = c.get(b.name);return d ? a.remove(new O(b.name, d)) : a;
    });return new cf(d, a.dc);
  }var hf = new cf({ ".priority": Re }, { ".priority": N });function O(a, b) {
    this.name = a;this.S = b;
  }function ef(a, b) {
    return new O(a, b);
  };function jf(a) {
    this.sa = new od(a);this.g = a.g;E(a.xa, "Only valid if limit has been set");this.oa = a.oa;this.Jb = !kf(a);
  }g = jf.prototype;g.F = function (a, b, c, d, e, f) {
    this.sa.matches(new O(b, c)) || (c = F);return a.R(b).ca(c) ? a : a.Fb() < this.oa ? this.sa.Vb().F(a, b, c, d, e, f) : lf(this, a, b, c, e, f);
  };
  g.za = function (a, b, c) {
    var d;if (b.J() || b.e()) d = F.ob(this.g);else if (2 * this.oa < b.Fb() && b.zc(this.g)) {
      d = F.ob(this.g);b = this.Jb ? b.$b(this.sa.wc, this.g) : b.Yb(this.sa.Uc, this.g);for (var e = 0; 0 < b.Sa.length && e < this.oa;) {
        var f = K(b),
            h;if (h = this.Jb ? 0 >= this.g.compare(this.sa.Uc, f) : 0 >= this.g.compare(f, this.sa.wc)) d = d.U(f.name, f.S), e++;else break;
      }
    } else {
      d = b.ob(this.g);d = d.ga(F);var k, m, l;if (this.Jb) {
        b = d.Ze(this.g);k = this.sa.wc;m = this.sa.Uc;var u = Se(this.g);l = function l(a, b) {
          return u(b, a);
        };
      } else b = d.Xb(this.g), k = this.sa.Uc, m = this.sa.wc, l = Se(this.g);for (var e = 0, z = !1; 0 < b.Sa.length;) {
        f = K(b), !z && 0 >= l(k, f) && (z = !0), (h = z && e < this.oa && 0 >= l(f, m)) ? e++ : d = d.U(f.name, F);
      }
    }return this.sa.Vb().za(a, d, c);
  };g.ga = function (a) {
    return a;
  };g.Qa = function () {
    return !0;
  };g.Vb = function () {
    return this.sa.Vb();
  };
  function lf(a, b, c, d, e, f) {
    var h;if (a.Jb) {
      var k = Se(a.g);h = function h(a, b) {
        return k(b, a);
      };
    } else h = Se(a.g);E(b.Fb() == a.oa, "");var m = new O(c, d),
        l = a.Jb ? mf(b, a.g) : nf(b, a.g),
        u = a.sa.matches(m);if (b.Fa(c)) {
      for (var z = b.R(c), l = e.fe(a.g, l, a.Jb); null != l && (l.name == c || b.Fa(l.name));) {
        l = e.fe(a.g, l, a.Jb);
      }e = null == l ? 1 : h(l, m);if (u && !d.e() && 0 <= e) return null != f && nd(f, new H("child_changed", d, c, z)), b.U(c, d);null != f && nd(f, new H("child_removed", z, c));b = b.U(c, F);return null != l && a.sa.matches(l) ? (null != f && nd(f, new H("child_added", l.S, l.name)), b.U(l.name, l.S)) : b;
    }return d.e() ? b : u && 0 <= h(l, m) ? (null != f && (nd(f, new H("child_removed", l.S, l.name)), nd(f, new H("child_added", d, c))), b.U(c, d).U(l.name, F)) : b;
  };function of(a) {
    this.W = a;this.g = a.n.g;
  }function pf(a, b, c, d) {
    var e = [],
        f = [];Ga(b, function (b) {
      "child_changed" === b.type && a.g.nd(b.qe, b.Ma) && f.push(new H("child_moved", b.Ma, b.Za));
    });qf(a, e, "child_removed", b, d, c);qf(a, e, "child_added", b, d, c);qf(a, e, "child_moved", f, d, c);qf(a, e, "child_changed", b, d, c);qf(a, e, hc, b, d, c);return e;
  }function qf(a, b, c, d, e, f) {
    d = Ha(d, function (a) {
      return a.type === c;
    });Pa(d, r(a.Nf, a));Ga(d, function (c) {
      var d = rf(a, c, f);Ga(e, function (e) {
        e.sf(c.type) && b.push(e.createEvent(d, a.W));
      });
    });
  }
  function rf(a, b, c) {
    "value" !== b.type && "child_removed" !== b.type && (b.Dd = c.Ye(b.Za, b.Ma, a.g));return b;
  }of.prototype.Nf = function (a, b) {
    if (null == a.Za || null == b.Za) throw Pc("Should only compare child_ events.");return this.g.compare(new O(a.Za, a.Ma), new O(b.Za, b.Ma));
  };function sf() {
    this.Sb = this.na = this.Lb = this.ka = this.xa = !1;this.oa = 0;this.oc = "";this.ec = null;this.Ab = "";this.bc = null;this.yb = "";this.g = N;
  }var tf = new sf();function kf(a) {
    return "" === a.oc ? a.ka : "l" === a.oc;
  }function qd(a) {
    E(a.ka, "Only valid if start has been set");return a.ec;
  }function pd(a) {
    E(a.ka, "Only valid if start has been set");return a.Lb ? a.Ab : "[MIN_NAME]";
  }function sd(a) {
    E(a.na, "Only valid if end has been set");return a.bc;
  }
  function rd(a) {
    E(a.na, "Only valid if end has been set");return a.Sb ? a.yb : "[MAX_NAME]";
  }function uf(a) {
    var b = new sf();b.xa = a.xa;b.oa = a.oa;b.ka = a.ka;b.ec = a.ec;b.Lb = a.Lb;b.Ab = a.Ab;b.na = a.na;b.bc = a.bc;b.Sb = a.Sb;b.yb = a.yb;b.g = a.g;return b;
  }g = sf.prototype;g.ne = function (a) {
    var b = uf(this);b.xa = !0;b.oa = a;b.oc = "l";return b;
  };g.oe = function (a) {
    var b = uf(this);b.xa = !0;b.oa = a;b.oc = "r";return b;
  };g.Nd = function (a, b) {
    var c = uf(this);c.ka = !0;p(a) || (a = null);c.ec = a;null != b ? (c.Lb = !0, c.Ab = b) : (c.Lb = !1, c.Ab = "");return c;
  };
  g.fd = function (a, b) {
    var c = uf(this);c.na = !0;p(a) || (a = null);c.bc = a;p(b) ? (c.Sb = !0, c.yb = b) : (c.Eg = !1, c.yb = "");return c;
  };function vf(a, b) {
    var c = uf(a);c.g = b;return c;
  }function wf(a) {
    var b = {};a.ka && (b.sp = a.ec, a.Lb && (b.sn = a.Ab));a.na && (b.ep = a.bc, a.Sb && (b.en = a.yb));if (a.xa) {
      b.l = a.oa;var c = a.oc;"" === c && (c = kf(a) ? "l" : "r");b.vf = c;
    }a.g !== N && (b.i = a.g.toString());return b;
  }function T(a) {
    return !(a.ka || a.na || a.xa);
  }function xf(a) {
    return T(a) && a.g == N;
  }
  function yf(a) {
    var b = {};if (xf(a)) return b;var c;a.g === N ? c = "$priority" : a.g === $e ? c = "$value" : a.g === Md ? c = "$key" : (E(a.g instanceof Ue, "Unrecognized index type!"), c = a.g.toString());b.orderBy = B(c);a.ka && (b.startAt = B(a.ec), a.Lb && (b.startAt += "," + B(a.Ab)));a.na && (b.endAt = B(a.bc), a.Sb && (b.endAt += "," + B(a.yb)));a.xa && (kf(a) ? b.limitToFirst = a.oa : b.limitToLast = a.oa);return b;
  }g.toString = function () {
    return B(wf(this));
  };function Oe(a, b) {
    this.B = a;E(p(this.B) && null !== this.B, "LeafNode shouldn't be created with null/undefined value.");this.aa = b || F;zf(this.aa);this.Eb = null;
  }var Af = ["object", "boolean", "number", "string"];g = Oe.prototype;g.J = function () {
    return !0;
  };g.C = function () {
    return this.aa;
  };g.ga = function (a) {
    return new Oe(this.B, a);
  };g.R = function (a) {
    return ".priority" === a ? this.aa : F;
  };g.Q = function (a) {
    return a.e() ? this : ".priority" === J(a) ? this.aa : F;
  };g.Fa = function () {
    return !1;
  };g.Ye = function () {
    return null;
  };
  g.U = function (a, b) {
    return ".priority" === a ? this.ga(b) : b.e() && ".priority" !== a ? this : F.U(a, b).ga(this.aa);
  };g.F = function (a, b) {
    var c = J(a);if (null === c) return b;if (b.e() && ".priority" !== c) return this;E(".priority" !== c || 1 === Hd(a), ".priority must be the last token in a path");return this.U(c, F.F(D(a), b));
  };g.e = function () {
    return !1;
  };g.Fb = function () {
    return 0;
  };g.P = function () {
    return !1;
  };g.H = function (a) {
    return a && !this.C().e() ? { ".value": this.Ea(), ".priority": this.C().H() } : this.Ea();
  };
  g.hash = function () {
    if (null === this.Eb) {
      var a = "";this.aa.e() || (a += "priority:" + Bf(this.aa.H()) + ":");var b = _typeof(this.B),
          a = a + (b + ":"),
          a = "number" === b ? a + gd(this.B) : a + this.B;this.Eb = Rc(a);
    }return this.Eb;
  };g.Ea = function () {
    return this.B;
  };g.tc = function (a) {
    if (a === F) return 1;if (a instanceof P) return -1;E(a.J(), "Unknown node type");var b = _typeof(a.B),
        c = _typeof(this.B),
        d = Fa(Af, b),
        e = Fa(Af, c);E(0 <= d, "Unknown leaf type: " + b);E(0 <= e, "Unknown leaf type: " + c);return d === e ? "object" === c ? 0 : this.B < a.B ? -1 : this.B === a.B ? 0 : 1 : e - d;
  };
  g.ob = function () {
    return this;
  };g.zc = function () {
    return !0;
  };g.ca = function (a) {
    return a === this ? !0 : a.J() ? this.B === a.B && this.aa.ca(a.aa) : !1;
  };g.toString = function () {
    return B(this.H(!0));
  };function P(a, b, c) {
    this.k = a;(this.aa = b) && zf(this.aa);a.e() && E(!this.aa || this.aa.e(), "An empty node cannot have a priority");this.zb = c;this.Eb = null;
  }g = P.prototype;g.J = function () {
    return !1;
  };g.C = function () {
    return this.aa || F;
  };g.ga = function (a) {
    return this.k.e() ? this : new P(this.k, a, this.zb);
  };g.R = function (a) {
    if (".priority" === a) return this.C();a = this.k.get(a);return null === a ? F : a;
  };g.Q = function (a) {
    var b = J(a);return null === b ? this : this.R(b).Q(D(a));
  };g.Fa = function (a) {
    return null !== this.k.get(a);
  };
  g.U = function (a, b) {
    E(b, "We should always be passing snapshot nodes");if (".priority" === a) return this.ga(b);var c = new O(a, b),
        d,
        e;b.e() ? (d = this.k.remove(a), c = gf(this.zb, c, this.k)) : (d = this.k.Ra(a, b), c = df(this.zb, c, this.k));e = d.e() ? F : this.aa;return new P(d, e, c);
  };g.F = function (a, b) {
    var c = J(a);if (null === c) return b;E(".priority" !== J(a) || 1 === Hd(a), ".priority must be the last token in a path");var d = this.R(c).F(D(a), b);return this.U(c, d);
  };g.e = function () {
    return this.k.e();
  };g.Fb = function () {
    return this.k.count();
  };
  var Cf = /^(0|[1-9]\d*)$/;g = P.prototype;g.H = function (a) {
    if (this.e()) return null;var b = {},
        c = 0,
        d = 0,
        e = !0;this.P(N, function (f, h) {
      b[f] = h.H(a);c++;e && Cf.test(f) ? d = Math.max(d, Number(f)) : e = !1;
    });if (!a && e && d < 2 * c) {
      var f = [],
          h;for (h in b) {
        f[h] = b[h];
      }return f;
    }a && !this.C().e() && (b[".priority"] = this.C().H());return b;
  };g.hash = function () {
    if (null === this.Eb) {
      var a = "";this.C().e() || (a += "priority:" + Bf(this.C().H()) + ":");this.P(N, function (b, c) {
        var d = c.hash();"" !== d && (a += ":" + b + ":" + d);
      });this.Eb = "" === a ? "" : Rc(a);
    }return this.Eb;
  };
  g.Ye = function (a, b, c) {
    return (c = Df(this, c)) ? (a = Cc(c, new O(a, b))) ? a.name : null : Cc(this.k, a);
  };function mf(a, b) {
    var c;c = (c = Df(a, b)) ? (c = c.Hc()) && c.name : a.k.Hc();return c ? new O(c, a.k.get(c)) : null;
  }function nf(a, b) {
    var c;c = (c = Df(a, b)) ? (c = c.fc()) && c.name : a.k.fc();return c ? new O(c, a.k.get(c)) : null;
  }g.P = function (a, b) {
    var c = Df(this, a);return c ? c.ia(function (a) {
      return b(a.name, a.S);
    }) : this.k.ia(b);
  };g.Xb = function (a) {
    return this.Yb(a.Ic(), a);
  };
  g.Yb = function (a, b) {
    var c = Df(this, b);if (c) return c.Yb(a, function (a) {
      return a;
    });for (var c = this.k.Yb(a.name, ef), d = Ec(c); null != d && 0 > b.compare(d, a);) {
      K(c), d = Ec(c);
    }return c;
  };g.Ze = function (a) {
    return this.$b(a.Gc(), a);
  };g.$b = function (a, b) {
    var c = Df(this, b);if (c) return c.$b(a, function (a) {
      return a;
    });for (var c = this.k.$b(a.name, ef), d = Ec(c); null != d && 0 < b.compare(d, a);) {
      K(c), d = Ec(c);
    }return c;
  };g.tc = function (a) {
    return this.e() ? a.e() ? 0 : -1 : a.J() || a.e() ? 1 : a === Ve ? -1 : 0;
  };
  g.ob = function (a) {
    if (a === Md || ra(this.zb.dc, a.toString())) return this;var b = this.zb,
        c = this.k;E(a !== Md, "KeyIndex always exists and isn't meant to be added to the IndexMap.");for (var d = [], e = !1, c = c.Xb(ef), f = K(c); f;) {
      e = e || a.yc(f.S), d.push(f), f = K(c);
    }d = e ? ff(d, Se(a)) : Re;e = a.toString();c = va(b.dc);c[e] = a;a = va(b.od);a[e] = d;return new P(this.k, this.aa, new cf(a, c));
  };g.zc = function (a) {
    return a === Md || ra(this.zb.dc, a.toString());
  };
  g.ca = function (a) {
    if (a === this) return !0;if (a.J()) return !1;if (this.C().ca(a.C()) && this.k.count() === a.k.count()) {
      var b = this.Xb(N);a = a.Xb(N);for (var c = K(b), d = K(a); c && d;) {
        if (c.name !== d.name || !c.S.ca(d.S)) return !1;c = K(b);d = K(a);
      }return null === c && null === d;
    }return !1;
  };function Df(a, b) {
    return b === Md ? null : a.zb.get(b.toString());
  }g.toString = function () {
    return B(this.H(!0));
  };function S(a, b) {
    if (null === a) return F;var c = null;"object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && ".priority" in a ? c = a[".priority"] : "undefined" !== typeof b && (c = b);E(null === c || "string" === typeof c || "number" === typeof c || "object" === (typeof c === "undefined" ? "undefined" : _typeof(c)) && ".sv" in c, "Invalid priority type found: " + (typeof c === "undefined" ? "undefined" : _typeof(c)));"object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) && ".value" in a && null !== a[".value"] && (a = a[".value"]);if ("object" !== (typeof a === "undefined" ? "undefined" : _typeof(a)) || ".sv" in a) return new Oe(a, S(c));if (a instanceof Array) {
      var d = F,
          e = a;t(e, function (a, b) {
        if (Hb(e, b) && "." !== b.substring(0, 1)) {
          var c = S(a);if (c.J() || !c.e()) d = d.U(b, c);
        }
      });return d.ga(S(c));
    }var f = [],
        h = !1,
        k = a;Ib(k, function (a) {
      if ("string" !== typeof a || "." !== a.substring(0, 1)) {
        var b = S(k[a]);b.e() || (h = h || !b.C().e(), f.push(new O(a, b)));
      }
    });if (0 == f.length) return F;var m = ff(f, af, function (a) {
      return a.name;
    }, bf);if (h) {
      var l = ff(f, Se(N));return new P(m, S(c), new cf({ ".priority": l }, { ".priority": N }));
    }return new P(m, S(c), hf);
  }var Ef = Math.log(2);
  function Ff(a) {
    this.count = parseInt(Math.log(a + 1) / Ef, 10);this.Qe = this.count - 1;this.Kf = a + 1 & parseInt(Array(this.count + 1).join("1"), 2);
  }function Gf(a) {
    var b = !(a.Kf & 1 << a.Qe);a.Qe--;return b;
  }
  function ff(a, b, c, d) {
    function e(b, d) {
      var f = d - b;if (0 == f) return null;if (1 == f) {
        var l = a[b],
            u = c ? c(l) : l;return new Fc(u, l.S, !1, null, null);
      }var l = parseInt(f / 2, 10) + b,
          f = e(b, l),
          z = e(l + 1, d),
          l = a[l],
          u = c ? c(l) : l;return new Fc(u, l.S, !1, f, z);
    }a.sort(b);var f = function (b) {
      function d(b, h) {
        var k = u - b,
            z = u;u -= b;var z = e(k + 1, z),
            k = a[k],
            G = c ? c(k) : k,
            z = new Fc(G, k.S, h, null, z);f ? f.left = z : l = z;f = z;
      }for (var f = null, l = null, u = a.length, z = 0; z < b.count; ++z) {
        var G = Gf(b),
            Bd = Math.pow(2, b.count - (z + 1));G ? d(Bd, !1) : (d(Bd, !1), d(Bd, !0));
      }return l;
    }(new Ff(a.length));
    return null !== f ? new Ac(d || b, f) : new Ac(d || b);
  }function Bf(a) {
    return "number" === typeof a ? "number:" + gd(a) : "string:" + a;
  }function zf(a) {
    if (a.J()) {
      var b = a.H();E("string" === typeof b || "number" === typeof b || "object" === (typeof b === "undefined" ? "undefined" : _typeof(b)) && Hb(b, ".sv"), "Priority must be a string or number.");
    } else E(a === Ve || a.e(), "priority of unexpected type.");E(a === Ve || a.C().e(), "Priority nodes can't have a priority of their own.");
  }var F = new P(new Ac(bf), null, hf);function Hf() {
    P.call(this, new Ac(bf), F, hf);
  }ka(Hf, P);g = Hf.prototype;
  g.tc = function (a) {
    return a === this ? 0 : 1;
  };g.ca = function (a) {
    return a === this;
  };g.C = function () {
    return this;
  };g.R = function () {
    return F;
  };g.e = function () {
    return !1;
  };var Ve = new Hf(),
      Te = new O("[MIN_NAME]", F),
      Ze = new O("[MAX_NAME]", Ve);function Fd(a, b) {
    this.O = a;this.Ld = b;
  }function Cd(a, b, c, d) {
    return new Fd(new oc(b, c, d), a.Ld);
  }function Gd(a) {
    return a.O.ea ? a.O.j() : null;
  }Fd.prototype.u = function () {
    return this.Ld;
  };function pc(a) {
    return a.Ld.ea ? a.Ld.j() : null;
  };function If(a, b) {
    this.W = a;var c = a.n,
        d = new md(c.g),
        c = T(c) ? new md(c.g) : c.xa ? new jf(c) : new od(c);this.nf = new vd(c);var e = b.u(),
        f = b.O,
        h = d.za(F, e.j(), null),
        k = c.za(F, f.j(), null);this.Na = new Fd(new oc(k, f.ea, c.Qa()), new oc(h, e.ea, d.Qa()));this.ab = [];this.Rf = new of(a);
  }function Jf(a) {
    return a.W;
  }g = If.prototype;g.u = function () {
    return this.Na.u().j();
  };g.jb = function (a) {
    var b = pc(this.Na);return b && (T(this.W.n) || !a.e() && !b.R(J(a)).e()) ? b.Q(a) : null;
  };g.e = function () {
    return 0 === this.ab.length;
  };g.Ob = function (a) {
    this.ab.push(a);
  };
  g.mb = function (a, b) {
    var c = [];if (b) {
      E(null == a, "A cancel should cancel all event registrations.");var d = this.W.path;Ga(this.ab, function (a) {
        (a = a.Oe(b, d)) && c.push(a);
      });
    }if (a) {
      for (var e = [], f = 0; f < this.ab.length; ++f) {
        var h = this.ab[f];if (!h.matches(a)) e.push(h);else if (a.$e()) {
          e = e.concat(this.ab.slice(f + 1));break;
        }
      }this.ab = e;
    } else this.ab = [];return c;
  };
  g.gb = function (a, b, c) {
    a.type === ld && null !== a.source.Ib && (E(pc(this.Na), "We should always have a full cache before handling merges"), E(Gd(this.Na), "Missing event cache, even though we have a server cache"));var d = this.Na;a = this.nf.gb(d, a, b, c);b = this.nf;c = a.Sd;E(c.O.j().zc(b.V.g), "Event snap not indexed");E(c.u().j().zc(b.V.g), "Server snap not indexed");E(xc(a.Sd.u()) || !xc(d.u()), "Once a server snap is complete, it should never go back");this.Na = a.Sd;return Kf(this, a.Lf, a.Sd.O.j(), null);
  };
  function Lf(a, b) {
    var c = a.Na.O,
        d = [];c.j().J() || c.j().P(N, function (a, b) {
      d.push(new H("child_added", b, a));
    });c.ea && d.push(gc(c.j()));return Kf(a, d, c.j(), b);
  }function Kf(a, b, c, d) {
    return pf(a.Rf, b, c, d ? [d] : a.ab);
  };function Mf(a, b, c) {
    this.f = Vc("p:rest:");this.M = a;this.Hb = b;this.Vd = c;this.$ = {};
  }function Nf(a, b) {
    if (p(b)) return "tag$" + b;E(xf(a.n), "should have a tag if it's not a default query.");return a.path.toString();
  }g = Mf.prototype;
  g.cf = function (a, b, c, d) {
    var e = a.path.toString();this.f("Listen called for " + e + " " + a.ya());var f = Nf(a, c),
        h = {};this.$[f] = h;a = yf(a.n);var k = this;Of(this, e + ".json", a, function (a, b) {
      var u = b;404 === a && (a = u = null);null === a && k.Hb(e, u, !1, c);A(k.$, f) === h && d(a ? 401 == a ? "permission_denied" : "rest_error:" + a : "ok", null);
    });
  };g.Df = function (a, b) {
    var c = Nf(a, b);delete this.$[c];
  };g.pf = function () {};g.re = function () {};g.ff = function () {};g.xd = function () {};g.put = function () {};g.df = function () {};g.ye = function () {};
  function Of(a, b, c, d) {
    c = c || {};c.format = "export";a.Vd.getToken(!1).then(function (e) {
      (e = e && e.accessToken) && (c.auth = e);var f = (a.M.Sc ? "https://" : "http://") + a.M.host + b + "?" + Jb(c);a.f("Sending REST request for " + f);var h = new XMLHttpRequest();h.onreadystatechange = function () {
        if (d && 4 === h.readyState) {
          a.f("REST Response for " + f + " received. status:", h.status, "response:", h.responseText);var b = null;if (200 <= h.status && 300 > h.status) {
            try {
              b = Kb(h.responseText);
            } catch (c) {
              L("Failed to parse JSON response for " + f + ": " + h.responseText);
            }d(null, b);
          } else 401 !== h.status && 404 !== h.status && L("Got unsuccessful REST response for " + f + " Status: " + h.status), d(h.status);d = null;
        }
      };h.open("GET", f, !0);h.send();
    });
  };function Pf(a) {
    this.He = a;
  }Pf.prototype.getToken = function (a) {
    return this.He.INTERNAL.getToken(a).then(null, function (a) {
      return a && "auth/token-not-initialized" === a.code ? (I("Got auth/token-not-initialized error.  Treating as null token."), null) : Promise.reject(a);
    });
  };function Qf(a, b) {
    a.He.INTERNAL.addAuthTokenListener(b);
  };function Rf(a) {
    this.Mf = a;this.rd = null;
  }Rf.prototype.get = function () {
    var a = this.Mf.get(),
        b = va(a);if (this.rd) for (var c in this.rd) {
      b[c] -= this.rd[c];
    }this.rd = a;return b;
  };function Sf() {
    this.uc = {};
  }function Tf(a, b, c) {
    p(c) || (c = 1);Hb(a.uc, b) || (a.uc[b] = 0);a.uc[b] += c;
  }Sf.prototype.get = function () {
    return va(this.uc);
  };function Uf(a, b) {
    this.yf = {};this.Vc = new Rf(a);this.va = b;var c = 1E4 + 2E4 * Math.random();setTimeout(r(this.qf, this), Math.floor(c));
  }Uf.prototype.qf = function () {
    var a = this.Vc.get(),
        b = {},
        c = !1,
        d;for (d in a) {
      0 < a[d] && Hb(this.yf, d) && (b[d] = a[d], c = !0);
    }c && this.va.ye(b);setTimeout(r(this.qf, this), Math.floor(6E5 * Math.random()));
  };var Vf = {},
      Wf = {};function Xf(a) {
    a = a.toString();Vf[a] || (Vf[a] = new Sf());return Vf[a];
  }function Yf(a, b) {
    var c = a.toString();Wf[c] || (Wf[c] = b());return Wf[c];
  };var Zf = null;"undefined" !== typeof MozWebSocket ? Zf = MozWebSocket : "undefined" !== typeof WebSocket && (Zf = WebSocket);function $f(a, b, c, d) {
    this.Zd = a;this.f = Vc(this.Zd);this.frames = this.Ac = null;this.qb = this.rb = this.Fe = 0;this.Xa = Xf(b);a = { v: "5" };"undefined" !== typeof location && location.href && -1 !== location.href.indexOf("firebaseio.com") && (a.r = "f");c && (a.s = c);d && (a.ls = d);this.Me = ec(b, "websocket", a);
  }var ag;
  $f.prototype.open = function (a, b) {
    this.kb = b;this.gg = a;this.f("Websocket connecting to " + this.Me);this.xc = !1;Xb.set("previous_websocket_failure", !0);try {
      this.La = new Zf(this.Me);
    } catch (c) {
      this.f("Error instantiating WebSocket.");var d = c.message || c.data;d && this.f(d);this.fb();return;
    }var e = this;this.La.onopen = function () {
      e.f("Websocket connected.");e.xc = !0;
    };this.La.onclose = function () {
      e.f("Websocket connection was disconnected.");e.La = null;e.fb();
    };this.La.onmessage = function (a) {
      if (null !== e.La) if (a = a.data, e.qb += a.length, Tf(e.Xa, "bytes_received", a.length), bg(e), null !== e.frames) cg(e, a);else {
        a: {
          E(null === e.frames, "We already have a frame buffer");if (6 >= a.length) {
            var b = Number(a);if (!isNaN(b)) {
              e.Fe = b;e.frames = [];a = null;break a;
            }
          }e.Fe = 1;e.frames = [];
        }null !== a && cg(e, a);
      }
    };this.La.onerror = function (a) {
      e.f("WebSocket error.  Closing connection.");(a = a.message || a.data) && e.f(a);e.fb();
    };
  };$f.prototype.start = function () {};
  $f.isAvailable = function () {
    var a = !1;if ("undefined" !== typeof navigator && navigator.userAgent) {
      var b = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b && 1 < b.length && 4.4 > parseFloat(b[1]) && (a = !0);
    }return !a && null !== Zf && !ag;
  };$f.responsesRequiredToBeHealthy = 2;$f.healthyTimeout = 3E4;g = $f.prototype;g.sd = function () {
    Xb.remove("previous_websocket_failure");
  };function cg(a, b) {
    a.frames.push(b);if (a.frames.length == a.Fe) {
      var c = a.frames.join("");a.frames = null;c = Kb(c);a.gg(c);
    }
  }
  g.send = function (a) {
    bg(this);a = B(a);this.rb += a.length;Tf(this.Xa, "bytes_sent", a.length);a = ed(a, 16384);1 < a.length && dg(this, String(a.length));for (var b = 0; b < a.length; b++) {
      dg(this, a[b]);
    }
  };g.Tc = function () {
    this.Bb = !0;this.Ac && (clearInterval(this.Ac), this.Ac = null);this.La && (this.La.close(), this.La = null);
  };g.fb = function () {
    this.Bb || (this.f("WebSocket is closing itself"), this.Tc(), this.kb && (this.kb(this.xc), this.kb = null));
  };g.close = function () {
    this.Bb || (this.f("WebSocket is being closed"), this.Tc());
  };
  function bg(a) {
    clearInterval(a.Ac);a.Ac = setInterval(function () {
      a.La && dg(a, "0");bg(a);
    }, Math.floor(45E3));
  }function dg(a, b) {
    try {
      a.La.send(b);
    } catch (c) {
      a.f("Exception thrown from WebSocket.send():", c.message || c.data, "Closing connection."), setTimeout(r(a.fb, a), 0);
    }
  };function eg(a, b, c, d) {
    this.Zd = a;this.f = Vc(a);this.kc = b;this.qb = this.rb = 0;this.Xa = Xf(b);this.Af = c;this.xc = !1;this.Db = d;this.Yc = function (a) {
      return ec(b, "long_polling", a);
    };
  }var fg, gg;
  eg.prototype.open = function (a, b) {
    this.Pe = 0;this.ja = b;this.ef = new Qb(a);this.Bb = !1;var c = this;this.tb = setTimeout(function () {
      c.f("Timed out trying to connect.");c.fb();c.tb = null;
    }, Math.floor(3E4));$c(function () {
      if (!c.Bb) {
        c.Wa = new hg(function (a, b, d, k, m) {
          ig(c, arguments);if (c.Wa) if (c.tb && (clearTimeout(c.tb), c.tb = null), c.xc = !0, "start" == a) c.id = b, c.lf = d;else if ("close" === a) b ? (c.Wa.Kd = !1, Rb(c.ef, b, function () {
            c.fb();
          })) : c.fb();else throw Error("Unrecognized command received: " + a);
        }, function (a, b) {
          ig(c, arguments);
          Sb(c.ef, a, b);
        }, function () {
          c.fb();
        }, c.Yc);var a = { start: "t" };a.ser = Math.floor(1E8 * Math.random());c.Wa.Qd && (a.cb = c.Wa.Qd);a.v = "5";c.Af && (a.s = c.Af);c.Db && (a.ls = c.Db);"undefined" !== typeof location && location.href && -1 !== location.href.indexOf("firebaseio.com") && (a.r = "f");a = c.Yc(a);c.f("Connecting via long-poll to " + a);jg(c.Wa, a, function () {});
      }
    });
  };
  eg.prototype.start = function () {
    var a = this.Wa,
        b = this.lf;a.eg = this.id;a.fg = b;for (a.Ud = !0; kg(a);) {}a = this.id;b = this.lf;this.gc = document.createElement("iframe");var c = { dframe: "t" };c.id = a;c.pw = b;this.gc.src = this.Yc(c);this.gc.style.display = "none";document.body.appendChild(this.gc);
  };
  eg.isAvailable = function () {
    return fg || !gg && "undefined" !== typeof document && null != document.createElement && !("object" === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window.chrome && window.chrome.extension && !/^chrome/.test(window.location.href)) && !("object" === (typeof Windows === "undefined" ? "undefined" : _typeof(Windows)) && "object" === _typeof(Windows.Bg)) && !0;
  };g = eg.prototype;g.sd = function () {};g.Tc = function () {
    this.Bb = !0;this.Wa && (this.Wa.close(), this.Wa = null);this.gc && (document.body.removeChild(this.gc), this.gc = null);this.tb && (clearTimeout(this.tb), this.tb = null);
  };
  g.fb = function () {
    this.Bb || (this.f("Longpoll is closing itself"), this.Tc(), this.ja && (this.ja(this.xc), this.ja = null));
  };g.close = function () {
    this.Bb || (this.f("Longpoll is being closed."), this.Tc());
  };g.send = function (a) {
    a = B(a);this.rb += a.length;Tf(this.Xa, "bytes_sent", a.length);a = Nb(a);a = wb(a, !0);a = ed(a, 1840);for (var b = 0; b < a.length; b++) {
      var c = this.Wa;c.Qc.push({ tg: this.Pe, zg: a.length, Re: a[b] });c.Ud && kg(c);this.Pe++;
    }
  };function ig(a, b) {
    var c = B(b).length;a.qb += c;Tf(a.Xa, "bytes_received", c);
  }
  function hg(a, b, c, d) {
    this.Yc = d;this.kb = c;this.ve = new Ge();this.Qc = [];this.$d = Math.floor(1E8 * Math.random());this.Kd = !0;this.Qd = Oc();window["pLPCommand" + this.Qd] = a;window["pRTLPCB" + this.Qd] = b;a = document.createElement("iframe");a.style.display = "none";if (document.body) {
      document.body.appendChild(a);try {
        a.contentWindow.document || I("No IE domain setting required");
      } catch (e) {
        a.src = "javascript:void((function(){document.open();document.domain='" + document.domain + "';document.close();})())";
      }
    } else throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
    a.contentDocument ? a.ib = a.contentDocument : a.contentWindow ? a.ib = a.contentWindow.document : a.document && (a.ib = a.document);this.Ga = a;a = "";this.Ga.src && "javascript:" === this.Ga.src.substr(0, 11) && (a = '<script>document.domain="' + document.domain + '";\x3c/script>');a = "<html><body>" + a + "</body></html>";try {
      this.Ga.ib.open(), this.Ga.ib.write(a), this.Ga.ib.close();
    } catch (f) {
      I("frame writing exception"), f.stack && I(f.stack), I(f);
    }
  }
  hg.prototype.close = function () {
    this.Ud = !1;if (this.Ga) {
      this.Ga.ib.body.innerHTML = "";var a = this;setTimeout(function () {
        null !== a.Ga && (document.body.removeChild(a.Ga), a.Ga = null);
      }, Math.floor(0));
    }var b = this.kb;b && (this.kb = null, b());
  };
  function kg(a) {
    if (a.Ud && a.Kd && a.ve.count() < (0 < a.Qc.length ? 2 : 1)) {
      a.$d++;var b = {};b.id = a.eg;b.pw = a.fg;b.ser = a.$d;for (var b = a.Yc(b), c = "", d = 0; 0 < a.Qc.length;) {
        if (1870 >= a.Qc[0].Re.length + 30 + c.length) {
          var e = a.Qc.shift(),
              c = c + "&seg" + d + "=" + e.tg + "&ts" + d + "=" + e.zg + "&d" + d + "=" + e.Re;d++;
        } else break;
      }lg(a, b + c, a.$d);return !0;
    }return !1;
  }function lg(a, b, c) {
    function d() {
      a.ve.remove(c);kg(a);
    }a.ve.add(c, 1);var e = setTimeout(d, Math.floor(25E3));jg(a, b, function () {
      clearTimeout(e);d();
    });
  }
  function jg(a, b, c) {
    setTimeout(function () {
      try {
        if (a.Kd) {
          var d = a.Ga.ib.createElement("script");d.type = "text/javascript";d.async = !0;d.src = b;d.onload = d.onreadystatechange = function () {
            var a = d.readyState;a && "loaded" !== a && "complete" !== a || (d.onload = d.onreadystatechange = null, d.parentNode && d.parentNode.removeChild(d), c());
          };d.onerror = function () {
            I("Long-poll script failed to load: " + b);a.Kd = !1;a.close();
          };a.Ga.ib.body.appendChild(d);
        }
      } catch (e) {}
    }, Math.floor(1));
  };function mg(a) {
    ng(this, a);
  }var og = [eg, $f];function ng(a, b) {
    var c = $f && $f.isAvailable(),
        d = c && !(Xb.bf || !0 === Xb.get("previous_websocket_failure"));b.Ag && (c || L("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."), d = !0);if (d) a.Wc = [$f];else {
      var e = a.Wc = [];fd(og, function (a, b) {
        b && b.isAvailable() && e.push(b);
      });
    }
  }function pg(a) {
    if (0 < a.Wc.length) return a.Wc[0];throw Error("No transports available");
  };function qg(a, b, c, d, e, f, h) {
    this.id = a;this.f = Vc("c:" + this.id + ":");this.te = c;this.Mc = d;this.ja = e;this.se = f;this.M = b;this.Ad = [];this.Ne = 0;this.zf = new mg(b);this.L = 0;this.Db = h;this.f("Connection created");rg(this);
  }
  function rg(a) {
    var b = pg(a.zf);a.I = new b("c:" + a.id + ":" + a.Ne++, a.M, void 0, a.Db);a.xe = b.responsesRequiredToBeHealthy || 0;var c = sg(a, a.I),
        d = tg(a, a.I);a.Xc = a.I;a.Rc = a.I;a.D = null;a.Cb = !1;setTimeout(function () {
      a.I && a.I.open(c, d);
    }, Math.floor(0));b = b.healthyTimeout || 0;0 < b && (a.md = setTimeout(function () {
      a.md = null;a.Cb || (a.I && 102400 < a.I.qb ? (a.f("Connection exceeded healthy timeout but has received " + a.I.qb + " bytes.  Marking connection healthy."), a.Cb = !0, a.I.sd()) : a.I && 10240 < a.I.rb ? a.f("Connection exceeded healthy timeout but has sent " + a.I.rb + " bytes.  Leaving connection alive.") : (a.f("Closing unhealthy connection after timeout."), a.close()));
    }, Math.floor(b)));
  }function tg(a, b) {
    return function (c) {
      b === a.I ? (a.I = null, c || 0 !== a.L ? 1 === a.L && a.f("Realtime connection lost.") : (a.f("Realtime connection failed."), "s-" === a.M.bb.substr(0, 2) && (Xb.remove("host:" + a.M.host), a.M.bb = a.M.host)), a.close()) : b === a.D ? (a.f("Secondary connection lost."), c = a.D, a.D = null, a.Xc !== c && a.Rc !== c || a.close()) : a.f("closing an old connection");
    };
  }
  function sg(a, b) {
    return function (c) {
      if (2 != a.L) if (b === a.Rc) {
        var d = cd("t", c);c = cd("d", c);if ("c" == d) {
          if (d = cd("t", c), "d" in c) if (c = c.d, "h" === d) {
            var d = c.ts,
                e = c.v,
                f = c.h;a.xf = c.s;dc(a.M, f);0 == a.L && (a.I.start(), ug(a, a.I, d), "5" !== e && L("Protocol version mismatch detected"), c = a.zf, (c = 1 < c.Wc.length ? c.Wc[1] : null) && vg(a, c));
          } else if ("n" === d) {
            a.f("recvd end transmission on primary");a.Rc = a.D;for (c = 0; c < a.Ad.length; ++c) {
              a.wd(a.Ad[c]);
            }a.Ad = [];wg(a);
          } else "s" === d ? (a.f("Connection shutdown command received. Shutting down..."), a.se && (a.se(c), a.se = null), a.ja = null, a.close()) : "r" === d ? (a.f("Reset packet received.  New host: " + c), dc(a.M, c), 1 === a.L ? a.close() : (xg(a), rg(a))) : "e" === d ? Wc("Server Error: " + c) : "o" === d ? (a.f("got pong on primary."), yg(a), zg(a)) : Wc("Unknown control packet command: " + d);
        } else "d" == d && a.wd(c);
      } else if (b === a.D) {
        if (d = cd("t", c), c = cd("d", c), "c" == d) "t" in c && (c = c.t, "a" === c ? Ag(a) : "r" === c ? (a.f("Got a reset on secondary, closing it"), a.D.close(), a.Xc !== a.D && a.Rc !== a.D || a.close()) : "o" === c && (a.f("got pong on secondary."), a.wf--, Ag(a)));else if ("d" == d) a.Ad.push(c);else throw Error("Unknown protocol layer: " + d);
      } else a.f("message on old connection");
    };
  }qg.prototype.ua = function (a) {
    Bg(this, { t: "d", d: a });
  };function wg(a) {
    a.Xc === a.D && a.Rc === a.D && (a.f("cleaning up and promoting a connection: " + a.D.Zd), a.I = a.D, a.D = null);
  }
  function Ag(a) {
    0 >= a.wf ? (a.f("Secondary connection is healthy."), a.Cb = !0, a.D.sd(), a.D.start(), a.f("sending client ack on secondary"), a.D.send({ t: "c", d: { t: "a", d: {} } }), a.f("Ending transmission on primary"), a.I.send({ t: "c", d: { t: "n", d: {} } }), a.Xc = a.D, wg(a)) : (a.f("sending ping on secondary."), a.D.send({ t: "c", d: { t: "p", d: {} } }));
  }qg.prototype.wd = function (a) {
    yg(this);this.te(a);
  };function yg(a) {
    a.Cb || (a.xe--, 0 >= a.xe && (a.f("Primary connection is healthy."), a.Cb = !0, a.I.sd()));
  }
  function vg(a, b) {
    a.D = new b("c:" + a.id + ":" + a.Ne++, a.M, a.xf);a.wf = b.responsesRequiredToBeHealthy || 0;a.D.open(sg(a, a.D), tg(a, a.D));setTimeout(function () {
      a.D && (a.f("Timed out trying to upgrade."), a.D.close());
    }, Math.floor(6E4));
  }function ug(a, b, c) {
    a.f("Realtime connection established.");a.I = b;a.L = 1;a.Mc && (a.Mc(c, a.xf), a.Mc = null);0 === a.xe ? (a.f("Primary connection is healthy."), a.Cb = !0) : setTimeout(function () {
      zg(a);
    }, Math.floor(5E3));
  }
  function zg(a) {
    a.Cb || 1 !== a.L || (a.f("sending ping on primary."), Bg(a, { t: "c", d: { t: "p", d: {} } }));
  }function Bg(a, b) {
    if (1 !== a.L) throw "Connection is not connected";a.Xc.send(b);
  }qg.prototype.close = function () {
    2 !== this.L && (this.f("Closing realtime connection."), this.L = 2, xg(this), this.ja && (this.ja(), this.ja = null));
  };function xg(a) {
    a.f("Shutting down all connections");a.I && (a.I.close(), a.I = null);a.D && (a.D.close(), a.D = null);a.md && (clearTimeout(a.md), a.md = null);
  };function Cg(a, b, c, d, e, f) {
    this.id = Dg++;this.f = Vc("p:" + this.id + ":");this.qd = {};this.$ = {};this.pa = [];this.Pc = 0;this.Lc = [];this.ma = !1;this.Va = 1E3;this.td = 3E5;this.Hb = b;this.Kc = c;this.ue = d;this.M = a;this.pb = this.Ia = this.Db = this.ze = null;this.Vd = e;this.de = !1;this.ke = 0;if (f) throw Error("Auth override specified in options, but not supported on non Node.js platforms");this.Je = f || null;this.vb = null;this.Nb = !1;this.Gd = {};this.sg = 0;this.Ue = !0;this.Bc = this.me = null;Eg(this, 0);Fe.Wb().hc("visible", this.ig, this);-1 === a.host.indexOf("fblocal") && Pe.Wb().hc("online", this.hg, this);
  }var Dg = 0,
      Fg = 0;g = Cg.prototype;g.ua = function (a, b, c) {
    var d = ++this.sg;a = { r: d, a: a, b: b };this.f(B(a));E(this.ma, "sendRequest call when we're not connected not allowed.");this.Ia.ua(a);c && (this.Gd[d] = c);
  };
  g.cf = function (a, b, c, d) {
    var e = a.ya(),
        f = a.path.toString();this.f("Listen called for " + f + " " + e);this.$[f] = this.$[f] || {};E(xf(a.n) || !T(a.n), "listen() called for non-default but complete query");E(!this.$[f][e], "listen() called twice for same path/queryId.");a = { G: d, ld: b, og: a, tag: c };this.$[f][e] = a;this.ma && Gg(this, a);
  };
  function Gg(a, b) {
    var c = b.og,
        d = c.path.toString(),
        e = c.ya();a.f("Listen on " + d + " for " + e);var f = { p: d };b.tag && (f.q = wf(c.n), f.t = b.tag);f.h = b.ld();a.ua("q", f, function (f) {
      var k = f.d,
          m = f.s;if (k && "object" === (typeof k === "undefined" ? "undefined" : _typeof(k)) && Hb(k, "w")) {
        var l = A(k, "w");da(l) && 0 <= Fa(l, "no_index") && L("Using an unspecified index. Consider adding " + ('".indexOn": "' + c.n.g.toString() + '"') + " at " + c.path.toString() + " to your security rules for better performance");
      }(a.$[d] && a.$[d][e]) === b && (a.f("listen response", f), "ok" !== m && Hg(a, d, e), b.G && b.G(m, k));
    });
  }g.pf = function (a) {
    this.pb = a;this.f("Auth token refreshed");this.pb ? Ig(this) : this.ma && this.ua("unauth", {}, function () {});if (a && 40 === a.length || jd(a)) this.f("Admin auth credential detected.  Reducing max reconnect time."), this.td = 3E4;
  };function Ig(a) {
    if (a.ma && a.pb) {
      var b = a.pb,
          c = { cred: b };a.Je && (c.authvar = a.Je);a.ua("auth", c, function (c) {
        var e = c.s;c = c.d || "error";a.pb === b && ("ok" === e ? this.ke = 0 : Jg(a, e, c));
      });
    }
  }
  g.Df = function (a, b) {
    var c = a.path.toString(),
        d = a.ya();this.f("Unlisten called for " + c + " " + d);E(xf(a.n) || !T(a.n), "unlisten() called for non-default but complete query");if (Hg(this, c, d) && this.ma) {
      var e = wf(a.n);this.f("Unlisten on " + c + " for " + d);c = { p: c };b && (c.q = e, c.t = b);this.ua("n", c);
    }
  };g.re = function (a, b, c) {
    this.ma ? Kg(this, "o", a, b, c) : this.Lc.push({ we: a, action: "o", data: b, G: c });
  };g.ff = function (a, b, c) {
    this.ma ? Kg(this, "om", a, b, c) : this.Lc.push({ we: a, action: "om", data: b, G: c });
  };
  g.xd = function (a, b) {
    this.ma ? Kg(this, "oc", a, null, b) : this.Lc.push({ we: a, action: "oc", data: null, G: b });
  };function Kg(a, b, c, d, e) {
    c = { p: c, d: d };a.f("onDisconnect " + b, c);a.ua(b, c, function (a) {
      e && setTimeout(function () {
        e(a.s, a.d);
      }, Math.floor(0));
    });
  }g.put = function (a, b, c, d) {
    Lg(this, "p", a, b, c, d);
  };g.df = function (a, b, c, d) {
    Lg(this, "m", a, b, c, d);
  };function Lg(a, b, c, d, e, f) {
    d = { p: c, d: d };p(f) && (d.h = f);a.pa.push({ action: b, rf: d, G: e });a.Pc++;b = a.pa.length - 1;a.ma ? Mg(a, b) : a.f("Buffering put: " + c);
  }
  function Mg(a, b) {
    var c = a.pa[b].action,
        d = a.pa[b].rf,
        e = a.pa[b].G;a.pa[b].pg = a.ma;a.ua(c, d, function (d) {
      a.f(c + " response", d);delete a.pa[b];a.Pc--;0 === a.Pc && (a.pa = []);e && e(d.s, d.d);
    });
  }g.ye = function (a) {
    this.ma && (a = { c: a }, this.f("reportStats", a), this.ua("s", a, function (a) {
      "ok" !== a.s && this.f("reportStats", "Error sending stats: " + a.d);
    }));
  };
  g.wd = function (a) {
    if ("r" in a) {
      this.f("from server: " + B(a));var b = a.r,
          c = this.Gd[b];c && (delete this.Gd[b], c(a.b));
    } else {
      if ("error" in a) throw "A server-side error has occurred: " + a.error;"a" in a && (b = a.a, a = a.b, this.f("handleServerMessage", b, a), "d" === b ? this.Hb(a.p, a.d, !1, a.t) : "m" === b ? this.Hb(a.p, a.d, !0, a.t) : "c" === b ? Ng(this, a.p, a.q) : "ac" === b ? Jg(this, a.s, a.d) : "sd" === b ? this.ze ? this.ze(a) : "msg" in a && "undefined" !== typeof console && console.log("FIREBASE: " + a.msg.replace("\n", "\nFIREBASE: ")) : Wc("Unrecognized action received from server: " + B(b) + "\nAre you using the latest client?"));
    }
  };g.Mc = function (a, b) {
    this.f("connection ready");this.ma = !0;this.Bc = new Date().getTime();this.ue({ serverTimeOffset: a - new Date().getTime() });this.Db = b;if (this.Ue) {
      var c = {};c["sdk.js." + firebase.SDK_VERSION.replace(/\./g, "-")] = 1;Pb() ? c["framework.cordova"] = 1 : "object" === (typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) && "ReactNative" === navigator.product && (c["framework.reactnative"] = 1);this.ye(c);
    }Og(this);this.Ue = !1;this.Kc(!0);
  };
  function Eg(a, b) {
    E(!a.Ia, "Scheduling a connect when we're already connected/ing?");a.vb && clearTimeout(a.vb);a.vb = setTimeout(function () {
      a.vb = null;Pg(a);
    }, Math.floor(b));
  }g.ig = function (a) {
    a && !this.Nb && this.Va === this.td && (this.f("Window became visible.  Reducing delay."), this.Va = 1E3, this.Ia || Eg(this, 0));this.Nb = a;
  };g.hg = function (a) {
    a ? (this.f("Browser went online."), this.Va = 1E3, this.Ia || Eg(this, 0)) : (this.f("Browser went offline.  Killing connection."), this.Ia && this.Ia.close());
  };
  g.hf = function () {
    this.f("data client disconnected");this.ma = !1;this.Ia = null;for (var a = 0; a < this.pa.length; a++) {
      var b = this.pa[a];b && "h" in b.rf && b.pg && (b.G && b.G("disconnect"), delete this.pa[a], this.Pc--);
    }0 === this.Pc && (this.pa = []);this.Gd = {};Qg(this) && (this.Nb ? this.Bc && (3E4 < new Date().getTime() - this.Bc && (this.Va = 1E3), this.Bc = null) : (this.f("Window isn't visible.  Delaying reconnect."), this.Va = this.td, this.me = new Date().getTime()), a = Math.max(0, this.Va - (new Date().getTime() - this.me)), a *= Math.random(), this.f("Trying to reconnect in " + a + "ms"), Eg(this, a), this.Va = Math.min(this.td, 1.3 * this.Va));this.Kc(!1);
  };
  function Pg(a) {
    if (Qg(a)) {
      a.f("Making a connection attempt");a.me = new Date().getTime();a.Bc = null;var b = r(a.wd, a),
          c = r(a.Mc, a),
          d = r(a.hf, a),
          e = a.id + ":" + Fg++,
          f = a.Db,
          h = !1,
          k = null,
          m = function m() {
        k ? k.close() : (h = !0, d());
      };a.Ia = { close: m, ua: function ua(a) {
          E(k, "sendRequest call when we're not connected not allowed.");k.ua(a);
        } };var l = a.de;a.de = !1;a.Vd.getToken(l).then(function (l) {
        h ? I("getToken() completed but was canceled") : (I("getToken() completed. Creating connection."), a.pb = l && l.accessToken, k = new qg(e, a.M, b, c, d, function (b) {
          L(b + " (" + a.M.toString() + ")");a.eb("server_kill");
        }, f));
      }).then(null, function (b) {
        a.f("Failed to get token: " + b);h || m();
      });
    }
  }g.eb = function (a) {
    I("Interrupting connection for reason: " + a);this.qd[a] = !0;this.Ia ? this.Ia.close() : (this.vb && (clearTimeout(this.vb), this.vb = null), this.ma && this.hf());
  };g.lc = function (a) {
    I("Resuming connection for reason: " + a);delete this.qd[a];ua(this.qd) && (this.Va = 1E3, this.Ia || Eg(this, 0));
  };
  function Ng(a, b, c) {
    c = c ? Ia(c, function (a) {
      return dd(a);
    }).join("$") : "default";(a = Hg(a, b, c)) && a.G && a.G("permission_denied");
  }function Hg(a, b, c) {
    b = new M(b).toString();var d;p(a.$[b]) ? (d = a.$[b][c], delete a.$[b][c], 0 === na(a.$[b]) && delete a.$[b]) : d = void 0;return d;
  }
  function Jg(a, b, c) {
    I("Auth token revoked: " + b + "/" + c);a.pb = null;a.de = !0;a.Ia.close();"invalid_token" === b && (a.ke++, 3 <= a.ke && (a.Va = 3E4, L("Provided authentication credentials are invalid. This usually indicates your FirebaseApp instance was not initialized correctly. Make sure your apiKey and databaseURL match the values provided for your app at https://console.firebase.google.com/, or if you're using a service account, make sure it's authorized to access the specified databaseURL and is from the correct project.")));
  }
  function Og(a) {
    Ig(a);t(a.$, function (b) {
      t(b, function (b) {
        Gg(a, b);
      });
    });for (var b = 0; b < a.pa.length; b++) {
      a.pa[b] && Mg(a, b);
    }for (; a.Lc.length;) {
      b = a.Lc.shift(), Kg(a, b.action, b.we, b.data, b.G);
    }
  }function Qg(a) {
    var b;b = Pe.Wb().ic;return ua(a.qd) && b;
  };function Rg(a) {
    this.X = a;
  }var Sg = new Rg(new oe(null));function Tg(a, b, c) {
    if (b.e()) return new Rg(new oe(c));var d = se(a.X, b);if (null != d) {
      var e = d.path,
          d = d.value;b = R(e, b);d = d.F(b, c);return new Rg(a.X.set(e, d));
    }a = Ld(a.X, b, new oe(c));return new Rg(a);
  }function Ug(a, b, c) {
    var d = a;Ib(c, function (a, c) {
      d = Tg(d, b.m(a), c);
    });return d;
  }Rg.prototype.Ed = function (a) {
    if (a.e()) return Sg;a = Ld(this.X, a, Q);return new Rg(a);
  };function Vg(a, b) {
    var c = se(a.X, b);return null != c ? a.X.get(c.path).Q(R(c.path, b)) : null;
  }
  function Wg(a) {
    var b = [],
        c = a.X.value;null != c ? c.J() || c.P(N, function (a, c) {
      b.push(new O(a, c));
    }) : a.X.children.ia(function (a, c) {
      null != c.value && b.push(new O(a, c.value));
    });return b;
  }function Xg(a, b) {
    if (b.e()) return a;var c = Vg(a, b);return null != c ? new Rg(new oe(c)) : new Rg(a.X.subtree(b));
  }Rg.prototype.e = function () {
    return this.X.e();
  };Rg.prototype.apply = function (a) {
    return Yg(C, this.X, a);
  };
  function Yg(a, b, c) {
    if (null != b.value) return c.F(a, b.value);var d = null;b.children.ia(function (b, f) {
      ".priority" === b ? (E(null !== f.value, "Priority writes must always be leaf nodes"), d = f.value) : c = Yg(a.m(b), f, c);
    });c.Q(a).e() || null === d || (c = c.F(a.m(".priority"), d));return c;
  };function Zg() {
    this.T = Sg;this.la = [];this.Cc = -1;
  }function $g(a, b) {
    for (var c = 0; c < a.la.length; c++) {
      var d = a.la[c];if (d.Zc === b) return d;
    }return null;
  }g = Zg.prototype;
  g.Ed = function (a) {
    var b = Ma(this.la, function (b) {
      return b.Zc === a;
    });E(0 <= b, "removeWrite called with nonexistent writeId.");var c = this.la[b];this.la.splice(b, 1);for (var d = c.visible, e = !1, f = this.la.length - 1; d && 0 <= f;) {
      var h = this.la[f];h.visible && (f >= b && ah(h, c.path) ? d = !1 : c.path.contains(h.path) && (e = !0));f--;
    }if (d) {
      if (e) this.T = bh(this.la, ch, C), this.Cc = 0 < this.la.length ? this.la[this.la.length - 1].Zc : -1;else if (c.Ja) this.T = this.T.Ed(c.path);else {
        var k = this;t(c.children, function (a, b) {
          k.T = k.T.Ed(c.path.m(b));
        });
      }return !0;
    }return !1;
  };
  g.Ba = function (a, b, c, d) {
    if (c || d) {
      var e = Xg(this.T, a);return !d && e.e() ? b : d || null != b || null != Vg(e, C) ? (e = bh(this.la, function (b) {
        return (b.visible || d) && (!c || !(0 <= Fa(c, b.Zc))) && (b.path.contains(a) || a.contains(b.path));
      }, a), b = b || F, e.apply(b)) : null;
    }e = Vg(this.T, a);if (null != e) return e;e = Xg(this.T, a);return e.e() ? b : null != b || null != Vg(e, C) ? (b = b || F, e.apply(b)) : null;
  };
  g.sc = function (a, b) {
    var c = F,
        d = Vg(this.T, a);if (d) d.J() || d.P(N, function (a, b) {
      c = c.U(a, b);
    });else if (b) {
      var e = Xg(this.T, a);b.P(N, function (a, b) {
        var d = Xg(e, new M(a)).apply(b);c = c.U(a, d);
      });Ga(Wg(e), function (a) {
        c = c.U(a.name, a.S);
      });
    } else e = Xg(this.T, a), Ga(Wg(e), function (a) {
      c = c.U(a.name, a.S);
    });return c;
  };g.$c = function (a, b, c, d) {
    E(c || d, "Either existingEventSnap or existingServerSnap must exist");a = a.m(b);if (null != Vg(this.T, a)) return null;a = Xg(this.T, a);return a.e() ? d.Q(b) : a.apply(d.Q(b));
  };
  g.rc = function (a, b, c) {
    a = a.m(b);var d = Vg(this.T, a);return null != d ? d : nc(c, b) ? Xg(this.T, a).apply(c.j().R(b)) : null;
  };g.mc = function (a) {
    return Vg(this.T, a);
  };g.Xd = function (a, b, c, d, e, f) {
    var h;a = Xg(this.T, a);h = Vg(a, C);if (null == h) if (null != b) h = a.apply(b);else return [];h = h.ob(f);if (h.e() || h.J()) return [];b = [];a = Se(f);e = e ? h.$b(c, f) : h.Yb(c, f);for (f = K(e); f && b.length < d;) {
      0 !== a(f, c) && b.push(f), f = K(e);
    }return b;
  };
  function ah(a, b) {
    return a.Ja ? a.path.contains(b) : !!sa(a.children, function (c, d) {
      return a.path.m(d).contains(b);
    });
  }function ch(a) {
    return a.visible;
  }
  function bh(a, b, c) {
    for (var d = Sg, e = 0; e < a.length; ++e) {
      var f = a[e];if (b(f)) {
        var h = f.path;if (f.Ja) c.contains(h) ? (h = R(c, h), d = Tg(d, h, f.Ja)) : h.contains(c) && (h = R(h, c), d = Tg(d, C, f.Ja.Q(h)));else if (f.children) {
          if (c.contains(h)) h = R(c, h), d = Ug(d, h, f.children);else {
            if (h.contains(c)) if (h = R(h, c), h.e()) d = Ug(d, C, f.children);else if (f = A(f.children, J(h))) f = f.Q(D(h)), d = Tg(d, C, f);
          }
        } else throw Pc("WriteRecord should have .snap or .children");
      }
    }return d;
  }function dh(a, b) {
    this.Mb = a;this.X = b;
  }g = dh.prototype;
  g.Ba = function (a, b, c) {
    return this.X.Ba(this.Mb, a, b, c);
  };g.sc = function (a) {
    return this.X.sc(this.Mb, a);
  };g.$c = function (a, b, c) {
    return this.X.$c(this.Mb, a, b, c);
  };g.mc = function (a) {
    return this.X.mc(this.Mb.m(a));
  };g.Xd = function (a, b, c, d, e) {
    return this.X.Xd(this.Mb, a, b, c, d, e);
  };g.rc = function (a, b) {
    return this.X.rc(this.Mb, a, b);
  };g.m = function (a) {
    return new dh(this.Mb.m(a), this.X);
  };function Ke() {
    this.k = this.B = null;
  }Ke.prototype.find = function (a) {
    if (null != this.B) return this.B.Q(a);if (a.e() || null == this.k) return null;var b = J(a);a = D(a);return this.k.contains(b) ? this.k.get(b).find(a) : null;
  };function Me(a, b, c) {
    if (b.e()) a.B = c, a.k = null;else if (null !== a.B) a.B = a.B.F(b, c);else {
      null == a.k && (a.k = new Ge());var d = J(b);a.k.contains(d) || a.k.add(d, new Ke());a = a.k.get(d);b = D(b);Me(a, b, c);
    }
  }
  function eh(a, b) {
    if (b.e()) return a.B = null, a.k = null, !0;if (null !== a.B) {
      if (a.B.J()) return !1;var c = a.B;a.B = null;c.P(N, function (b, c) {
        Me(a, new M(b), c);
      });return eh(a, b);
    }return null !== a.k ? (c = J(b), b = D(b), a.k.contains(c) && eh(a.k.get(c), b) && a.k.remove(c), a.k.e() ? (a.k = null, !0) : !1) : !0;
  }function Le(a, b, c) {
    null !== a.B ? c(b, a.B) : a.P(function (a, e) {
      var f = new M(b.toString() + "/" + a);Le(e, f, c);
    });
  }Ke.prototype.P = function (a) {
    null !== this.k && He(this.k, function (b, c) {
      a(b, c);
    });
  };function U(a, b) {
    this.ta = a;this.qa = b;
  }U.prototype.cancel = function (a) {
    x("Firebase.onDisconnect().cancel", 0, 1, arguments.length);y("Firebase.onDisconnect().cancel", 1, a, !0);var b = new Eb();this.ta.xd(this.qa, Fb(b, a));return b.ra;
  };U.prototype.cancel = U.prototype.cancel;U.prototype.remove = function (a) {
    x("Firebase.onDisconnect().remove", 0, 1, arguments.length);de("Firebase.onDisconnect().remove", this.qa);y("Firebase.onDisconnect().remove", 1, a, !0);var b = new Eb();fh(this.ta, this.qa, null, Fb(b, a));return b.ra;
  };
  U.prototype.remove = U.prototype.remove;U.prototype.set = function (a, b) {
    x("Firebase.onDisconnect().set", 1, 2, arguments.length);de("Firebase.onDisconnect().set", this.qa);Wd("Firebase.onDisconnect().set", a, this.qa, !1);y("Firebase.onDisconnect().set", 2, b, !0);var c = new Eb();fh(this.ta, this.qa, a, Fb(c, b));return c.ra;
  };U.prototype.set = U.prototype.set;
  U.prototype.Kb = function (a, b, c) {
    x("Firebase.onDisconnect().setWithPriority", 2, 3, arguments.length);de("Firebase.onDisconnect().setWithPriority", this.qa);Wd("Firebase.onDisconnect().setWithPriority", a, this.qa, !1);$d("Firebase.onDisconnect().setWithPriority", 2, b);y("Firebase.onDisconnect().setWithPriority", 3, c, !0);var d = new Eb();gh(this.ta, this.qa, a, b, Fb(d, c));return d.ra;
  };U.prototype.setWithPriority = U.prototype.Kb;
  U.prototype.update = function (a, b) {
    x("Firebase.onDisconnect().update", 1, 2, arguments.length);de("Firebase.onDisconnect().update", this.qa);if (da(a)) {
      for (var c = {}, d = 0; d < a.length; ++d) {
        c["" + d] = a[d];
      }a = c;L("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
    }Zd("Firebase.onDisconnect().update", a, this.qa);y("Firebase.onDisconnect().update", 2, b, !0);
    c = new Eb();hh(this.ta, this.qa, a, Fb(c, b));return c.ra;
  };U.prototype.update = U.prototype.update;function V(a, b, c) {
    this.A = a;this.W = b;this.g = c;
  }V.prototype.H = function () {
    x("Firebase.DataSnapshot.val", 0, 0, arguments.length);return this.A.H();
  };V.prototype.val = V.prototype.H;V.prototype.Te = function () {
    x("Firebase.DataSnapshot.exportVal", 0, 0, arguments.length);return this.A.H(!0);
  };V.prototype.exportVal = V.prototype.Te;V.prototype.Uf = function () {
    x("Firebase.DataSnapshot.exists", 0, 0, arguments.length);return !this.A.e();
  };V.prototype.exists = V.prototype.Uf;
  V.prototype.m = function (a) {
    x("Firebase.DataSnapshot.child", 0, 1, arguments.length);fa(a) && (a = String(a));ce("Firebase.DataSnapshot.child", a);var b = new M(a),
        c = this.W.m(b);return new V(this.A.Q(b), c, N);
  };V.prototype.child = V.prototype.m;V.prototype.Fa = function (a) {
    x("Firebase.DataSnapshot.hasChild", 1, 1, arguments.length);ce("Firebase.DataSnapshot.hasChild", a);var b = new M(a);return !this.A.Q(b).e();
  };V.prototype.hasChild = V.prototype.Fa;
  V.prototype.C = function () {
    x("Firebase.DataSnapshot.getPriority", 0, 0, arguments.length);return this.A.C().H();
  };V.prototype.getPriority = V.prototype.C;V.prototype.forEach = function (a) {
    x("Firebase.DataSnapshot.forEach", 1, 1, arguments.length);y("Firebase.DataSnapshot.forEach", 1, a, !1);if (this.A.J()) return !1;var b = this;return !!this.A.P(this.g, function (c, d) {
      return a(new V(d, b.W.m(c), N));
    });
  };V.prototype.forEach = V.prototype.forEach;
  V.prototype.kd = function () {
    x("Firebase.DataSnapshot.hasChildren", 0, 0, arguments.length);return this.A.J() ? !1 : !this.A.e();
  };V.prototype.hasChildren = V.prototype.kd;V.prototype.getKey = function () {
    x("Firebase.DataSnapshot.key", 0, 0, arguments.length);return this.W.getKey();
  };id(V.prototype, "key", V.prototype.getKey);V.prototype.Fb = function () {
    x("Firebase.DataSnapshot.numChildren", 0, 0, arguments.length);return this.A.Fb();
  };V.prototype.numChildren = V.prototype.Fb;
  V.prototype.xb = function () {
    x("Firebase.DataSnapshot.ref", 0, 0, arguments.length);return this.W;
  };id(V.prototype, "ref", V.prototype.xb);function ih(a, b, c) {
    this.Qb = a;this.sb = b;this.ub = c || null;
  }g = ih.prototype;g.sf = function (a) {
    return "value" === a;
  };g.createEvent = function (a, b) {
    var c = b.n.g;return new ic("value", this, new V(a.Ma, b.xb(), c));
  };g.Ub = function (a) {
    var b = this.ub;if ("cancel" === a.ge()) {
      E(this.sb, "Raising a cancel event on a listener with no cancel callback");var c = this.sb;return function () {
        c.call(b, a.error);
      };
    }var d = this.Qb;return function () {
      d.call(b, a.Md);
    };
  };g.Oe = function (a, b) {
    return this.sb ? new jc(this, a, b) : null;
  };
  g.matches = function (a) {
    return a instanceof ih ? a.Qb && this.Qb ? a.Qb === this.Qb && a.ub === this.ub : !0 : !1;
  };g.$e = function () {
    return null !== this.Qb;
  };function jh(a, b, c) {
    this.ha = a;this.sb = b;this.ub = c;
  }g = jh.prototype;g.sf = function (a) {
    a = "children_added" === a ? "child_added" : a;return ("children_removed" === a ? "child_removed" : a) in this.ha;
  };g.Oe = function (a, b) {
    return this.sb ? new jc(this, a, b) : null;
  };
  g.createEvent = function (a, b) {
    E(null != a.Za, "Child events should have a childName.");var c = b.xb().m(a.Za);return new ic(a.type, this, new V(a.Ma, c, b.n.g), a.Dd);
  };g.Ub = function (a) {
    var b = this.ub;if ("cancel" === a.ge()) {
      E(this.sb, "Raising a cancel event on a listener with no cancel callback");var c = this.sb;return function () {
        c.call(b, a.error);
      };
    }var d = this.ha[a.gd];return function () {
      d.call(b, a.Md, a.Dd);
    };
  };
  g.matches = function (a) {
    if (a instanceof jh) {
      if (!this.ha || !a.ha) return !0;if (this.ub === a.ub) {
        var b = na(a.ha);if (b === na(this.ha)) {
          if (1 === b) {
            var b = oa(a.ha),
                c = oa(this.ha);return c === b && (!a.ha[b] || !this.ha[c] || a.ha[b] === this.ha[c]);
          }return ma(this.ha, function (b, c) {
            return a.ha[c] === b;
          });
        }
      }
    }return !1;
  };g.$e = function () {
    return null !== this.ha;
  };function kh() {
    this.Aa = {};
  }g = kh.prototype;g.e = function () {
    return ua(this.Aa);
  };g.gb = function (a, b, c) {
    var d = a.source.Ib;if (null !== d) return d = A(this.Aa, d), E(null != d, "SyncTree gave us an op for an invalid query."), d.gb(a, b, c);var e = [];t(this.Aa, function (d) {
      e = e.concat(d.gb(a, b, c));
    });return e;
  };g.Ob = function (a, b, c, d, e) {
    var f = a.ya(),
        h = A(this.Aa, f);if (!h) {
      var h = c.Ba(e ? d : null),
          k = !1;h ? k = !0 : (h = d instanceof P ? c.sc(d) : F, k = !1);h = new If(a, new Fd(new oc(h, k, !1), new oc(d, e, !1)));this.Aa[f] = h;
    }h.Ob(b);return Lf(h, b);
  };
  g.mb = function (a, b, c) {
    var d = a.ya(),
        e = [],
        f = [],
        h = null != lh(this);if ("default" === d) {
      var k = this;t(this.Aa, function (a, d) {
        f = f.concat(a.mb(b, c));a.e() && (delete k.Aa[d], T(a.W.n) || e.push(a.W));
      });
    } else {
      var m = A(this.Aa, d);m && (f = f.concat(m.mb(b, c)), m.e() && (delete this.Aa[d], T(m.W.n) || e.push(m.W)));
    }h && null == lh(this) && e.push(new W(a.w, a.path));return { rg: e, Sf: f };
  };function mh(a) {
    return Ha(pa(a.Aa), function (a) {
      return !T(a.W.n);
    });
  }g.jb = function (a) {
    var b = null;t(this.Aa, function (c) {
      b = b || c.jb(a);
    });return b;
  };
  function nh(a, b) {
    if (T(b.n)) return lh(a);var c = b.ya();return A(a.Aa, c);
  }function lh(a) {
    return ta(a.Aa, function (a) {
      return T(a.W.n);
    }) || null;
  };function oh(a) {
    this.wa = Q;this.lb = new Zg();this.De = {};this.jc = {};this.Dc = a;
  }function ph(a, b, c, d, e) {
    var f = a.lb,
        h = e;E(d > f.Cc, "Stacking an older write on top of newer ones");p(h) || (h = !0);f.la.push({ path: b, Ja: c, Zc: d, visible: h });h && (f.T = Tg(f.T, b, c));f.Cc = d;return e ? qh(a, new ac(Ce, b, c)) : [];
  }function rh(a, b, c, d) {
    var e = a.lb;E(d > e.Cc, "Stacking an older merge on top of newer ones");e.la.push({ path: b, children: c, Zc: d, visible: !0 });e.T = Ug(e.T, b, c);e.Cc = d;c = qe(c);return qh(a, new kd(Ce, b, c));
  }
  function sh(a, b, c) {
    c = c || !1;var d = $g(a.lb, b);if (a.lb.Ed(b)) {
      var e = Q;null != d.Ja ? e = e.set(C, !0) : Ib(d.children, function (a, b) {
        e = e.set(new M(a), b);
      });return qh(a, new Be(d.path, e, c));
    }return [];
  }function th(a, b, c) {
    c = qe(c);return qh(a, new kd(Ee, b, c));
  }function uh(a, b, c, d) {
    d = vh(a, d);if (null != d) {
      var e = wh(d);d = e.path;e = e.Ib;b = R(d, b);c = new ac(new De(!1, !0, e, !0), b, c);return xh(a, d, c);
    }return [];
  }
  function yh(a, b, c, d) {
    if (d = vh(a, d)) {
      var e = wh(d);d = e.path;e = e.Ib;b = R(d, b);c = qe(c);c = new kd(new De(!1, !0, e, !0), b, c);return xh(a, d, c);
    }return [];
  }
  oh.prototype.Ob = function (a, b) {
    var c = a.path,
        d = null,
        e = !1;xe(this.wa, c, function (a, b) {
      var f = R(a, c);d = d || b.jb(f);e = e || null != lh(b);
    });var f = this.wa.get(c);f ? (e = e || null != lh(f), d = d || f.jb(C)) : (f = new kh(), this.wa = this.wa.set(c, f));var h;null != d ? h = !0 : (h = !1, d = F, Ae(this.wa.subtree(c), function (a, b) {
      var c = b.jb(C);c && (d = d.U(a, c));
    }));var k = null != nh(f, a);if (!k && !T(a.n)) {
      var m = zh(a);E(!(m in this.jc), "View does not exist, but we have a tag");var l = Ah++;this.jc[m] = l;this.De["_" + l] = m;
    }h = f.Ob(a, b, new dh(c, this.lb), d, h);k || e || (f = nh(f, a), h = h.concat(Bh(this, a, f)));return h;
  };
  oh.prototype.mb = function (a, b, c) {
    var d = a.path,
        e = this.wa.get(d),
        f = [];if (e && ("default" === a.ya() || null != nh(e, a))) {
      f = e.mb(a, b, c);e.e() && (this.wa = this.wa.remove(d));e = f.rg;f = f.Sf;b = -1 !== Ma(e, function (a) {
        return T(a.n);
      });var h = ve(this.wa, d, function (a, b) {
        return null != lh(b);
      });if (b && !h && (d = this.wa.subtree(d), !d.e())) for (var d = Ch(d), k = 0; k < d.length; ++k) {
        var m = d[k],
            l = m.W,
            m = Dh(this, m);this.Dc.Ae(Eh(l), Fh(this, l), m.ld, m.G);
      }if (!h && 0 < e.length && !c) if (b) this.Dc.Od(Eh(a), null);else {
        var u = this;Ga(e, function (a) {
          a.ya();
          var b = u.jc[zh(a)];u.Dc.Od(Eh(a), b);
        });
      }Gh(this, e);
    }return f;
  };oh.prototype.Ba = function (a, b) {
    var c = this.lb,
        d = ve(this.wa, a, function (b, c) {
      var d = R(b, a);if (d = c.jb(d)) return d;
    });return c.Ba(a, d, b, !0);
  };function Ch(a) {
    return te(a, function (a, c, d) {
      if (c && null != lh(c)) return [lh(c)];var e = [];c && (e = mh(c));t(d, function (a) {
        e = e.concat(a);
      });return e;
    });
  }function Gh(a, b) {
    for (var c = 0; c < b.length; ++c) {
      var d = b[c];if (!T(d.n)) {
        var d = zh(d),
            e = a.jc[d];delete a.jc[d];delete a.De["_" + e];
      }
    }
  }
  function Eh(a) {
    return T(a.n) && !xf(a.n) ? a.xb() : a;
  }function Bh(a, b, c) {
    var d = b.path,
        e = Fh(a, b);c = Dh(a, c);b = a.Dc.Ae(Eh(b), e, c.ld, c.G);d = a.wa.subtree(d);if (e) E(null == lh(d.value), "If we're adding a query, it shouldn't be shadowed");else for (e = te(d, function (a, b, c) {
      if (!a.e() && b && null != lh(b)) return [Jf(lh(b))];var d = [];b && (d = d.concat(Ia(mh(b), function (a) {
        return a.W;
      })));t(c, function (a) {
        d = d.concat(a);
      });return d;
    }), d = 0; d < e.length; ++d) {
      c = e[d], a.Dc.Od(Eh(c), Fh(a, c));
    }return b;
  }
  function Dh(a, b) {
    var c = b.W,
        d = Fh(a, c);return { ld: function ld() {
        return (b.u() || F).hash();
      }, G: function G(b) {
        if ("ok" === b) {
          if (d) {
            var f = c.path;if (b = vh(a, d)) {
              var h = wh(b);b = h.path;h = h.Ib;f = R(b, f);f = new Zb(new De(!1, !0, h, !0), f);b = xh(a, b, f);
            } else b = [];
          } else b = qh(a, new Zb(Ee, c.path));return b;
        }f = "Unknown Error";"too_big" === b ? f = "The data requested exceeds the maximum size that can be accessed with a single request." : "permission_denied" == b ? f = "Client doesn't have permission to access the desired data." : "unavailable" == b && (f = "The service is unavailable");f = Error(b + " at " + c.path.toString() + ": " + f);f.code = b.toUpperCase();return a.mb(c, null, f);
      } };
  }function zh(a) {
    return a.path.toString() + "$" + a.ya();
  }function wh(a) {
    var b = a.indexOf("$");E(-1 !== b && b < a.length - 1, "Bad queryKey.");return { Ib: a.substr(b + 1), path: new M(a.substr(0, b)) };
  }function vh(a, b) {
    var c = a.De,
        d = "_" + b;return d in c ? c[d] : void 0;
  }function Fh(a, b) {
    var c = zh(b);return A(a.jc, c);
  }var Ah = 1;
  function xh(a, b, c) {
    var d = a.wa.get(b);E(d, "Missing sync point for query tag that we're tracking");return d.gb(c, new dh(b, a.lb), null);
  }function qh(a, b) {
    return Hh(a, b, a.wa, null, new dh(C, a.lb));
  }function Hh(a, b, c, d, e) {
    if (b.path.e()) return Ih(a, b, c, d, e);var f = c.get(C);null == d && null != f && (d = f.jb(C));var h = [],
        k = J(b.path),
        m = b.Nc(k);if ((c = c.children.get(k)) && m) var l = d ? d.R(k) : null,
        k = e.m(k),
        h = h.concat(Hh(a, m, c, l, k));f && (h = h.concat(f.gb(b, e, d)));return h;
  }
  function Ih(a, b, c, d, e) {
    var f = c.get(C);null == d && null != f && (d = f.jb(C));var h = [];c.children.ia(function (c, f) {
      var l = d ? d.R(c) : null,
          u = e.m(c),
          z = b.Nc(c);z && (h = h.concat(Ih(a, z, f, l, u)));
    });f && (h = h.concat(f.gb(b, e, d)));return h;
  };function X(a, b, c, d) {
    this.w = a;this.path = b;this.n = c;this.Oc = d;
  }
  function Jh(a) {
    var b = null,
        c = null;a.ka && (b = qd(a));a.na && (c = sd(a));if (a.g === Md) {
      if (a.ka) {
        if ("[MIN_NAME]" != pd(a)) throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if ("string" !== typeof b) throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");
      }if (a.na) {
        if ("[MAX_NAME]" != rd(a)) throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if ("string" !== typeof c) throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");
      }
    } else if (a.g === N) {
      if (null != b && !Vd(b) || null != c && !Vd(c)) throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");
    } else if (E(a.g instanceof Ue || a.g === $e, "unknown index type."), null != b && "object" === (typeof b === "undefined" ? "undefined" : _typeof(b)) || null != c && "object" === (typeof c === "undefined" ? "undefined" : _typeof(c))) throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
  }function Kh(a) {
    if (a.ka && a.na && a.xa && (!a.xa || "" === a.oc)) throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");
  }function Lh(a, b) {
    if (!0 === a.Oc) throw Error(b + ": You can't combine multiple orderBy calls.");
  }g = X.prototype;g.xb = function () {
    x("Query.ref", 0, 0, arguments.length);return new W(this.w, this.path);
  };
  g.hc = function (a, b, c, d) {
    x("Query.on", 2, 4, arguments.length);ae("Query.on", a, !1);y("Query.on", 2, b, !1);var e = Mh("Query.on", c, d);if ("value" === a) Nh(this.w, this, new ih(b, e.cancel || null, e.Pa || null));else {
      var f = {};f[a] = b;Nh(this.w, this, new jh(f, e.cancel, e.Pa));
    }return b;
  };
  g.Jc = function (a, b, c) {
    x("Query.off", 0, 3, arguments.length);ae("Query.off", a, !0);y("Query.off", 2, b, !0);Cb("Query.off", 3, c);var d = null,
        e = null;"value" === a ? d = new ih(b || null, null, c || null) : a && (b && (e = {}, e[a] = b), d = new jh(e, null, c || null));e = this.w;d = ".info" === J(this.path) ? e.pd.mb(this, d) : e.K.mb(this, d);tc(e.da, this.path, d);
  };
  g.jg = function (a, b) {
    function c(k) {
      f && (f = !1, e.Jc(a, c), b && b.call(d.Pa, k), h.resolve(k));
    }x("Query.once", 1, 4, arguments.length);ae("Query.once", a, !1);y("Query.once", 2, b, !0);var d = Mh("Query.once", arguments[2], arguments[3]),
        e = this,
        f = !0,
        h = new Eb();Gb(h.ra);this.hc(a, c, function (b) {
      e.Jc(a, c);d.cancel && d.cancel.call(d.Pa, b);h.reject(b);
    });return h.ra;
  };
  g.ne = function (a) {
    x("Query.limitToFirst", 1, 1, arguments.length);if (!fa(a) || Math.floor(a) !== a || 0 >= a) throw Error("Query.limitToFirst: First argument must be a positive integer.");if (this.n.xa) throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w, this.path, this.n.ne(a), this.Oc);
  };
  g.oe = function (a) {
    x("Query.limitToLast", 1, 1, arguments.length);if (!fa(a) || Math.floor(a) !== a || 0 >= a) throw Error("Query.limitToLast: First argument must be a positive integer.");if (this.n.xa) throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w, this.path, this.n.oe(a), this.Oc);
  };
  g.kg = function (a) {
    x("Query.orderByChild", 1, 1, arguments.length);if ("$key" === a) throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if ("$priority" === a) throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if ("$value" === a) throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');ce("Query.orderByChild", a);Lh(this, "Query.orderByChild");var b = new M(a);if (b.e()) throw Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
    b = new Ue(b);b = vf(this.n, b);Jh(b);return new X(this.w, this.path, b, !0);
  };g.lg = function () {
    x("Query.orderByKey", 0, 0, arguments.length);Lh(this, "Query.orderByKey");var a = vf(this.n, Md);Jh(a);return new X(this.w, this.path, a, !0);
  };g.mg = function () {
    x("Query.orderByPriority", 0, 0, arguments.length);Lh(this, "Query.orderByPriority");var a = vf(this.n, N);Jh(a);return new X(this.w, this.path, a, !0);
  };
  g.ng = function () {
    x("Query.orderByValue", 0, 0, arguments.length);Lh(this, "Query.orderByValue");var a = vf(this.n, $e);Jh(a);return new X(this.w, this.path, a, !0);
  };g.Nd = function (a, b) {
    x("Query.startAt", 0, 2, arguments.length);Wd("Query.startAt", a, this.path, !0);be("Query.startAt", b);var c = this.n.Nd(a, b);Kh(c);Jh(c);if (this.n.ka) throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");p(a) || (b = a = null);return new X(this.w, this.path, c, this.Oc);
  };
  g.fd = function (a, b) {
    x("Query.endAt", 0, 2, arguments.length);Wd("Query.endAt", a, this.path, !0);be("Query.endAt", b);var c = this.n.fd(a, b);Kh(c);Jh(c);if (this.n.na) throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new X(this.w, this.path, c, this.Oc);
  };
  g.Qf = function (a, b) {
    x("Query.equalTo", 1, 2, arguments.length);Wd("Query.equalTo", a, this.path, !1);be("Query.equalTo", b);if (this.n.ka) throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if (this.n.na) throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Nd(a, b).fd(a, b);
  };
  g.toString = function () {
    x("Query.toString", 0, 0, arguments.length);for (var a = this.path, b = "", c = a.Z; c < a.o.length; c++) {
      "" !== a.o[c] && (b += "/" + encodeURIComponent(String(a.o[c])));
    }return this.w.toString() + (b || "/");
  };g.ya = function () {
    var a = dd(wf(this.n));return "{}" === a ? "default" : a;
  };
  function Mh(a, b, c) {
    var d = { cancel: null, Pa: null };if (b && c) d.cancel = b, y(a, 3, d.cancel, !0), d.Pa = c, Cb(a, 4, d.Pa);else if (b) if ("object" === (typeof b === "undefined" ? "undefined" : _typeof(b)) && null !== b) d.Pa = b;else if ("function" === typeof b) d.cancel = b;else throw Error(Bb(a, 3, !0) + " must either be a cancel callback or a context object.");return d;
  }X.prototype.on = X.prototype.hc;X.prototype.off = X.prototype.Jc;X.prototype.once = X.prototype.jg;X.prototype.limitToFirst = X.prototype.ne;X.prototype.limitToLast = X.prototype.oe;X.prototype.orderByChild = X.prototype.kg;
  X.prototype.orderByKey = X.prototype.lg;X.prototype.orderByPriority = X.prototype.mg;X.prototype.orderByValue = X.prototype.ng;X.prototype.startAt = X.prototype.Nd;X.prototype.endAt = X.prototype.fd;X.prototype.equalTo = X.prototype.Qf;X.prototype.toString = X.prototype.toString;id(X.prototype, "ref", X.prototype.xb);function Oh(a) {
    a instanceof Ph || Xc("Don't call new Database() directly - please use firebase.database().");this.ta = a;this.ba = new W(a, C);this.INTERNAL = new Qh(this);
  }var Rh = { TIMESTAMP: { ".sv": "timestamp" } };g = Oh.prototype;g.app = null;g.of = function (a) {
    Sh(this, "ref");x("database.ref", 0, 1, arguments.length);return p(a) ? this.ba.m(a) : this.ba;
  };
  g.qg = function (a) {
    Sh(this, "database.refFromURL");x("database.refFromURL", 1, 1, arguments.length);var b = Yc(a);ee("database.refFromURL", b);var c = b.kc;c.host !== this.ta.M.host && Xc("database.refFromURL: Host name does not match the current database: (found " + c.host + " but expected " + this.ta.M.host + ")");return this.of(b.path.toString());
  };function Sh(a, b) {
    null === a.ta && Xc("Cannot call " + b + " on a deleted database.");
  }g.Zf = function () {
    x("database.goOffline", 0, 0, arguments.length);Sh(this, "goOffline");this.ta.eb();
  };
  g.$f = function () {
    x("database.goOnline", 0, 0, arguments.length);Sh(this, "goOnline");this.ta.lc();
  };Object.defineProperty(Oh.prototype, "app", { get: function get() {
      return this.ta.app;
    } });function Qh(a) {
    this.$a = a;
  }Qh.prototype.delete = function () {
    Sh(this.$a, "delete");var a = Th.Wb(),
        b = this.$a.ta;A(a.nb, b.app.name) !== b && Xc("Database " + b.app.name + " has already been deleted.");b.eb();delete a.nb[b.app.name];this.$a.ta = null;this.$a.ba = null;this.$a = this.$a.INTERNAL = null;return Promise.resolve();
  };Oh.prototype.ref = Oh.prototype.of;
  Oh.prototype.refFromURL = Oh.prototype.qg;Oh.prototype.goOnline = Oh.prototype.$f;Oh.prototype.goOffline = Oh.prototype.Zf;Qh.prototype["delete"] = Qh.prototype.delete;function Ph(a, b, c) {
    this.app = c;var d = new Pf(c);this.M = a;this.Xa = Xf(a);this.Vc = null;this.da = new qc();this.vd = 1;this.Ua = null;if (b || 0 <= ("object" === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window.navigator && window.navigator.userAgent || "").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)) this.va = new Mf(this.M, r(this.Hb, this), d), setTimeout(r(this.Kc, this, !0), 0);else {
      b = c.options.databaseAuthVariableOverride || null;if (null !== b) {
        if ("object" !== ca(b)) throw Error("Only objects are supported for option databaseAuthVariableOverride");
        try {
          B(b);
        } catch (e) {
          throw Error("Invalid authOverride provided: " + e);
        }
      }this.va = this.Ua = new Cg(this.M, r(this.Hb, this), r(this.Kc, this), r(this.ue, this), d, b);
    }var f = this;Qf(d, function (a) {
      f.va.pf(a);
    });this.xg = Yf(a, r(function () {
      return new Uf(this.Xa, this.va);
    }, this));this.nc = new ge();this.ie = new fc();this.pd = new oh({ Ae: function Ae(a, b, c, d) {
        b = [];c = f.ie.j(a.path);c.e() || (b = qh(f.pd, new ac(Ee, a.path, c)), setTimeout(function () {
          d("ok");
        }, 0));return b;
      }, Od: aa });Uh(this, "connected", !1);this.ja = new Ke();this.$a = new Oh(this);this.ed = 0;this.je = null;this.K = new oh({ Ae: function Ae(a, b, c, d) {
        f.va.cf(a, c, b, function (b, c) {
          var e = d(b, c);vc(f.da, a.path, e);
        });return [];
      }, Od: function Od(a, b) {
        f.va.Df(a, b);
      } });
  }g = Ph.prototype;g.toString = function () {
    return (this.M.Sc ? "https://" : "http://") + this.M.host;
  };g.name = function () {
    return this.M.pe;
  };function Vh(a) {
    a = a.ie.j(new M(".info/serverTimeOffset")).H() || 0;return new Date().getTime() + a;
  }function Wh(a) {
    a = a = { timestamp: Vh(a) };a.timestamp = a.timestamp || new Date().getTime();return a;
  }
  g.Hb = function (a, b, c, d) {
    this.ed++;var e = new M(a);b = this.je ? this.je(a, b) : b;a = [];d ? c ? (b = la(b, function (a) {
      return S(a);
    }), a = yh(this.K, e, b, d)) : (b = S(b), a = uh(this.K, e, b, d)) : c ? (d = la(b, function (a) {
      return S(a);
    }), a = th(this.K, e, d)) : (d = S(b), a = qh(this.K, new ac(Ee, e, d)));d = e;0 < a.length && (d = Xh(this, e));vc(this.da, d, a);
  };g.Kc = function (a) {
    Uh(this, "connected", a);!1 === a && Yh(this);
  };g.ue = function (a) {
    var b = this;fd(a, function (a, d) {
      Uh(b, d, a);
    });
  };
  function Uh(a, b, c) {
    b = new M("/.info/" + b);c = S(c);var d = a.ie;d.Jd = d.Jd.F(b, c);c = qh(a.pd, new ac(Ee, b, c));vc(a.da, b, c);
  }g.Kb = function (a, b, c, d) {
    this.f("set", { path: a.toString(), value: b, Dg: c });var e = Wh(this);b = S(b, c);var e = Ne(b, e),
        f = this.vd++,
        e = ph(this.K, a, e, f, !0);rc(this.da, e);var h = this;this.va.put(a.toString(), b.H(!0), function (b, c) {
      var e = "ok" === b;e || L("set at " + a + " failed: " + b);e = sh(h.K, f, !e);vc(h.da, a, e);Zh(d, b, c);
    });e = $h(this, a);Xh(this, e);vc(this.da, e, []);
  };
  g.update = function (a, b, c) {
    this.f("update", { path: a.toString(), value: b });var d = !0,
        e = Wh(this),
        f = {};t(b, function (a, b) {
      d = !1;var c = S(a);f[b] = Ne(c, e);
    });if (d) I("update() called with empty data.  Don't do anything."), Zh(c, "ok");else {
      var h = this.vd++,
          k = rh(this.K, a, f, h);rc(this.da, k);var m = this;this.va.df(a.toString(), b, function (b, d) {
        var e = "ok" === b;e || L("update at " + a + " failed: " + b);var e = sh(m.K, h, !e),
            f = a;0 < e.length && (f = Xh(m, a));vc(m.da, f, e);Zh(c, b, d);
      });b = $h(this, a);Xh(this, b);vc(this.da, a, []);
    }
  };
  function Yh(a) {
    a.f("onDisconnectEvents");var b = Wh(a),
        c = [];Le(Je(a.ja, b), C, function (b, e) {
      c = c.concat(qh(a.K, new ac(Ee, b, e)));var f = $h(a, b);Xh(a, f);
    });a.ja = new Ke();vc(a.da, C, c);
  }g.xd = function (a, b) {
    var c = this;this.va.xd(a.toString(), function (d, e) {
      "ok" === d && eh(c.ja, a);Zh(b, d, e);
    });
  };function fh(a, b, c, d) {
    var e = S(c);a.va.re(b.toString(), e.H(!0), function (c, h) {
      "ok" === c && Me(a.ja, b, e);Zh(d, c, h);
    });
  }function gh(a, b, c, d, e) {
    var f = S(c, d);a.va.re(b.toString(), f.H(!0), function (c, d) {
      "ok" === c && Me(a.ja, b, f);Zh(e, c, d);
    });
  }
  function hh(a, b, c, d) {
    var e = !0,
        f;for (f in c) {
      e = !1;
    }e ? (I("onDisconnect().update() called with empty data.  Don't do anything."), Zh(d, "ok")) : a.va.ff(b.toString(), c, function (e, f) {
      if ("ok" === e) for (var m in c) {
        var l = S(c[m]);Me(a.ja, b.m(m), l);
      }Zh(d, e, f);
    });
  }function Nh(a, b, c) {
    c = ".info" === J(b.path) ? a.pd.Ob(b, c) : a.K.Ob(b, c);tc(a.da, b.path, c);
  }g.eb = function () {
    this.Ua && this.Ua.eb("repo_interrupt");
  };g.lc = function () {
    this.Ua && this.Ua.lc("repo_interrupt");
  };
  g.Be = function (a) {
    if ("undefined" !== typeof console) {
      a ? (this.Vc || (this.Vc = new Rf(this.Xa)), a = this.Vc.get()) : a = this.Xa.get();var b = Ja(qa(a), function (a, b) {
        return Math.max(b.length, a);
      }, 0),
          c;for (c in a) {
        for (var d = a[c], e = c.length; e < b + 2; e++) {
          c += " ";
        }console.log(c + d);
      }
    }
  };g.Ce = function (a) {
    Tf(this.Xa, a);this.xg.yf[a] = !0;
  };g.f = function (a) {
    var b = "";this.Ua && (b = this.Ua.id + ":");I(b, arguments);
  };
  function Zh(a, b, c) {
    a && Tb(function () {
      if ("ok" == b) a(null);else {
        var d = (b || "error").toUpperCase(),
            e = d;c && (e += ": " + c);e = Error(e);e.code = d;a(e);
      }
    });
  };function ai(a, b, c, d, e) {
    function f() {}a.f("transaction on " + b);var h = new W(a, b);h.hc("value", f);c = { path: b, update: c, G: d, status: null, kf: Oc(), Ie: e, uf: 0, Rd: function Rd() {
        h.Jc("value", f);
      }, Td: null, Da: null, bd: null, cd: null, dd: null };d = a.K.Ba(b, void 0) || F;c.bd = d;d = c.update(d.H());if (p(d)) {
      Xd("transaction failed: Data returned ", d, c.path);c.status = 1;e = he(a.nc, b);var k = e.Ea() || [];k.push(c);ie(e, k);"object" === (typeof d === "undefined" ? "undefined" : _typeof(d)) && null !== d && Hb(d, ".priority") ? (k = A(d, ".priority"), E(Vd(k), "Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")) : k = (a.K.Ba(b) || F).C().H();e = Wh(a);d = S(d, k);e = Ne(d, e);c.cd = d;c.dd = e;c.Da = a.vd++;c = ph(a.K, b, e, c.Da, c.Ie);vc(a.da, b, c);bi(a);
    } else c.Rd(), c.cd = null, c.dd = null, c.G && (a = new V(c.bd, new W(a, c.path), N), c.G(null, !1, a));
  }function bi(a, b) {
    var c = b || a.nc;b || ci(a, c);if (null !== c.Ea()) {
      var d = di(a, c);E(0 < d.length, "Sending zero length transaction queue");Ka(d, function (a) {
        return 1 === a.status;
      }) && ei(a, c.path(), d);
    } else c.kd() && c.P(function (b) {
      bi(a, b);
    });
  }
  function ei(a, b, c) {
    for (var d = Ia(c, function (a) {
      return a.Da;
    }), e = a.K.Ba(b, d) || F, d = e, e = e.hash(), f = 0; f < c.length; f++) {
      var h = c[f];E(1 === h.status, "tryToSendTransactionQueue_: items in queue should all be run.");h.status = 2;h.uf++;var k = R(b, h.path),
          d = d.F(k, h.cd);
    }d = d.H(!0);a.va.put(b.toString(), d, function (d) {
      a.f("transaction put response", { path: b.toString(), status: d });var e = [];if ("ok" === d) {
        d = [];for (f = 0; f < c.length; f++) {
          c[f].status = 3;e = e.concat(sh(a.K, c[f].Da));if (c[f].G) {
            var h = c[f].dd,
                k = new W(a, c[f].path);d.push(r(c[f].G, null, null, !0, new V(h, k, N)));
          }c[f].Rd();
        }ci(a, he(a.nc, b));bi(a);vc(a.da, b, e);for (f = 0; f < d.length; f++) {
          Tb(d[f]);
        }
      } else {
        if ("datastale" === d) for (f = 0; f < c.length; f++) {
          c[f].status = 4 === c[f].status ? 5 : 1;
        } else for (L("transaction at " + b.toString() + " failed: " + d), f = 0; f < c.length; f++) {
          c[f].status = 5, c[f].Td = d;
        }Xh(a, b);
      }
    }, e);
  }function Xh(a, b) {
    var c = fi(a, b),
        d = c.path(),
        c = di(a, c);gi(a, c, d);return d;
  }
  function gi(a, b, c) {
    if (0 !== b.length) {
      for (var d = [], e = [], f = Ia(b, function (a) {
        return a.Da;
      }), h = 0; h < b.length; h++) {
        var k = b[h],
            m = R(c, k.path),
            l = !1,
            u;E(null !== m, "rerunTransactionsUnderNode_: relativePath should not be null.");if (5 === k.status) l = !0, u = k.Td, e = e.concat(sh(a.K, k.Da, !0));else if (1 === k.status) if (25 <= k.uf) l = !0, u = "maxretry", e = e.concat(sh(a.K, k.Da, !0));else {
          var z = a.K.Ba(k.path, f) || F;k.bd = z;var G = b[h].update(z.H());p(G) ? (Xd("transaction failed: Data returned ", G, k.path), m = S(G), "object" === (typeof G === "undefined" ? "undefined" : _typeof(G)) && null != G && Hb(G, ".priority") || (m = m.ga(z.C())), z = k.Da, G = Wh(a), G = Ne(m, G), k.cd = m, k.dd = G, k.Da = a.vd++, Na(f, z), e = e.concat(ph(a.K, k.path, G, k.Da, k.Ie)), e = e.concat(sh(a.K, z, !0))) : (l = !0, u = "nodata", e = e.concat(sh(a.K, k.Da, !0)));
        }vc(a.da, c, e);e = [];l && (b[h].status = 3, setTimeout(b[h].Rd, Math.floor(0)), b[h].G && ("nodata" === u ? (k = new W(a, b[h].path), d.push(r(b[h].G, null, null, !1, new V(b[h].bd, k, N)))) : d.push(r(b[h].G, null, Error(u), !1, null))));
      }ci(a, a.nc);for (h = 0; h < d.length; h++) {
        Tb(d[h]);
      }bi(a);
    }
  }
  function fi(a, b) {
    for (var c, d = a.nc; null !== (c = J(b)) && null === d.Ea();) {
      d = he(d, c), b = D(b);
    }return d;
  }function di(a, b) {
    var c = [];hi(a, b, c);c.sort(function (a, b) {
      return a.kf - b.kf;
    });return c;
  }function hi(a, b, c) {
    var d = b.Ea();if (null !== d) for (var e = 0; e < d.length; e++) {
      c.push(d[e]);
    }b.P(function (b) {
      hi(a, b, c);
    });
  }function ci(a, b) {
    var c = b.Ea();if (c) {
      for (var d = 0, e = 0; e < c.length; e++) {
        3 !== c[e].status && (c[d] = c[e], d++);
      }c.length = d;ie(b, 0 < c.length ? c : null);
    }b.P(function (b) {
      ci(a, b);
    });
  }
  function $h(a, b) {
    var c = fi(a, b).path(),
        d = he(a.nc, b);le(d, function (b) {
      ii(a, b);
    });ii(a, d);ke(d, function (b) {
      ii(a, b);
    });return c;
  }
  function ii(a, b) {
    var c = b.Ea();if (null !== c) {
      for (var d = [], e = [], f = -1, h = 0; h < c.length; h++) {
        4 !== c[h].status && (2 === c[h].status ? (E(f === h - 1, "All SENT items should be at beginning of queue."), f = h, c[h].status = 4, c[h].Td = "set") : (E(1 === c[h].status, "Unexpected transaction status in abort"), c[h].Rd(), e = e.concat(sh(a.K, c[h].Da, !0)), c[h].G && d.push(r(c[h].G, null, Error("set"), !1, null))));
      }-1 === f ? ie(b, null) : c.length = f + 1;vc(a.da, b.path(), e);for (h = 0; h < d.length; h++) {
        Tb(d[h]);
      }
    }
  };function Th() {
    this.nb = {};this.Ef = !1;
  }Th.prototype.eb = function () {
    for (var a in this.nb) {
      this.nb[a].eb();
    }
  };Th.prototype.lc = function () {
    for (var a in this.nb) {
      this.nb[a].lc();
    }
  };Th.prototype.ce = function (a) {
    this.Ef = a;
  };ba(Th);Th.prototype.interrupt = Th.prototype.eb;Th.prototype.resume = Th.prototype.lc;var Y = {};Y.pc = Cg;Y.DataConnection = Y.pc;Cg.prototype.wg = function (a, b) {
    this.ua("q", { p: a }, b);
  };Y.pc.prototype.simpleListen = Y.pc.prototype.wg;Cg.prototype.Pf = function (a, b) {
    this.ua("echo", { d: a }, b);
  };Y.pc.prototype.echo = Y.pc.prototype.Pf;Cg.prototype.interrupt = Cg.prototype.eb;Y.Hf = qg;Y.RealTimeConnection = Y.Hf;qg.prototype.sendRequest = qg.prototype.ua;qg.prototype.close = qg.prototype.close;
  Y.ag = function (a) {
    var b = Cg.prototype.put;Cg.prototype.put = function (c, d, e, f) {
      p(f) && (f = a());b.call(this, c, d, e, f);
    };return function () {
      Cg.prototype.put = b;
    };
  };Y.hijackHash = Y.ag;Y.Gf = cc;Y.ConnectionTarget = Y.Gf;Y.ya = function (a) {
    return a.ya();
  };Y.queryIdentifier = Y.ya;Y.dg = function (a) {
    return a.w.Ua.$;
  };Y.listens = Y.dg;Y.ce = function (a) {
    Th.Wb().ce(a);
  };Y.forceRestClient = Y.ce;Y.Context = Th;var Z = { Wf: function Wf() {
      fg = ag = !0;
    } };Z.forceLongPolling = Z.Wf;Z.Xf = function () {
    gg = !0;
  };Z.forceWebSockets = Z.Xf;Z.cg = function () {
    return $f.isAvailable();
  };Z.isWebSocketsAvailable = Z.cg;Z.vg = function (a, b) {
    a.w.Ua.ze = b;
  };Z.setSecurityDebugCallback = Z.vg;Z.Be = function (a, b) {
    a.w.Be(b);
  };Z.stats = Z.Be;Z.Ce = function (a, b) {
    a.w.Ce(b);
  };Z.statsIncrementCounter = Z.Ce;Z.ed = function (a) {
    return a.w.ed;
  };Z.dataUpdateCount = Z.ed;Z.bg = function (a, b) {
    a.w.je = b;
  };Z.interceptServerData = Z.bg;function ji(a, b) {
    this.committed = a;this.snapshot = b;
  };function W(a, b) {
    if (!(a instanceof Ph)) throw Error("new Firebase() no longer supported - use app.database().");X.call(this, a, b, tf, !1);this.then = void 0;this["catch"] = void 0;
  }ka(W, X);g = W.prototype;g.getKey = function () {
    x("Firebase.key", 0, 0, arguments.length);return this.path.e() ? null : Id(this.path);
  };
  g.m = function (a) {
    x("Firebase.child", 1, 1, arguments.length);if (fa(a)) a = String(a);else if (!(a instanceof M)) if (null === J(this.path)) {
      var b = a;b && (b = b.replace(/^\/*\.info(\/|$)/, "/"));ce("Firebase.child", b);
    } else ce("Firebase.child", a);return new W(this.w, this.path.m(a));
  };g.getParent = function () {
    x("Firebase.parent", 0, 0, arguments.length);var a = this.path.parent();return null === a ? null : new W(this.w, a);
  };
  g.Yf = function () {
    x("Firebase.ref", 0, 0, arguments.length);for (var a = this; null !== a.getParent();) {
      a = a.getParent();
    }return a;
  };g.Of = function () {
    return this.w.$a;
  };g.set = function (a, b) {
    x("Firebase.set", 1, 2, arguments.length);de("Firebase.set", this.path);Wd("Firebase.set", a, this.path, !1);y("Firebase.set", 2, b, !0);var c = new Eb();this.w.Kb(this.path, a, null, Fb(c, b));return c.ra;
  };
  g.update = function (a, b) {
    x("Firebase.update", 1, 2, arguments.length);de("Firebase.update", this.path);if (da(a)) {
      for (var c = {}, d = 0; d < a.length; ++d) {
        c["" + d] = a[d];
      }a = c;L("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
    }Zd("Firebase.update", a, this.path);y("Firebase.update", 2, b, !0);c = new Eb();this.w.update(this.path, a, Fb(c, b));return c.ra;
  };
  g.Kb = function (a, b, c) {
    x("Firebase.setWithPriority", 2, 3, arguments.length);de("Firebase.setWithPriority", this.path);Wd("Firebase.setWithPriority", a, this.path, !1);$d("Firebase.setWithPriority", 2, b);y("Firebase.setWithPriority", 3, c, !0);if (".length" === this.getKey() || ".keys" === this.getKey()) throw "Firebase.setWithPriority failed: " + this.getKey() + " is a read-only object.";var d = new Eb();this.w.Kb(this.path, a, b, Fb(d, c));return d.ra;
  };
  g.remove = function (a) {
    x("Firebase.remove", 0, 1, arguments.length);de("Firebase.remove", this.path);y("Firebase.remove", 1, a, !0);return this.set(null, a);
  };
  g.transaction = function (a, b, c) {
    x("Firebase.transaction", 1, 3, arguments.length);de("Firebase.transaction", this.path);y("Firebase.transaction", 1, a, !1);y("Firebase.transaction", 2, b, !0);if (p(c) && "boolean" != typeof c) throw Error(Bb("Firebase.transaction", 3, !0) + "must be a boolean.");if (".length" === this.getKey() || ".keys" === this.getKey()) throw "Firebase.transaction failed: " + this.getKey() + " is a read-only object.";"undefined" === typeof c && (c = !0);var d = new Eb();ga(b) && Gb(d.ra);ai(this.w, this.path, a, function (a, c, h) {
      a ? d.reject(a) : d.resolve(new ji(c, h));ga(b) && b(a, c, h);
    }, c);return d.ra;
  };g.ug = function (a, b) {
    x("Firebase.setPriority", 1, 2, arguments.length);de("Firebase.setPriority", this.path);$d("Firebase.setPriority", 1, a);y("Firebase.setPriority", 2, b, !0);var c = new Eb();this.w.Kb(this.path.m(".priority"), a, null, Fb(c, b));return c.ra;
  };
  g.push = function (a, b) {
    x("Firebase.push", 0, 2, arguments.length);de("Firebase.push", this.path);Wd("Firebase.push", a, this.path, !0);y("Firebase.push", 2, b, !0);var c = Vh(this.w),
        d = Nd(c),
        c = this.m(d);if (null != a) {
      var e = this,
          f = c.set(a, b).then(function () {
        return e.m(d);
      });c.then = r(f.then, f);c["catch"] = r(f.then, f, void 0);ga(b) && Gb(f);
    }return c;
  };g.kb = function () {
    de("Firebase.onDisconnect", this.path);return new U(this.w, this.path);
  };W.prototype.child = W.prototype.m;W.prototype.set = W.prototype.set;W.prototype.update = W.prototype.update;
  W.prototype.setWithPriority = W.prototype.Kb;W.prototype.remove = W.prototype.remove;W.prototype.transaction = W.prototype.transaction;W.prototype.setPriority = W.prototype.ug;W.prototype.push = W.prototype.push;W.prototype.onDisconnect = W.prototype.kb;id(W.prototype, "database", W.prototype.Of);id(W.prototype, "key", W.prototype.getKey);id(W.prototype, "parent", W.prototype.getParent);id(W.prototype, "root", W.prototype.Yf);if ("undefined" === typeof firebase) throw Error("Cannot install Firebase Database - be sure to load firebase-app.js first.");
  try {
    firebase.INTERNAL.registerService("database", function (a) {
      var b = Th.Wb(),
          c = a.options.databaseURL;p(c) || Xc("Can't determine Firebase Database URL.  Be sure to include databaseURL option when calling firebase.intializeApp().");var d = Yc(c),
          c = d.kc;ee("Invalid Firebase Database URL", d);d.path.e() || Xc("Database URL must point to the root of a Firebase Database (not including a child path).");(d = A(b.nb, a.name)) && Xc("FIREBASE INTERNAL ERROR: Database initialized multiple times.");d = new Ph(c, b.Ef, a);b.nb[a.name] = d;return d.$a;
    }, { Reference: W, Query: X, Database: Oh, enableLogging: Uc, INTERNAL: Z, TEST_ACCESS: Y, ServerValue: Rh });
  } catch (ki) {
    Xc("Failed to register the Firebase Database Service (" + ki + ")");
  };
})();

(function () {
  var k,
      aa = aa || {},
      m = this,
      n = function n(a) {
    return void 0 !== a;
  },
      ba = function ba() {},
      p = function p(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);if ("object" == b) {
      if (a) {
        if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
      } else return "null";
    } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
  },
      ca = function ca(a) {
    var b = p(a);return "array" == b || "object" == b && "number" == typeof a.length;
  },
      q = function q(a) {
    return "string" == typeof a;
  },
      r = function r(a) {
    return "function" == p(a);
  },
      da = function da(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);return "object" == b && null != a || "function" == b;
  },
      ea = "closure_uid_" + (1E9 * Math.random() >>> 0),
      fa = 0,
      ga = function ga(a, b, c) {
    return a.call.apply(a.bind, arguments);
  },
      ha = function ha(a, b, c) {
    if (!a) throw Error();if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);return function () {
        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
      };
    }return function () {
      return a.apply(b, arguments);
    };
  },
      _t = function t(a, b, c) {
    _t = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ga : ha;return _t.apply(null, arguments);
  },
      ia = Date.now || function () {
    return +new Date();
  },
      u = function u(a, b) {
    function c() {}
    c.prototype = b.prototype;a.J = b.prototype;a.prototype = new c();a.Ma = function (a, c, f) {
      for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) {
        g[h - 2] = arguments[h];
      }return b.prototype[c].apply(a, g);
    };
  };var ja = function ja(a, b, c) {
    function d() {
      N || (N = !0, b.apply(null, arguments));
    }function e(b) {
      l = setTimeout(function () {
        l = null;a(f, 2 === x);
      }, b);
    }function f(a, b) {
      if (!N) if (a) d.apply(null, arguments);else if (2 === x || B) d.apply(null, arguments);else {
        64 > h && (h *= 2);var c;1 === x ? (x = 2, c = 0) : c = 1E3 * (h + Math.random());e(c);
      }
    }function g(a) {
      Ub || (Ub = !0, N || (null !== l ? (a || (x = 2), clearTimeout(l), e(0)) : a || (x = 1)));
    }var h = 1,
        l = null,
        B = !1,
        x = 0,
        N = !1,
        Ub = !1;e(0);setTimeout(function () {
      B = !0;g(!0);
    }, c);return g;
  };var ka = "https://firebasestorage.googleapis.com";var v = function v(a, b) {
    this.code = "storage/" + a;this.message = "Firebase Storage: " + b;this.serverResponse = null;this.name = "FirebaseError";
  };u(v, Error);var la = function la() {
    return new v("unknown", "An unknown error occurred, please check the error payload for server response.");
  },
      ma = function ma() {
    return new v("canceled", "User canceled the upload/download.");
  },
      na = function na(a, b, c) {
    return new v("invalid-argument", "Invalid argument in `" + b + "` at index " + a + ": " + c);
  },
      oa = function oa() {
    return new v("app-deleted", "The Firebase app was deleted.");
  };var pa = function pa(a, b) {
    for (var c in a) {
      Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
    }
  },
      qa = function qa(a) {
    var b = {};pa(a, function (a, d) {
      b[a] = d;
    });return b;
  };var w = function w(a, b, c, d) {
    this.l = a;this.f = {};this.i = b;this.b = {};this.c = "";this.N = c;this.g = this.a = null;this.h = [200];this.j = d;
  };var ra = { STATE_CHANGED: "state_changed" },
      sa = { RUNNING: "running", PAUSED: "paused", SUCCESS: "success", CANCELED: "canceled", ERROR: "error" },
      ta = function ta(a) {
    switch (a) {case "running":case "pausing":case "canceling":
        return "running";case "paused":
        return "paused";case "success":
        return "success";case "canceled":
        return "canceled";case "error":
        return "error";default:
        return "error";}
  };var y = function y(a) {
    return n(a) && null !== a;
  },
      ua = function ua(a) {
    return "string" === typeof a || a instanceof String;
  };var va = function va(a, b, c) {
    this.f = c;this.c = a;this.g = b;this.b = 0;this.a = null;
  };va.prototype.get = function () {
    var a;0 < this.b ? (this.b--, a = this.a, this.a = a.next, a.next = null) : a = this.c();return a;
  };var wa = function wa(a, b) {
    a.g(b);a.b < a.f && (a.b++, b.next = a.a, a.a = b);
  };var xa = function xa(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, xa);else {
      var b = Error().stack;b && (this.stack = b);
    }a && (this.message = String(a));
  };u(xa, Error);xa.prototype.name = "CustomError";var ya = function ya(a, b, c, d, e) {
    this.reset(a, b, c, d, e);
  };ya.prototype.a = null;var za = 0;ya.prototype.reset = function (a, b, c, d, e) {
    "number" == typeof e || za++;d || ia();this.b = b;delete this.a;
  };var Aa = function Aa(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = a[d];
    }return b;
  },
      Ba = function Ba(a) {
    var b = [],
        c = 0,
        d;for (d in a) {
      b[c++] = d;
    }return b;
  },
      Ca = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
      Da = function Da(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];for (c in d) {
        a[c] = d[c];
      }for (var f = 0; f < Ca.length; f++) {
        c = Ca[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
      }
    }
  };var Ea = function Ea(a) {
    a.prototype.then = a.prototype.then;a.prototype.$goog_Thenable = !0;
  },
      Fa = function Fa(a) {
    if (!a) return !1;try {
      return !!a.$goog_Thenable;
    } catch (b) {
      return !1;
    }
  };var Ga = function Ga(a) {
    Ga[" "](a);return a;
  };Ga[" "] = ba;var Ha = function Ha(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
      d += c.shift() + e.shift();
    }return d + c.join("%s");
  },
      Ia = String.prototype.trim ? function (a) {
    return a.trim();
  } : function (a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
  },
      Ja = function Ja(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  };var Ka = function Ka(a, b) {
    this.a = a;this.b = b;
  };Ka.prototype.clone = function () {
    return new Ka(this.a, this.b);
  };var z = function z(a, b) {
    this.bucket = a;this.path = b;
  },
      La = function La(a) {
    var b = encodeURIComponent;return "/b/" + b(a.bucket) + "/o/" + b(a.path);
  },
      Ma = function Ma(a) {
    for (var b = null, c = [{ ka: /^gs:\/\/([A-Za-z0-9.\-]+)(\/(.*))?$/i, da: { bucket: 1, path: 3 }, ja: function ja(a) {
        "/" === a.path.charAt(a.path.length - 1) && (a.path = a.path.slice(0, -1));
      } }, { ka: /^https?:\/\/firebasestorage\.googleapis\.com\/v[A-Za-z0-9_]+\/b\/([A-Za-z0-9.\-]+)\/o(\/([^?#]*).*)?$/i, da: { bucket: 1, path: 3 }, ja: function ja(a) {
        a.path = decodeURIComponent(a.path);
      } }], d = 0; d < c.length; d++) {
      var e = c[d],
          f = e.ka.exec(a);if (f) {
        b = f[e.da.bucket];(f = f[e.da.path]) || (f = "");b = new z(b, f);e.ja(b);break;
      }
    }if (null == b) throw new v("invalid-url", "Invalid URL '" + a + "'.");return b;
  };var Na = function Na(a, b, c) {
    r(a) || y(b) || y(c) ? (this.next = a, this.error = b || null, this.a = c || null) : (this.next = a.next || null, this.error = a.error || null, this.a = a.complete || null);
  };var Oa = function Oa(a) {
    var b = encodeURIComponent,
        c = "?";pa(a, function (a, e) {
      a = b(a) + "=" + b(e);c = c + a + "&";
    });return c = c.slice(0, -1);
  };var A = function A(a, b, c, d, e, f) {
    this.b = a;this.h = b;this.f = c;this.a = d;this.g = e;this.c = f;
  };k = A.prototype;k.qa = function () {
    return this.b;
  };k.La = function () {
    return this.h;
  };k.Ia = function () {
    return this.f;
  };k.Da = function () {
    return this.a;
  };k.sa = function () {
    if (y(this.a)) {
      var a = this.a.downloadURLs;return y(a) && y(a[0]) ? a[0] : null;
    }return null;
  };k.Ka = function () {
    return this.g;
  };k.Ga = function () {
    return this.c;
  };var Pa = function Pa(a, b) {
    b.unshift(a);xa.call(this, Ha.apply(null, b));b.shift();
  };u(Pa, xa);Pa.prototype.name = "AssertionError";
  var Qa = function Qa(a, b, c, d) {
    var e = "Assertion failed";if (c) var e = e + (": " + c),
        f = d;else a && (e += ": " + a, f = b);throw new Pa("" + e, f || []);
  },
      C = function C(a, b, c) {
    a || Qa("", null, b, Array.prototype.slice.call(arguments, 2));
  },
      Ra = function Ra(a, b) {
    throw new Pa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  },
      Sa = function Sa(a, b, c) {
    r(a) || Qa("Expected function but got %s: %s.", [p(a), a], b, Array.prototype.slice.call(arguments, 2));
  };var D = function D() {
    this.g = this.g;this.s = this.s;
  };D.prototype.g = !1;D.prototype.ga = function () {
    this.g || (this.g = !0, this.C());
  };D.prototype.C = function () {
    if (this.s) for (; this.s.length;) {
      this.s.shift()();
    }
  };var Ta = "closure_listenable_" + (1E6 * Math.random() | 0),
      Ua = 0;var Wa;a: {
    var Xa = m.navigator;if (Xa) {
      var Ya = Xa.userAgent;if (Ya) {
        Wa = Ya;break a;
      }
    }Wa = "";
  }var E = function E(a) {
    return -1 != Wa.indexOf(a);
  };var Za = function Za() {};Za.prototype.a = null;var ab = function ab(a) {
    var b;(b = a.a) || (b = {}, $a(a) && (b[0] = !0, b[1] = !0), b = a.a = b);return b;
  };var bb = Array.prototype.indexOf ? function (a, b, c) {
    C(null != a.length);return Array.prototype.indexOf.call(a, b, c);
  } : function (a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;if (q(a)) return q(b) && 1 == b.length ? a.indexOf(b, c) : -1;for (; c < a.length; c++) {
      if (c in a && a[c] === b) return c;
    }return -1;
  },
      cb = Array.prototype.forEach ? function (a, b, c) {
    C(null != a.length);Array.prototype.forEach.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = q(a) ? a.split("") : a, f = 0; f < d; f++) {
      f in e && b.call(c, e[f], f, a);
    }
  },
      db = Array.prototype.filter ? function (a, b, c) {
    C(null != a.length);return Array.prototype.filter.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = [], f = 0, g = q(a) ? a.split("") : a, h = 0; h < d; h++) {
      if (h in g) {
        var l = g[h];b.call(c, l, h, a) && (e[f++] = l);
      }
    }return e;
  },
      eb = Array.prototype.map ? function (a, b, c) {
    C(null != a.length);return Array.prototype.map.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = Array(d), f = q(a) ? a.split("") : a, g = 0; g < d; g++) {
      g in f && (e[g] = b.call(c, f[g], g, a));
    }return e;
  },
      fb = Array.prototype.some ? function (a, b, c) {
    C(null != a.length);return Array.prototype.some.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = q(a) ? a.split("") : a, f = 0; f < d; f++) {
      if (f in e && b.call(c, e[f], f, a)) return !0;
    }return !1;
  },
      hb = function hb(a) {
    var b;a: {
      b = gb;for (var c = a.length, d = q(a) ? a.split("") : a, e = 0; e < c; e++) {
        if (e in d && b.call(void 0, d[e], e, a)) {
          b = e;break a;
        }
      }b = -1;
    }return 0 > b ? null : q(a) ? a.charAt(b) : a[b];
  },
      ib = function ib(a) {
    if ("array" != p(a)) for (var b = a.length - 1; 0 <= b; b--) {
      delete a[b];
    }a.length = 0;
  },
      jb = function jb(a, b) {
    b = bb(a, b);var c;if (c = 0 <= b) C(null != a.length), Array.prototype.splice.call(a, b, 1);return c;
  },
      kb = function kb(a) {
    var b = a.length;if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) {
        c[d] = a[d];
      }return c;
    }return [];
  };var mb = new va(function () {
    return new lb();
  }, function (a) {
    a.reset();
  }, 100),
      ob = function ob() {
    var a = nb,
        b = null;a.a && (b = a.a, a.a = a.a.next, a.a || (a.b = null), b.next = null);return b;
  },
      lb = function lb() {
    this.next = this.b = this.a = null;
  };lb.prototype.set = function (a, b) {
    this.a = a;this.b = b;this.next = null;
  };lb.prototype.reset = function () {
    this.next = this.b = this.a = null;
  };var pb = function pb(a, b) {
    this.type = a;this.a = this.target = b;this.la = !0;
  };pb.prototype.b = function () {
    this.la = !1;
  };var qb = function qb(a, b, c, d, e) {
    this.listener = a;this.a = null;this.src = b;this.type = c;this.W = !!d;this.N = e;++Ua;this.O = this.V = !1;
  },
      rb = function rb(a) {
    a.O = !0;a.listener = null;a.a = null;a.src = null;a.N = null;
  };var sb = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;var tb = function tb(a, b) {
    b = db(b.split("/"), function (a) {
      return 0 < a.length;
    }).join("/");return 0 === a.length ? b : a + "/" + b;
  },
      ub = function ub(a) {
    var b = a.lastIndexOf("/", a.length - 2);return -1 === b ? a : a.slice(b + 1);
  };var vb = function vb(a) {
    this.src = a;this.a = {};this.b = 0;
  },
      xb = function xb(a, b, c, d, e, f) {
    var g = b.toString();b = a.a[g];b || (b = a.a[g] = [], a.b++);var h = wb(b, c, e, f);-1 < h ? (a = b[h], d || (a.V = !1)) : (a = new qb(c, a.src, g, !!e, f), a.V = d, b.push(a));return a;
  },
      yb = function yb(a, b) {
    var c = b.type;c in a.a && jb(a.a[c], b) && (rb(b), 0 == a.a[c].length && (delete a.a[c], a.b--));
  },
      wb = function wb(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];if (!f.O && f.listener == b && f.W == !!c && f.N == d) return e;
    }return -1;
  };var zb,
      Ab = function Ab() {};u(Ab, Za);var Bb = function Bb(a) {
    return (a = $a(a)) ? new ActiveXObject(a) : new XMLHttpRequest();
  },
      $a = function $a(a) {
    if (!a.b && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
      for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
        var d = b[c];try {
          return new ActiveXObject(d), a.b = d;
        } catch (e) {}
      }throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }return a.b;
  };zb = new Ab();var Cb = function Cb(a) {
    this.a = [];if (a) a: {
      var b;if (a instanceof Cb) {
        if (b = a.H(), a = a.w(), 0 >= this.o()) {
          for (var c = this.a, d = 0; d < b.length; d++) {
            c.push(new Ka(b[d], a[d]));
          }break a;
        }
      } else b = Ba(a), a = Aa(a);for (d = 0; d < b.length; d++) {
        Db(this, b[d], a[d]);
      }
    }
  },
      Db = function Db(a, b, c) {
    var d = a.a;d.push(new Ka(b, c));b = d.length - 1;a = a.a;for (c = a[b]; 0 < b;) {
      if (d = b - 1 >> 1, a[d].a > c.a) a[b] = a[d], b = d;else break;
    }a[b] = c;
  };k = Cb.prototype;k.w = function () {
    for (var a = this.a, b = [], c = a.length, d = 0; d < c; d++) {
      b.push(a[d].b);
    }return b;
  };
  k.H = function () {
    for (var a = this.a, b = [], c = a.length, d = 0; d < c; d++) {
      b.push(a[d].a);
    }return b;
  };k.clone = function () {
    return new Cb(this);
  };k.o = function () {
    return this.a.length;
  };k.I = function () {
    return 0 == this.a.length;
  };k.clear = function () {
    ib(this.a);
  };var Eb = function Eb() {
    this.b = [];this.a = [];
  },
      Fb = function Fb(a) {
    0 == a.b.length && (a.b = a.a, a.b.reverse(), a.a = []);return a.b.pop();
  };Eb.prototype.o = function () {
    return this.b.length + this.a.length;
  };Eb.prototype.I = function () {
    return 0 == this.b.length && 0 == this.a.length;
  };Eb.prototype.clear = function () {
    this.b = [];this.a = [];
  };Eb.prototype.w = function () {
    for (var a = [], b = this.b.length - 1; 0 <= b; --b) {
      a.push(this.b[b]);
    }for (var c = this.a.length, b = 0; b < c; ++b) {
      a.push(this.a[b]);
    }return a;
  };var Gb = function Gb(a) {
    if (a.w && "function" == typeof a.w) return a.w();if (q(a)) return a.split("");if (ca(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++) {
        b.push(a[d]);
      }return b;
    }return Aa(a);
  },
      Hb = function Hb(a, b) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, void 0);else if (ca(a) || q(a)) cb(a, b, void 0);else {
      var c;if (a.H && "function" == typeof a.H) c = a.H();else if (a.w && "function" == typeof a.w) c = void 0;else if (ca(a) || q(a)) {
        c = [];for (var d = a.length, e = 0; e < d; e++) {
          c.push(e);
        }
      } else c = Ba(a);for (var d = Gb(a), e = d.length, f = 0; f < e; f++) {
        b.call(void 0, d[f], c && c[f], a);
      }
    }
  };var Ib = function Ib(a) {
    m.setTimeout(function () {
      throw a;
    }, 0);
  },
      Jb,
      Kb = function Kb() {
    var a = m.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !E("Presto") && (a = function a() {
      var a = document.createElement("IFRAME");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);var b = a.contentWindow,
          a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
          d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host,
          a = _t(function (a) {
        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
      }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
          b.postMessage(c, d);
        } };
    });if ("undefined" !== typeof a && !E("Trident") && !E("MSIE")) {
      var b = new a(),
          c = {},
          d = c;b.port1.onmessage = function () {
        if (n(c.next)) {
          c = c.next;var a = c.fa;c.fa = null;a();
        }
      };return function (a) {
        d.next = { fa: a };d = d.next;b.port2.postMessage(0);
      };
    }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) {
      var b = document.createElement("SCRIPT");b.onreadystatechange = function () {
        b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
      };document.documentElement.appendChild(b);
    } : function (a) {
      m.setTimeout(a, 0);
    };
  };var Lb = "StopIteration" in m ? m.StopIteration : { message: "StopIteration", stack: "" },
      Mb = function Mb() {};Mb.prototype.next = function () {
    throw Lb;
  };Mb.prototype.aa = function () {
    return this;
  };var Nb = function Nb() {
    Cb.call(this);
  };u(Nb, Cb);var Ob = E("Opera"),
      F = E("Trident") || E("MSIE"),
      Pb = E("Edge"),
      Qb = E("Gecko") && !(-1 != Wa.toLowerCase().indexOf("webkit") && !E("Edge")) && !(E("Trident") || E("MSIE")) && !E("Edge"),
      Rb = -1 != Wa.toLowerCase().indexOf("webkit") && !E("Edge"),
      Sb = function Sb() {
    var a = m.document;return a ? a.documentMode : void 0;
  },
      Tb;
  a: {
    var Vb = "",
        Wb = function () {
      var a = Wa;if (Qb) return (/rv\:([^\);]+)(\)|;)/.exec(a)
      );if (Pb) return (/Edge\/([\d\.]+)/.exec(a)
      );if (F) return (/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
      );if (Rb) return (/WebKit\/(\S+)/.exec(a)
      );if (Ob) return (/(?:Version)[ \/]?(\S+)/.exec(a)
      );
    }();Wb && (Vb = Wb ? Wb[1] : "");if (F) {
      var Xb = Sb();if (null != Xb && Xb > parseFloat(Vb)) {
        Tb = String(Xb);break a;
      }
    }Tb = Vb;
  }
  var Yb = Tb,
      Zb = {},
      G = function G(a) {
    var b;if (!(b = Zb[a])) {
      b = 0;for (var c = Ia(String(Yb)).split("."), d = Ia(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
        var g = c[f] || "",
            h = d[f] || "",
            l = /(\d*)(\D*)/g,
            B = /(\d*)(\D*)/g;do {
          var x = l.exec(g) || ["", "", ""],
              N = B.exec(h) || ["", "", ""];if (0 == x[0].length && 0 == N[0].length) break;b = Ja(0 == x[1].length ? 0 : parseInt(x[1], 10), 0 == N[1].length ? 0 : parseInt(N[1], 10)) || Ja(0 == x[2].length, 0 == N[2].length) || Ja(x[2], N[2]);
        } while (0 == b);
      }b = Zb[a] = 0 <= b;
    }return b;
  },
      $b = m.document,
      ac = $b && F ? Sb() || ("CSS1Compat" == $b.compatMode ? parseInt(Yb, 10) : 5) : void 0;var ec = function ec(a, b) {
    bc || cc();dc || (bc(), dc = !0);var c = nb,
        d = mb.get();d.set(a, b);c.b ? c.b.next = d : (C(!c.a), c.a = d);c.b = d;
  },
      bc,
      cc = function cc() {
    if (m.Promise && m.Promise.resolve) {
      var a = m.Promise.resolve(void 0);bc = function bc() {
        a.then(fc);
      };
    } else bc = function bc() {
      var a = fc;!r(m.setImmediate) || m.Window && m.Window.prototype && !E("Edge") && m.Window.prototype.setImmediate == m.setImmediate ? (Jb || (Jb = Kb()), Jb(a)) : m.setImmediate(a);
    };
  },
      dc = !1,
      nb = new function () {
    this.b = this.a = null;
  }(),
      fc = function fc() {
    for (var a; a = ob();) {
      try {
        a.a.call(a.b);
      } catch (b) {
        Ib(b);
      }wa(mb, a);
    }dc = !1;
  };var gc;(gc = !F) || (gc = 9 <= Number(ac));var hc = gc,
      ic = F && !G("9");!Rb || G("528");Qb && G("1.9b") || F && G("8") || Ob && G("9.5") || Rb && G("528");Qb && !G("8") || F && G("9");var jc = function jc(a, b) {
    this.b = {};this.a = [];this.f = this.c = 0;var c = arguments.length;if (1 < c) {
      if (c % 2) throw Error("Uneven number of arguments");for (var d = 0; d < c; d += 2) {
        this.set(arguments[d], arguments[d + 1]);
      }
    } else if (a) {
      a instanceof jc ? (c = a.H(), d = a.w()) : (c = Ba(a), d = Aa(a));for (var e = 0; e < c.length; e++) {
        this.set(c[e], d[e]);
      }
    }
  };k = jc.prototype;k.o = function () {
    return this.c;
  };k.w = function () {
    kc(this);for (var a = [], b = 0; b < this.a.length; b++) {
      a.push(this.b[this.a[b]]);
    }return a;
  };k.H = function () {
    kc(this);return this.a.concat();
  };
  k.I = function () {
    return 0 == this.c;
  };k.clear = function () {
    this.b = {};this.f = this.c = this.a.length = 0;
  };
  var lc = function lc(a, b) {
    return Object.prototype.hasOwnProperty.call(a.b, b) ? (delete a.b[b], a.c--, a.f++, a.a.length > 2 * a.c && kc(a), !0) : !1;
  },
      kc = function kc(a) {
    if (a.c != a.a.length) {
      for (var b = 0, c = 0; b < a.a.length;) {
        var d = a.a[b];Object.prototype.hasOwnProperty.call(a.b, d) && (a.a[c++] = d);b++;
      }a.a.length = c;
    }if (a.c != a.a.length) {
      for (var e = {}, c = b = 0; b < a.a.length;) {
        d = a.a[b], Object.prototype.hasOwnProperty.call(e, d) || (a.a[c++] = d, e[d] = 1), b++;
      }a.a.length = c;
    }
  };k = jc.prototype;
  k.get = function (a, b) {
    return Object.prototype.hasOwnProperty.call(this.b, a) ? this.b[a] : b;
  };k.set = function (a, b) {
    Object.prototype.hasOwnProperty.call(this.b, a) || (this.c++, this.a.push(a), this.f++);this.b[a] = b;
  };k.forEach = function (a, b) {
    for (var c = this.H(), d = 0; d < c.length; d++) {
      var e = c[d],
          f = this.get(e);a.call(b, f, e, this);
    }
  };k.clone = function () {
    return new jc(this);
  };
  k.aa = function (a) {
    kc(this);var b = 0,
        c = this.f,
        d = this,
        e = new Mb();e.next = function () {
      if (c != d.f) throw Error("The map has changed since the iterator was created");if (b >= d.a.length) throw Lb;var e = d.a[b++];return a ? e : d.b[e];
    };return e;
  };var mc = function mc(a, b) {
    pb.call(this, a ? a.type : "");this.c = this.a = this.target = null;if (a) {
      this.type = a.type;this.target = a.target || a.srcElement;this.a = b;if ((b = a.relatedTarget) && Qb) try {
        Ga(b.nodeName);
      } catch (c) {}this.c = a;a.defaultPrevented && this.b();
    }
  };u(mc, pb);mc.prototype.b = function () {
    mc.J.b.call(this);var a = this.c;if (a.preventDefault) a.preventDefault();else if (a.returnValue = !1, ic) try {
      if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1;
    } catch (b) {}
  };var H = function H(a, b) {
    this.a = 0;this.i = void 0;this.c = this.b = this.f = null;this.g = this.h = !1;if (a != ba) try {
      var c = this;a.call(b, function (a) {
        nc(c, 2, a);
      }, function (a) {
        try {
          if (a instanceof Error) throw a;throw Error("Promise rejected.");
        } catch (b) {}nc(c, 3, a);
      });
    } catch (d) {
      nc(this, 3, d);
    }
  },
      oc = function oc() {
    this.next = this.f = this.c = this.a = this.b = null;this.g = !1;
  };oc.prototype.reset = function () {
    this.f = this.c = this.a = this.b = null;this.g = !1;
  };
  var pc = new va(function () {
    return new oc();
  }, function (a) {
    a.reset();
  }, 100),
      qc = function qc(a, b, c) {
    var d = pc.get();d.a = a;d.c = b;d.f = c;return d;
  },
      rc = function rc(a) {
    if (a instanceof H) return a;var b = new H(ba);nc(b, 2, a);return b;
  },
      sc = function sc(a) {
    return new H(function (b, c) {
      c(a);
    });
  };
  H.prototype.then = function (a, b, c) {
    null != a && Sa(a, "opt_onFulfilled should be a function.");null != b && Sa(b, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return tc(this, r(a) ? a : null, r(b) ? b : null, c);
  };Ea(H);H.prototype.l = function (a, b) {
    return tc(this, null, a, b);
  };
  var vc = function vc(a, b) {
    a.b || 2 != a.a && 3 != a.a || uc(a);C(null != b.a);a.c ? a.c.next = b : a.b = b;a.c = b;
  },
      tc = function tc(a, b, c, d) {
    var e = qc(null, null, null);e.b = new H(function (a, g) {
      e.a = b ? function (c) {
        try {
          var e = b.call(d, c);a(e);
        } catch (B) {
          g(B);
        }
      } : a;e.c = c ? function (b) {
        try {
          var e = c.call(d, b);a(e);
        } catch (B) {
          g(B);
        }
      } : g;
    });e.b.f = a;vc(a, e);return e.b;
  };H.prototype.s = function (a) {
    C(1 == this.a);this.a = 0;nc(this, 2, a);
  };H.prototype.m = function (a) {
    C(1 == this.a);this.a = 0;nc(this, 3, a);
  };
  var nc = function nc(a, b, c) {
    if (0 == a.a) {
      a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));a.a = 1;var d;a: {
        var e = c,
            f = a.s,
            g = a.m;if (e instanceof H) null != f && Sa(f, "opt_onFulfilled should be a function."), null != g && Sa(g, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"), vc(e, qc(f || ba, g || null, a)), d = !0;else if (Fa(e)) e.then(f, g, a), d = !0;else {
          if (da(e)) try {
            var h = e.then;if (r(h)) {
              wc(e, h, f, g, a);d = !0;break a;
            }
          } catch (l) {
            g.call(a, l);d = !0;break a;
          }d = !1;
        }
      }d || (a.i = c, a.a = b, a.f = null, uc(a), 3 != b || xc(a, c));
    }
  },
      wc = function wc(a, b, c, d, e) {
    var f = !1,
        g = function g(a) {
      f || (f = !0, c.call(e, a));
    },
        h = function h(a) {
      f || (f = !0, d.call(e, a));
    };try {
      b.call(a, g, h);
    } catch (l) {
      h(l);
    }
  },
      uc = function uc(a) {
    a.h || (a.h = !0, ec(a.j, a));
  },
      yc = function yc(a) {
    var b = null;a.b && (b = a.b, a.b = b.next, b.next = null);a.b || (a.c = null);null != b && C(null != b.a);return b;
  };
  H.prototype.j = function () {
    for (var a; a = yc(this);) {
      var b = this.a,
          c = this.i;if (3 == b && a.c && !a.g) {
        var d;for (d = this; d && d.g; d = d.f) {
          d.g = !1;
        }
      }if (a.b) a.b.f = null, zc(a, b, c);else try {
        a.g ? a.a.call(a.f) : zc(a, b, c);
      } catch (e) {
        Ac.call(null, e);
      }wa(pc, a);
    }this.h = !1;
  };var zc = function zc(a, b, c) {
    2 == b ? a.a.call(a.f, c) : a.c && a.c.call(a.f, c);
  },
      xc = function xc(a, b) {
    a.g = !0;ec(function () {
      a.g && Ac.call(null, b);
    });
  },
      Ac = Ib;var Cc = function Cc(a) {
    this.a = new jc();if (a) {
      a = Gb(a);for (var b = a.length, c = 0; c < b; c++) {
        var d = a[c];this.a.set(Bc(d), d);
      }
    }
  },
      Bc = function Bc(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);return "object" == b && a || "function" == b ? "o" + (a[ea] || (a[ea] = ++fa)) : b.substr(0, 1) + a;
  };k = Cc.prototype;k.o = function () {
    return this.a.o();
  };k.clear = function () {
    this.a.clear();
  };k.I = function () {
    return this.a.I();
  };k.w = function () {
    return this.a.w();
  };k.clone = function () {
    return new Cc(this);
  };k.aa = function () {
    return this.a.aa(!1);
  };var Dc = function Dc(a) {
    return function () {
      var b = [];Array.prototype.push.apply(b, arguments);rc(!0).then(function () {
        a.apply(null, b);
      });
    };
  };var Ec = "closure_lm_" + (1E6 * Math.random() | 0),
      Fc = {},
      Gc = 0,
      Hc = function Hc(a, b, c, d, e) {
    if ("array" == p(b)) {
      for (var f = 0; f < b.length; f++) {
        Hc(a, b[f], c, d, e);
      }return null;
    }c = Ic(c);a && a[Ta] ? (Jc(a), a = xb(a.b, String(b), c, !1, d, e)) : a = Kc(a, b, c, !1, d, e);return a;
  },
      Kc = function Kc(a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");var g = !!e,
        h = Lc(a);h || (a[Ec] = h = new vb(a));c = xb(h, b, c, d, e, f);if (c.a) return c;d = Mc();c.a = d;d.src = a;d.listener = c;if (a.addEventListener) a.addEventListener(b.toString(), d, g);else if (a.attachEvent) a.attachEvent(Nc(b.toString()), d);else throw Error("addEventListener and attachEvent are unavailable.");Gc++;return c;
  },
      Mc = function Mc() {
    var a = Oc,
        b = hc ? function (c) {
      return a.call(b.src, b.listener, c);
    } : function (c) {
      c = a.call(b.src, b.listener, c);if (!c) return c;
    };return b;
  },
      Pc = function Pc(a, b, c, d, e) {
    if ("array" == p(b)) for (var f = 0; f < b.length; f++) {
      Pc(a, b[f], c, d, e);
    } else c = Ic(c), a && a[Ta] ? xb(a.b, String(b), c, !0, d, e) : Kc(a, b, c, !0, d, e);
  },
      Qc = function Qc(a, b, c, d, e) {
    if ("array" == p(b)) for (var f = 0; f < b.length; f++) {
      Qc(a, b[f], c, d, e);
    } else (c = Ic(c), a && a[Ta]) ? (a = a.b, b = String(b).toString(), b in a.a && (f = a.a[b], c = wb(f, c, d, e), -1 < c && (rb(f[c]), C(null != f.length), Array.prototype.splice.call(f, c, 1), 0 == f.length && (delete a.a[b], a.b--)))) : a && (a = Lc(a)) && (b = a.a[b.toString()], a = -1, b && (a = wb(b, c, !!d, e)), (c = -1 < a ? b[a] : null) && Rc(c));
  },
      Rc = function Rc(a) {
    if ("number" != typeof a && a && !a.O) {
      var b = a.src;if (b && b[Ta]) yb(b.b, a);else {
        var c = a.type,
            d = a.a;b.removeEventListener ? b.removeEventListener(c, d, a.W) : b.detachEvent && b.detachEvent(Nc(c), d);Gc--;(c = Lc(b)) ? (yb(c, a), 0 == c.b && (c.src = null, b[Ec] = null)) : rb(a);
      }
    }
  },
      Nc = function Nc(a) {
    return a in Fc ? Fc[a] : Fc[a] = "on" + a;
  },
      Tc = function Tc(a, b, c, d) {
    var e = !0;if (a = Lc(a)) if (b = a.a[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
      var f = b[a];f && f.W == c && !f.O && (f = Sc(f, d), e = e && !1 !== f);
    }return e;
  },
      Sc = function Sc(a, b) {
    var c = a.listener,
        d = a.N || a.src;a.V && Rc(a);return c.call(d, b);
  },
      Oc = function Oc(a, b) {
    if (a.O) return !0;if (!hc) {
      if (!b) a: {
        b = ["window", "event"];for (var c = m, d; d = b.shift();) {
          if (null != c[d]) c = c[d];else {
            b = null;break a;
          }
        }b = c;
      }d = b;b = new mc(d, this);c = !0;if (!(0 > d.keyCode || void 0 != d.returnValue)) {
        a: {
          var e = !1;if (0 == d.keyCode) try {
            d.keyCode = -1;break a;
          } catch (g) {
            e = !0;
          }if (e || void 0 == d.returnValue) d.returnValue = !0;
        }d = [];for (e = b.a; e; e = e.parentNode) {
          d.push(e);
        }a = a.type;for (e = d.length - 1; 0 <= e; e--) {
          b.a = d[e];var f = Tc(d[e], a, !0, b),
              c = c && f;
        }for (e = 0; e < d.length; e++) {
          b.a = d[e], f = Tc(d[e], a, !1, b), c = c && f;
        }
      }return c;
    }return Sc(a, new mc(b, this));
  },
      Lc = function Lc(a) {
    a = a[Ec];return a instanceof vb ? a : null;
  },
      Uc = "__closure_events_fn_" + (1E9 * Math.random() >>> 0),
      Ic = function Ic(a) {
    C(a, "Listener can not be null.");if (r(a)) return a;C(a.handleEvent, "An object listener must have handleEvent method.");
    a[Uc] || (a[Uc] = function (b) {
      return a.handleEvent(b);
    });return a[Uc];
  };var I = function I(a, b) {
    D.call(this);this.l = a || 0;this.c = b || 10;if (this.l > this.c) throw Error("[goog.structs.Pool] Min can not be greater than max");this.a = new Eb();this.b = new Cc();this.i = null;this.U();
  };u(I, D);I.prototype.Y = function () {
    var a = ia();if (!(null != this.i && 0 > a - this.i)) {
      for (var b; 0 < this.a.o() && (b = Fb(this.a), !this.j(b));) {
        this.U();
      }!b && this.o() < this.c && (b = this.h());b && (this.i = a, this.b.a.set(Bc(b), b));return b;
    }
  };var Wc = function Wc(a) {
    var b = Vc;lc(b.b.a, Bc(a)) && b.ba(a);
  };
  I.prototype.ba = function (a) {
    lc(this.b.a, Bc(a));this.j(a) && this.o() < this.c ? this.a.a.push(a) : Xc(a);
  };I.prototype.U = function () {
    for (var a = this.a; this.o() < this.l;) {
      var b = this.h();a.a.push(b);
    }for (; this.o() > this.c && 0 < this.a.o();) {
      Xc(Fb(a));
    }
  };I.prototype.h = function () {
    return {};
  };var Xc = function Xc(a) {
    if ("function" == typeof a.ga) a.ga();else for (var b in a) {
      a[b] = null;
    }
  };I.prototype.j = function (a) {
    return "function" == typeof a.ra ? a.ra() : !0;
  };I.prototype.o = function () {
    return this.a.o() + this.b.o();
  };
  I.prototype.I = function () {
    return this.a.I() && this.b.I();
  };I.prototype.C = function () {
    I.J.C.call(this);if (0 < this.b.o()) throw Error("[goog.structs.Pool] Objects not released");delete this.b;for (var a = this.a; !a.I();) {
      Xc(Fb(a));
    }delete this.a;
  }; /*
     Portions of this code are from MochiKit, received by
     The Closure Authors under the MIT license. All other code is Copyright
     2005-2009 The Closure Authors. All Rights Reserved.
     */
  var Yc = function Yc(a, b) {
    this.c = [];this.m = b || null;this.a = this.h = !1;this.b = void 0;this.j = this.g = !1;this.f = 0;this.i = null;this.s = 0;
  };Yc.prototype.l = function (a, b) {
    this.g = !1;this.h = !0;this.b = b;this.a = !a;Zc(this);
  };var $c = function $c(a, b, c) {
    C(!a.j, "Blocking Deferreds can not be re-used");a.c.push([b, c, void 0]);a.h && Zc(a);
  };Yc.prototype.then = function (a, b, c) {
    var d,
        e,
        f = new H(function (a, b) {
      d = a;e = b;
    });$c(this, d, function (a) {
      e(a);
    });return f.then(a, b, c);
  };Ea(Yc);
  var ad = function ad(a) {
    return fb(a.c, function (a) {
      return r(a[1]);
    });
  },
      Zc = function Zc(a) {
    if (a.f && a.h && ad(a)) {
      var b = a.f,
          c = bd[b];c && (m.clearTimeout(c.a), delete bd[b]);a.f = 0;
    }a.i && (a.i.s--, delete a.i);for (var b = a.b, d = c = !1; a.c.length && !a.g;) {
      var e = a.c.shift(),
          f = e[0],
          g = e[1],
          e = e[2];if (f = a.a ? g : f) try {
        var h = f.call(e || a.m, b);n(h) && (a.a = a.a && (h == b || h instanceof Error), a.b = b = h);if (Fa(b) || "function" === typeof m.Promise && b instanceof m.Promise) d = !0, a.g = !0;
      } catch (l) {
        b = l, a.a = !0, ad(a) || (c = !0);
      }
    }a.b = b;d && (h = _t(a.l, a, !0), d = _t(a.l, a, !1), b instanceof Yc ? ($c(b, h, d), b.j = !0) : b.then(h, d));c && (b = new cd(b), bd[b.a] = b, a.f = b.a);
  },
      cd = function cd(a) {
    this.a = m.setTimeout(_t(this.c, this), 0);this.b = a;
  };cd.prototype.c = function () {
    C(bd[this.a], "Cannot throw an error that is not scheduled.");delete bd[this.a];throw this.b;
  };var bd = {};var dd = function dd(a) {
    this.f = a;this.b = this.c = this.a = null;
  },
      ed = function ed(a, b) {
    this.name = a;this.value = b;
  };ed.prototype.toString = function () {
    return this.name;
  };var fd = new ed("SEVERE", 1E3),
      gd = new ed("CONFIG", 700),
      hd = new ed("FINE", 500),
      id = function id(a) {
    if (a.c) return a.c;if (a.a) return id(a.a);Ra("Root logger has no level set.");return null;
  };
  dd.prototype.log = function (a, b, c) {
    if (a.value >= id(this).value) for (r(b) && (b = b()), a = new ya(a, String(b), this.f), c && (a.a = c), c = "log:" + a.b, m.console && (m.console.timeStamp ? m.console.timeStamp(c) : m.console.markTimeline && m.console.markTimeline(c)), m.msWriteProfilerMark && m.msWriteProfilerMark(c), c = this; c;) {
      c = c.a;
    }
  };
  var jd = {},
      kd = null,
      ld = function ld(a) {
    kd || (kd = new dd(""), jd[""] = kd, kd.c = gd);var b;if (!(b = jd[a])) {
      b = new dd(a);var c = a.lastIndexOf("."),
          d = a.substr(c + 1),
          c = ld(a.substr(0, c));c.b || (c.b = {});c.b[d] = b;b.a = c;jd[a] = b;
    }return b;
  };var J = function J() {
    D.call(this);this.b = new vb(this);this.$ = this;this.G = null;
  };u(J, D);J.prototype[Ta] = !0;J.prototype.removeEventListener = function (a, b, c, d) {
    Qc(this, a, b, c, d);
  };
  var K = function K(a, b) {
    Jc(a);var c,
        d = a.G;if (d) {
      c = [];for (var e = 1; d; d = d.G) {
        c.push(d), C(1E3 > ++e, "infinite loop");
      }
    }a = a.$;d = b.type || b;q(b) ? b = new pb(b, a) : b instanceof pb ? b.target = b.target || a : (e = b, b = new pb(d, a), Da(b, e));var e = !0,
        f;if (c) for (var g = c.length - 1; 0 <= g; g--) {
      f = b.a = c[g], e = md(f, d, !0, b) && e;
    }f = b.a = a;e = md(f, d, !0, b) && e;e = md(f, d, !1, b) && e;if (c) for (g = 0; g < c.length; g++) {
      f = b.a = c[g], e = md(f, d, !1, b) && e;
    }
  };
  J.prototype.C = function () {
    J.J.C.call(this);if (this.b) {
      var a = this.b,
          b = 0,
          c;for (c in a.a) {
        for (var d = a.a[c], e = 0; e < d.length; e++) {
          ++b, rb(d[e]);
        }delete a.a[c];a.b--;
      }
    }this.G = null;
  };var md = function md(a, b, c, d) {
    b = a.b.a[String(b)];if (!b) return !0;b = b.concat();for (var e = !0, f = 0; f < b.length; ++f) {
      var g = b[f];if (g && !g.O && g.W == c) {
        var h = g.listener,
            l = g.N || g.src;g.V && yb(a.b, g);e = !1 !== h.call(l, d) && e;
      }
    }return e && 0 != d.la;
  },
      Jc = function Jc(a) {
    C(a.b, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
  };var L = function L(a, b) {
    this.f = new Nb();I.call(this, a, b);
  };u(L, I);k = L.prototype;k.Y = function (a, b) {
    if (!a) return L.J.Y.call(this);Db(this.f, n(b) ? b : 100, a);this.ca();
  };k.ca = function () {
    for (var a = this.f; 0 < a.o();) {
      var b = this.Y();if (b) {
        var c;var d = a,
            e = d.a,
            f = e.length;c = e[0];if (0 >= f) c = void 0;else {
          if (1 == f) ib(e);else {
            e[0] = e.pop();for (var e = 0, d = d.a, f = d.length, g = d[e]; e < f >> 1;) {
              var h = 2 * e + 1,
                  l = 2 * e + 2,
                  h = l < f && d[l].a < d[h].a ? l : h;if (d[h].a > g.a) break;d[e] = d[h];e = h;
            }d[e] = g;
          }c = c.b;
        }c.apply(this, [b]);
      } else break;
    }
  };
  k.ba = function (a) {
    L.J.ba.call(this, a);this.ca();
  };k.U = function () {
    L.J.U.call(this);this.ca();
  };k.C = function () {
    L.J.C.call(this);m.clearTimeout(void 0);this.f.clear();this.f = null;
  };var M = function M(a, b) {
    a && a.log(hd, b, void 0);
  };var nd = function nd(a, b, c) {
    if (r(a)) c && (a = _t(a, c));else if (a && "function" == typeof a.handleEvent) a = _t(a.handleEvent, a);else throw Error("Invalid listener argument");return 2147483647 < Number(b) ? -1 : m.setTimeout(a, b || 0);
  };var O = function O(a) {
    J.call(this);this.L = new jc();this.B = a || null;this.c = !1;this.A = this.a = null;this.P = this.l = "";this.K = 0;this.h = "";this.f = this.F = this.j = this.D = !1;this.i = 0;this.m = null;this.T = "";this.u = this.ea = this.Z = !1;
  };u(O, J);var od = O.prototype,
      pd = ld("goog.net.XhrIo");od.v = pd;var qd = /^https?$/i,
      rd = ["POST", "PUT"];
  O.prototype.send = function (a, b, c, d) {
    if (this.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.l + "; newUri=" + a);b = b ? b.toUpperCase() : "GET";this.l = a;this.h = "";this.K = 0;this.P = b;this.D = !1;this.c = !0;this.a = this.B ? Bb(this.B) : Bb(zb);this.A = this.B ? ab(this.B) : ab(zb);this.a.onreadystatechange = _t(this.S, this);this.ea && "onprogress" in this.a && (this.a.onprogress = _t(function (a) {
      this.R(a, !0);
    }, this), this.a.upload && (this.a.upload.onprogress = _t(this.R, this)));try {
      M(this.v, P(this, "Opening Xhr")), this.F = !0, this.a.open(b, String(a), !0), this.F = !1;
    } catch (f) {
      M(this.v, P(this, "Error opening Xhr: " + f.message));sd(this, f);return;
    }a = c || "";var e = this.L.clone();d && Hb(d, function (a, b) {
      e.set(b, a);
    });d = hb(e.H());c = m.FormData && a instanceof m.FormData;!(0 <= bb(rd, b)) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");e.forEach(function (a, b) {
      this.a.setRequestHeader(b, a);
    }, this);this.T && (this.a.responseType = this.T);"withCredentials" in this.a && this.a.withCredentials !== this.Z && (this.a.withCredentials = this.Z);try {
      td(this), 0 < this.i && (this.u = ud(this.a), M(this.v, P(this, "Will abort after " + this.i + "ms if incomplete, xhr2 " + this.u)), this.u ? (this.a.timeout = this.i, this.a.ontimeout = _t(this.M, this)) : this.m = nd(this.M, this.i, this)), M(this.v, P(this, "Sending request")), this.j = !0, this.a.send(a), this.j = !1;
    } catch (f) {
      M(this.v, P(this, "Send error: " + f.message)), sd(this, f);
    }
  };var ud = function ud(a) {
    return F && G(9) && "number" == typeof a.timeout && n(a.ontimeout);
  },
      gb = function gb(a) {
    return "content-type" == a.toLowerCase();
  };
  O.prototype.M = function () {
    "undefined" != typeof aa && this.a && (this.h = "Timed out after " + this.i + "ms, aborting", this.K = 8, M(this.v, P(this, this.h)), K(this, "timeout"), vd(this, 8));
  };var sd = function sd(a, b) {
    a.c = !1;a.a && (a.f = !0, a.a.abort(), a.f = !1);a.h = b;a.K = 5;wd(a);xd(a);
  },
      wd = function wd(a) {
    a.D || (a.D = !0, K(a, "complete"), K(a, "error"));
  },
      vd = function vd(a, b) {
    a.a && a.c && (M(a.v, P(a, "Aborting")), a.c = !1, a.f = !0, a.a.abort(), a.f = !1, a.K = b || 7, K(a, "complete"), K(a, "abort"), xd(a));
  };
  O.prototype.C = function () {
    this.a && (this.c && (this.c = !1, this.f = !0, this.a.abort(), this.f = !1), xd(this, !0));O.J.C.call(this);
  };O.prototype.S = function () {
    this.g || (this.F || this.j || this.f ? yd(this) : this.na());
  };O.prototype.na = function () {
    yd(this);
  };
  var yd = function yd(a) {
    if (a.c && "undefined" != typeof aa) if (a.A[1] && 4 == zd(a) && 2 == Q(a)) M(a.v, P(a, "Local request error detected and ignored"));else if (a.j && 4 == zd(a)) nd(a.S, 0, a);else if (K(a, "readystatechange"), 4 == zd(a)) {
      M(a.v, P(a, "Request complete"));a.c = !1;try {
        if (Bd(a)) K(a, "complete"), K(a, "success");else {
          a.K = 6;var b;try {
            b = 2 < zd(a) ? a.a.statusText : "";
          } catch (c) {
            M(a.v, "Can not get status: " + c.message), b = "";
          }a.h = b + " [" + Q(a) + "]";wd(a);
        }
      } finally {
        xd(a);
      }
    }
  };
  O.prototype.R = function (a, b) {
    C("progress" === a.type, "goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");K(this, Cd(a, "progress"));K(this, Cd(a, b ? "downloadprogress" : "uploadprogress"));
  };
  var Cd = function Cd(a, b) {
    return { type: b, lengthComputable: a.lengthComputable, loaded: a.loaded, total: a.total };
  },
      xd = function xd(a, b) {
    if (a.a) {
      td(a);var c = a.a,
          d = a.A[0] ? ba : null;a.a = null;a.A = null;b || K(a, "ready");try {
        c.onreadystatechange = d;
      } catch (e) {
        (a = a.v) && a.log(fd, "Problem encountered resetting onreadystatechange: " + e.message, void 0);
      }
    }
  },
      td = function td(a) {
    a.a && a.u && (a.a.ontimeout = null);"number" == typeof a.m && (m.clearTimeout(a.m), a.m = null);
  },
      Bd = function Bd(a) {
    var b = Q(a),
        c;a: switch (b) {case 200:case 201:case 202:case 204:case 206:case 304:case 1223:
        c = !0;break a;default:
        c = !1;}if (!c) {
      if (b = 0 === b) a = String(a.l).match(sb)[1] || null, !a && m.self && m.self.location && (a = m.self.location.protocol, a = a.substr(0, a.length - 1)), b = !qd.test(a ? a.toLowerCase() : "");c = b;
    }return c;
  },
      zd = function zd(a) {
    return a.a ? a.a.readyState : 0;
  },
      Q = function Q(a) {
    try {
      return 2 < zd(a) ? a.a.status : -1;
    } catch (b) {
      return -1;
    }
  },
      Dd = function Dd(a) {
    try {
      return a.a ? a.a.responseText : "";
    } catch (b) {
      return M(a.v, "Can not get responseText: " + b.message), "";
    }
  },
      Ed = function Ed(a, b) {
    return a.a && 4 == zd(a) ? a.a.getResponseHeader(b) : void 0;
  },
      P = function P(a, b) {
    return b + " [" + a.P + " " + a.l + " " + Q(a) + "]";
  };var Fd = function Fd(a, b, c, d) {
    this.m = a;this.u = !!d;L.call(this, b, c);
  };u(Fd, L);Fd.prototype.h = function () {
    var a = new O(),
        b = this.m;b && b.forEach(function (b, d) {
      a.L.set(d, b);
    });this.u && (a.Z = !0);return a;
  };Fd.prototype.j = function (a) {
    return !a.g && !a.a;
  };var Vc = new Fd();var Hd = function Hd(a, b, c, d, e, f, g, h, l, B) {
    this.L = a;this.F = b;this.A = c;this.m = d;this.G = e.slice();this.l = this.s = this.f = this.c = null;this.h = this.i = !1;this.u = f;this.j = g;this.g = l;this.M = B;this.D = h;var x = this;this.B = new H(function (a, b) {
      x.s = a;x.l = b;Gd(x);
    });
  },
      Id = function Id(a, b, c) {
    this.b = a;this.c = b;this.a = !!c;
  },
      Gd = function Gd(a) {
    function b(a, b) {
      b ? a(!1, new Id(!1, null, !0)) : Vc.Y(function (b) {
        b.Z = d.M;d.c = b;var c = null;null !== d.g && (b.ea = !0, c = Hc(b, "uploadprogress", function (a) {
          d.g(a.loaded, a.lengthComputable ? a.total : -1);
        }), b.ea = null !== d.g);b.send(d.L, d.F, d.m, d.A);Pc(b, "complete", function (b) {
          null !== c && Rc(c);d.c = null;b = b.target;var f = 6 === b.K && 100 <= Q(b),
              f = Bd(b) || f,
              g = Q(b);!f || 500 <= g && 600 > g || 429 === g ? (f = 7 === b.K, Wc(b), a(!1, new Id(!1, null, f))) : (f = 0 <= bb(d.G, g), a(!0, new Id(f, b)));
        });
      });
    }function c(a, b) {
      var c = d.s;a = d.l;var h = b.c;if (b.b) try {
        var l = d.u(h, Dd(h));n(l) ? c(l) : c();
      } catch (B) {
        a(B);
      } else null !== h ? (b = la(), l = Dd(h), b.serverResponse = l, d.j ? a(d.j(h, b)) : a(b)) : (b = b.a ? d.h ? oa() : ma() : new v("retry-limit-exceeded", "Max retry time for operation exceeded, please try again."), a(b));Wc(h);
    }var d = a;a.i ? c(0, new Id(!1, null, !0)) : a.f = ja(b, c, a.D);
  };Hd.prototype.a = function () {
    return this.B;
  };Hd.prototype.b = function (a) {
    this.i = !0;this.h = a || !1;null !== this.f && (0, this.f)(!1);null !== this.c && vd(this.c);
  };var Jd = function Jd(a, b, c) {
    var d = Oa(a.f),
        d = a.l + d,
        e = a.b ? qa(a.b) : {};null !== b && 0 < b.length && (e.Authorization = "Firebase " + b);e["X-Firebase-Storage-Version"] = "webjs/" + ("undefined" !== typeof firebase ? firebase.SDK_VERSION : "AppManager");return new Hd(d, a.i, e, a.c, a.h, a.N, a.a, a.j, a.g, c);
  };var Kd = function Kd(a) {
    var b = m.BlobBuilder || m.WebKitBlobBuilder;if (n(b)) {
      for (var b = new b(), c = 0; c < arguments.length; c++) {
        b.append(arguments[c]);
      }return b.getBlob();
    }b = kb(arguments);c = m.BlobBuilder || m.WebKitBlobBuilder;if (n(c)) {
      for (var c = new c(), d = 0; d < b.length; d++) {
        c.append(b[d], void 0);
      }b = c.getBlob(void 0);
    } else if (n(m.Blob)) b = new Blob(b, {});else throw Error("This browser doesn't seem to support creating Blobs");return b;
  },
      Ld = function Ld(a, b, c) {
    n(c) || (c = a.size);return a.webkitSlice ? a.webkitSlice(b, c) : a.mozSlice ? a.mozSlice(b, c) : a.slice ? Qb && !G("13.0") || Rb && !G("537.1") ? (0 > b && (b += a.size), 0 > b && (b = 0), 0 > c && (c += a.size), c < b && (c = b), a.slice(b, c - b)) : a.slice(b, c) : null;
  };var Md = function Md(a) {
    this.c = sc(a);
  };Md.prototype.a = function () {
    return this.c;
  };Md.prototype.b = function () {};var Nd = function Nd() {
    this.a = {};this.b = Number.MIN_SAFE_INTEGER;
  },
      Od = function Od(a, b) {
    function c() {
      delete e.a[d];
    }var d = a.b;a.b++;a.a[d] = b;var e = a;b.a().then(c, c);
  };Nd.prototype.clear = function () {
    pa(this.a, function (a, b) {
      b && b.b(!0);
    });this.a = {};
  };var Pd = function Pd(a, b, c, d) {
    this.a = a;this.g = null;if (null !== this.a && (a = this.a.options, y(a))) {
      a = a.storageBucket || null;if (null == a) a = null;else {
        var e = null;try {
          e = Ma(a);
        } catch (f) {}if (null !== e) {
          if ("" !== e.path) throw new v("invalid-default-bucket", "Invalid default bucket '" + a + "'.");a = e.bucket;
        }
      }this.g = a;
    }this.l = b;this.j = c;this.i = d;this.c = 12E4;this.b = 6E4;this.h = new Nd();this.f = !1;
  },
      Qd = function Qd(a) {
    return null !== a.a && y(a.a.INTERNAL) && y(a.a.INTERNAL.getToken) ? a.a.INTERNAL.getToken().then(function (a) {
      return y(a) ? a.accessToken : null;
    }, function () {
      return null;
    }) : rc(null);
  };Pd.prototype.bucket = function () {
    if (this.f) throw oa();return this.g;
  };var R = function R(a, b, c) {
    if (a.f) return new Md(oa());b = a.j(b, c, null === a.a);Od(a.h, b);return b;
  };var Rd = function Rd(a, b) {
    return b;
  },
      S = function S(a, b, c, d) {
    this.c = a;this.b = b || a;this.f = !!c;this.a = d || Rd;
  },
      Sd = null,
      Td = function Td() {
    if (Sd) return Sd;var a = [];a.push(new S("bucket"));a.push(new S("generation"));a.push(new S("metageneration"));a.push(new S("name", "fullPath", !0));var b = new S("name");b.a = function (a, b) {
      return !ua(b) || 2 > b.length ? b : ub(b);
    };a.push(b);b = new S("size");b.a = function (a, b) {
      return y(b) ? +b : b;
    };a.push(b);a.push(new S("timeCreated"));a.push(new S("updated"));a.push(new S("md5Hash", null, !0));a.push(new S("cacheControl", null, !0));a.push(new S("contentDisposition", null, !0));a.push(new S("contentEncoding", null, !0));a.push(new S("contentLanguage", null, !0));a.push(new S("contentType", null, !0));a.push(new S("metadata", "customMetadata", !0));a.push(new S("downloadTokens", "downloadURLs", !1, function (a, b) {
      if (!(ua(b) && 0 < b.length)) return [];var e = encodeURIComponent;return eb(b.split(","), function (b) {
        var d = a.fullPath,
            d = "https://firebasestorage.googleapis.com/v0" + ("/b/" + e(a.bucket) + "/o/" + e(d));b = Oa({ alt: "media", token: b });return d + b;
      });
    }));return Sd = a;
  },
      Ud = function Ud(a, b) {
    Object.defineProperty(a, "ref", { get: function get() {
        return b.l(b, new z(a.bucket, a.fullPath));
      } });
  },
      Vd = function Vd(a, b) {
    for (var c = {}, d = b.length, e = 0; e < d; e++) {
      var f = b[e];f.f && (c[f.c] = a[f.b]);
    }return JSON.stringify(c);
  },
      Wd = function Wd(a) {
    if (!a || "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a))) throw "Expected Metadata object.";for (var b in a) {
      var c = a[b];if ("customMetadata" === b && "object" !== (typeof c === "undefined" ? "undefined" : _typeof(c))) throw "Expected object for 'customMetadata' mapping.";
    }
  };var T = function T(a, b, c) {
    for (var d = b.length, e = b.length, f = 0; f < b.length; f++) {
      if (b[f].b) {
        d = f;break;
      }
    }if (!(d <= c.length && c.length <= e)) throw d === e ? (b = d, d = 1 === d ? "argument" : "arguments") : (b = "between " + d + " and " + e, d = "arguments"), new v("invalid-argument-count", "Invalid argument count in `" + a + "`: Expected " + b + " " + d + ", received " + c.length + ".");for (f = 0; f < c.length; f++) {
      try {
        b[f].a(c[f]);
      } catch (g) {
        if (g instanceof Error) throw na(f, a, g.message);throw na(f, a, g);
      }
    }
  },
      U = function U(a, b) {
    var c = this;this.a = function (b) {
      c.b && !n(b) || a(b);
    };
    this.b = !!b;
  },
      Xd = function Xd(a, b) {
    return function (c) {
      a(c);b(c);
    };
  },
      Yd = function Yd(a, b) {
    function c(a) {
      if (!("string" === typeof a || a instanceof String)) throw "Expected string.";
    }var d;a ? d = Xd(c, a) : d = c;return new U(d, b);
  },
      Zd = function Zd() {
    return new U(function (a) {
      if (!(a instanceof Blob)) throw "Expected Blob or File.";
    });
  },
      $d = function $d() {
    return new U(function (a) {
      if (!(("number" === typeof a || a instanceof Number) && 0 <= a)) throw "Expected a number 0 or greater.";
    });
  },
      ae = function ae(a, b) {
    return new U(function (b) {
      if (!(null === b || y(b) && b instanceof Object)) throw "Expected an Object.";y(a) && a(b);
    }, b);
  },
      be = function be() {
    return new U(function (a) {
      if (null !== a && !r(a)) throw "Expected a Function.";
    }, !0);
  };var ce = function ce(a) {
    if (!a) throw la();
  },
      de = function de(a, b) {
    return function (c, d) {
      a: {
        var e;try {
          e = JSON.parse(d);
        } catch (h) {
          c = null;break a;
        }c = da(e) ? e : null;
      }if (null === c) c = null;else {
        d = { type: "file" };e = b.length;for (var f = 0; f < e; f++) {
          var g = b[f];d[g.b] = g.a(d, c[g.c]);
        }Ud(d, a);c = d;
      }ce(null !== c);return c;
    };
  },
      ee = function ee(a) {
    return function (b, c) {
      b = 401 === Q(b) ? new v("unauthenticated", "User is not authenticated, please authenticate using Firebase Authentication and try again.") : 402 === Q(b) ? new v("quota-exceeded", "Quota for bucket '" + a.bucket + "' exceeded, please view quota on https://firebase.google.com/pricing/.") : 403 === Q(b) ? new v("unauthorized", "User does not have permission to access '" + a.path + "'.") : c;b.serverResponse = c.serverResponse;return b;
    };
  },
      fe = function fe(a) {
    var b = ee(a);return function (c, d) {
      var e = b(c, d);404 === Q(c) && (e = new v("object-not-found", "Object '" + a.path + "' does not exist."));e.serverResponse = d.serverResponse;return e;
    };
  },
      ge = function ge(a, b, c) {
    var d = La(b);a = new w(ka + "/v0" + d, "GET", de(a, c), a.c);a.a = fe(b);return a;
  },
      he = function he(a, b) {
    var c = La(b);a = new w(ka + "/v0" + c, "DELETE", function () {}, a.c);a.h = [200, 204];a.a = fe(b);return a;
  },
      ie = function ie(a, b, c) {
    c = c ? qa(c) : {};c.fullPath = a.path;c.size = b.size;c.contentType || (c.contentType = b && b.type || "application/octet-stream");return c;
  },
      je = function je(a, b, c, d, e) {
    var f = "/b/" + encodeURIComponent(b.bucket) + "/o",
        g = { "X-Goog-Upload-Protocol": "multipart" },
        h;h = "";for (var l = 0; 2 > l; l++) {
      h += Math.random().toString().slice(2);
    }g["Content-Type"] = "multipart/related; boundary=" + h;e = ie(b, d, e);l = Vd(e, c);d = Kd("--" + h + "\r\nContent-Type: application/json; charset=utf-8\r\n\r\n" + l + "\r\n--" + h + "\r\nContent-Type: " + e.contentType + "\r\n\r\n", d, "\r\n--" + h + "--");a = new w(ka + "/v0" + f, "POST", de(a, c), a.b);a.f = { name: e.fullPath };a.b = g;a.c = d;a.a = ee(b);return a;
  },
      ke = function ke(a, b, c, d) {
    this.a = a;this.total = b;this.b = !!c;this.c = d || null;
  },
      le = function le(a, b) {
    var c;try {
      c = Ed(a, "X-Goog-Upload-Status");
    } catch (d) {
      ce(!1);
    }a = 0 <= bb(b || ["active"], c);ce(a);return c;
  },
      me = function me(a, b, c, d, e) {
    var f = "/b/" + encodeURIComponent(b.bucket) + "/o",
        g = ie(b, d, e);e = { name: g.fullPath };f = ka + "/v0" + f;d = { "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start", "X-Goog-Upload-Header-Content-Length": d.size, "X-Goog-Upload-Header-Content-Type": g.contentType, "Content-Type": "application/json; charset=utf-8" };c = Vd(g, c);a = new w(f, "POST", function (a) {
      le(a);var b;try {
        b = Ed(a, "X-Goog-Upload-URL");
      } catch (c) {
        ce(!1);
      }ce(ua(b));return b;
    }, a.b);a.f = e;a.b = d;a.c = c;a.a = ee(b);return a;
  },
      ne = function ne(a, b, c, d) {
    a = new w(c, "POST", function (a) {
      var b = le(a, ["active", "final"]),
          c;try {
        c = Ed(a, "X-Goog-Upload-Size-Received");
      } catch (h) {
        ce(!1);
      }a = c;isFinite(a) && (a = String(a));
      a = q(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;ce(!isNaN(a));return new ke(a, d.size, "final" === b);
    }, a.b);a.b = { "X-Goog-Upload-Command": "query" };a.a = ee(b);return a;
  },
      oe = function oe(a, b, c, d, e, f) {
    var g = new ke(0, 0);f ? (g.a = f.a, g.total = f.total) : (g.a = 0, g.total = d.size);if (d.size !== g.total) throw new v("server-file-wrong-size", "Server recorded incorrect upload file size, please retry the upload.");var h = f = g.total - g.a,
        h = Math.min(h, 262144),
        l = g.a;f = { "X-Goog-Upload-Command": h === f ? "upload, finalize" : "upload",
      "X-Goog-Upload-Offset": g.a };l = Ld(d, l, l + h);if (null === l) throw new v("cannot-slice-blob", "Cannot slice blob for upload. Please retry the upload.");c = new w(c, "POST", function (a, c) {
      var f = le(a, ["active", "final"]),
          l = g.a + h,
          Ad = d.size,
          Va;"final" === f ? Va = de(b, e)(a, c) : Va = null;return new ke(l, Ad, "final" === f, Va);
    }, b.b);c.b = f;c.c = l;c.g = null;c.a = ee(a);return c;
  };var W = function W(a, b, c, d, e, f) {
    this.L = a;this.c = b;this.i = c;this.f = e;this.h = f || null;this.s = d;this.j = 0;this.G = this.m = !1;this.B = [];this.$ = 262144 < this.f.size;this.b = "running";this.a = this.u = this.g = null;var g = this;this.X = function (a) {
      g.a = null;"storage/canceled" === a.code ? (g.m = !0, pe(g)) : (g.g = a, V(g, "error"));
    };this.T = function (a) {
      g.a = null;"storage/canceled" === a.code ? pe(g) : (g.g = a, V(g, "error"));
    };this.A = this.l = null;this.F = new H(function (a, b) {
      g.l = a;g.A = b;qe(g);
    });this.F.then(null, function () {});
  },
      qe = function qe(a) {
    "running" === a.b && null === a.a && (a.$ ? null === a.u ? re(a) : a.m ? se(a) : a.G ? te(a) : ue(a) : ve(a));
  },
      we = function we(a, b) {
    Qd(a.c).then(function (c) {
      switch (a.b) {case "running":
          b(c);break;case "canceling":
          V(a, "canceled");break;case "pausing":
          V(a, "paused");}
    });
  },
      re = function re(a) {
    we(a, function (b) {
      var c = me(a.c, a.i, a.s, a.f, a.h);a.a = R(a.c, c, b);a.a.a().then(function (b) {
        a.a = null;a.u = b;a.m = !1;pe(a);
      }, this.X);
    });
  },
      se = function se(a) {
    var b = a.u;we(a, function (c) {
      var d = ne(a.c, a.i, b, a.f);a.a = R(a.c, d, c);a.a.a().then(function (b) {
        a.a = null;xe(a, b.a);a.m = !1;b.b && (a.G = !0);pe(a);
      }, a.X);
    });
  },
      ue = function ue(a) {
    var b = new ke(a.j, a.f.size),
        c = a.u;we(a, function (d) {
      var e;try {
        e = oe(a.i, a.c, c, a.f, a.s, b);
      } catch (f) {
        a.g = f;V(a, "error");return;
      }a.a = R(a.c, e, d);a.a.a().then(function (b) {
        a.a = null;xe(a, b.a);b.b ? (a.h = b.c, V(a, "success")) : pe(a);
      }, a.X);
    });
  },
      te = function te(a) {
    we(a, function (b) {
      var c = ge(a.c, a.i, a.s);a.a = R(a.c, c, b);a.a.a().then(function (b) {
        a.a = null;a.h = b;V(a, "success");
      }, a.T);
    });
  },
      ve = function ve(a) {
    we(a, function (b) {
      var c = je(a.c, a.i, a.s, a.f, a.h);a.a = R(a.c, c, b);a.a.a().then(function (b) {
        a.a = null;a.h = b;xe(a, a.f.size);V(a, "success");
      }, a.X);
    });
  },
      xe = function xe(a, b) {
    var c = a.j;a.j = b;a.j > c && ye(a);
  },
      V = function V(a, b) {
    if (a.b !== b) switch (b) {case "canceling":
        a.b = b;null !== a.a && a.a.b();break;case "pausing":
        a.b = b;null !== a.a && a.a.b();break;case "running":
        var c = "paused" === a.b;a.b = b;c && (ye(a), qe(a));break;case "paused":
        a.b = b;ye(a);break;case "canceled":
        a.g = ma();a.b = b;ye(a);break;case "error":
        a.b = b;ye(a);break;case "success":
        a.b = b, ye(a);}
  },
      pe = function pe(a) {
    switch (a.b) {case "pausing":
        V(a, "paused");break;case "canceling":
        V(a, "canceled");break;case "running":
        qe(a);}
  };W.prototype.D = function () {
    return new A(this.j, this.f.size, ta(this.b), this.h, this, this.L);
  };
  W.prototype.P = function (a, b, c, d) {
    function e(a) {
      try {
        g(a);return;
      } catch (b) {}try {
        if (h(a), !(n(a.next) || n(a.error) || n(a.complete))) throw "";
      } catch (b) {
        throw "Expected a function or an Object with one of `next`, `error`, `complete` properties.";
      }
    }function f(a) {
      return function (b, c, d) {
        null !== a && T("on", a, arguments);var e = new Na(b, c, d);ze(l, e);return function () {
          jb(l.B, e);
        };
      };
    }var g = be().a,
        h = ae(null, !0).a;T("on", [Yd(function () {
      if ("state_changed" !== a) throw "Expected one of the event types: [state_changed].";
    }), ae(e, !0), be(), be()], arguments);var l = this,
        B = [ae(function (a) {
      if (null === a) throw "Expected a function or an Object with one of `next`, `error`, `complete` properties.";e(a);
    }), be(), be()];return n(b) || n(c) || n(d) ? f(null)(b, c, d) : f(B);
  };W.prototype.then = function (a, b) {
    return this.F.then(a, b);
  };
  var ze = function ze(a, b) {
    a.B.push(b);Ae(a, b);
  },
      ye = function ye(a) {
    Be(a);var b = kb(a.B);cb(b, function (b) {
      Ae(a, b);
    });
  },
      Be = function Be(a) {
    if (null !== a.l) {
      var b = !0;switch (ta(a.b)) {case "success":
          Dc(a.l.bind(null, a.D()))();break;case "canceled":case "error":
          Dc(a.A.bind(null, a.g))();break;default:
          b = !1;}b && (a.l = null, a.A = null);
    }
  },
      Ae = function Ae(a, b) {
    switch (ta(a.b)) {case "running":case "paused":
        null !== b.next && Dc(b.next.bind(b, a.D()))();break;case "success":
        null !== b.a && Dc(b.a.bind(b))();break;case "canceled":case "error":
        null !== b.error && Dc(b.error.bind(b, a.g))();break;default:
        null !== b.error && Dc(b.error.bind(b, a.g))();}
  };W.prototype.S = function () {
    T("resume", [], arguments);var a = "paused" === this.b || "pausing" === this.b;a && V(this, "running");return a;
  };W.prototype.R = function () {
    T("pause", [], arguments);var a = "running" === this.b;a && V(this, "pausing");return a;
  };W.prototype.M = function () {
    T("cancel", [], arguments);var a = "running" === this.b || "pausing" === this.b;a && V(this, "canceling");return a;
  };var X = function X(a, b) {
    this.b = a;if (b) this.a = b instanceof z ? b : Ma(b);else if (a = a.bucket(), null !== a) this.a = new z(a, "");else throw new v("no-default-bucket", "No default bucket found. Did you set the 'storageBucket' property when initializing the app?");
  };X.prototype.toString = function () {
    T("toString", [], arguments);return "gs://" + this.a.bucket + "/" + this.a.path;
  };var Ce = function Ce(a, b) {
    return new X(a, b);
  };k = X.prototype;
  k.ha = function (a) {
    T("child", [Yd()], arguments);var b = tb(this.a.path, a);return Ce(this.b, new z(this.a.bucket, b));
  };k.Fa = function () {
    var a;a = this.a.path;if (0 == a.length) a = null;else {
      var b = a.lastIndexOf("/");a = -1 === b ? "" : a.slice(0, b);
    }return null === a ? null : Ce(this.b, new z(this.a.bucket, a));
  };k.Ha = function () {
    return Ce(this.b, new z(this.a.bucket, ""));
  };k.pa = function () {
    return this.a.bucket;
  };k.Aa = function () {
    return this.a.path;
  };k.Ea = function () {
    return ub(this.a.path);
  };k.Ja = function () {
    return this.b.i;
  };
  k.ua = function (a, b) {
    T("put", [Zd(), new U(Wd, !0)], arguments);De(this, "put");return new W(this, this.b, this.a, Td(), a, b);
  };k.delete = function () {
    T("delete", [], arguments);De(this, "delete");var a = this;return Qd(this.b).then(function (b) {
      var c = he(a.b, a.a);return R(a.b, c, b).a();
    });
  };k.ia = function () {
    T("getMetadata", [], arguments);De(this, "getMetadata");var a = this;return Qd(this.b).then(function (b) {
      var c = ge(a.b, a.a, Td());return R(a.b, c, b).a();
    });
  };
  k.va = function (a) {
    T("updateMetadata", [new U(Wd, void 0)], arguments);De(this, "updateMetadata");var b = this;return Qd(this.b).then(function (c) {
      var d = b.b,
          e = b.a,
          f = a,
          g = Td(),
          h = La(e),
          h = ka + "/v0" + h,
          f = Vd(f, g),
          d = new w(h, "PATCH", de(d, g), d.c);d.b = { "Content-Type": "application/json; charset=utf-8" };d.c = f;d.a = fe(e);return R(b.b, d, c).a();
    });
  };
  k.ta = function () {
    T("getDownloadURL", [], arguments);De(this, "getDownloadURL");return this.ia().then(function (a) {
      a = a.downloadURLs[0];if (y(a)) return a;throw new v("no-download-url", "The given file does not have any download URLs.");
    });
  };var De = function De(a, b) {
    if ("" === a.a.path) throw new v("invalid-root-operation", "The operation '" + b + "' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");
  };var Y = function Y(a) {
    this.a = new Pd(a, function (a, c) {
      return new X(a, c);
    }, Jd, this);this.b = a;this.c = new Ee(this);
  };k = Y.prototype;k.wa = function (a) {
    T("ref", [Yd(function (a) {
      if (/^[A-Za-z]+:\/\//.test(a)) throw "Expected child path but got a URL, use refFromURL instead.";
    }, !0)], arguments);var b = new X(this.a);return n(a) ? b.ha(a) : b;
  };
  k.xa = function (a) {
    T("refFromURL", [Yd(function (a) {
      if (!/^[A-Za-z]+:\/\//.test(a)) throw "Expected full URL but got a child path, use ref instead.";try {
        Ma(a);
      } catch (c) {
        throw "Expected valid full URL but got an invalid one.";
      }
    }, !1)], arguments);return new X(this.a, a);
  };k.Ca = function () {
    return this.a.b;
  };k.za = function (a) {
    T("setMaxUploadRetryTime", [$d()], arguments);this.a.b = a;
  };k.Ba = function () {
    return this.a.c;
  };k.ya = function (a) {
    T("setMaxOperationRetryTime", [$d()], arguments);this.a.c = a;
  };k.oa = function () {
    return this.b;
  };
  k.ma = function () {
    return this.c;
  };var Ee = function Ee(a) {
    this.a = a;
  };Ee.prototype.delete = function () {
    var a = this.a.a;a.f = !0;a.a = null;a.h.clear();
  };var Z = function Z(a, b, c) {
    Object.defineProperty(a, b, { get: c });
  };X.prototype.toString = X.prototype.toString;X.prototype.child = X.prototype.ha;X.prototype.put = X.prototype.ua;X.prototype["delete"] = X.prototype.delete;X.prototype.getMetadata = X.prototype.ia;X.prototype.updateMetadata = X.prototype.va;X.prototype.getDownloadURL = X.prototype.ta;Z(X.prototype, "parent", X.prototype.Fa);Z(X.prototype, "root", X.prototype.Ha);Z(X.prototype, "bucket", X.prototype.pa);Z(X.prototype, "fullPath", X.prototype.Aa);
  Z(X.prototype, "name", X.prototype.Ea);Z(X.prototype, "storage", X.prototype.Ja);Y.prototype.ref = Y.prototype.wa;Y.prototype.refFromURL = Y.prototype.xa;Z(Y.prototype, "maxOperationRetryTime", Y.prototype.Ba);Y.prototype.setMaxOperationRetryTime = Y.prototype.ya;Z(Y.prototype, "maxUploadRetryTime", Y.prototype.Ca);Y.prototype.setMaxUploadRetryTime = Y.prototype.za;Z(Y.prototype, "app", Y.prototype.oa);Z(Y.prototype, "INTERNAL", Y.prototype.ma);Ee.prototype["delete"] = Ee.prototype.delete;
  Y.prototype.capi_ = function (a) {
    ka = a;
  };W.prototype.on = W.prototype.P;W.prototype.resume = W.prototype.S;W.prototype.pause = W.prototype.R;W.prototype.cancel = W.prototype.M;Z(W.prototype, "snapshot", W.prototype.D);Z(A.prototype, "bytesTransferred", A.prototype.qa);Z(A.prototype, "totalBytes", A.prototype.La);Z(A.prototype, "state", A.prototype.Ia);Z(A.prototype, "metadata", A.prototype.Da);Z(A.prototype, "downloadURL", A.prototype.sa);Z(A.prototype, "task", A.prototype.Ka);Z(A.prototype, "ref", A.prototype.Ga);
  ra.STATE_CHANGED = "state_changed";sa.RUNNING = "running";sa.PAUSED = "paused";sa.SUCCESS = "success";sa.CANCELED = "canceled";sa.ERROR = "error";H.prototype["catch"] = H.prototype.l;H.prototype.then = H.prototype.then;
  (function () {
    function a(a) {
      return new Y(a);
    }var b = { TaskState: sa, TaskEvent: ra, Storage: Y, Reference: X };if (window.firebase && firebase.INTERNAL && firebase.INTERNAL.registerService) firebase.INTERNAL.registerService("storage", a, b);else throw Error("Cannot install Firebase Storage - be sure to load firebase-app.js first.");
  })();
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _LudicConnect = __webpack_require__(0);

var _LudicConnect2 = _interopRequireDefault(_LudicConnect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.ludicConnnect = _LudicConnect2.default;

var createLobbyButton = document.getElementById('createLobby');
var findLobbiesButton = document.getElementById('findLobbies');

createLobbyButton.addEventListener('click', function () {
  _LudicConnect2.default.createLobby("testLobby");
}, false);

findLobbiesButton.addEventListener('click', function () {
  _LudicConnect2.default.findLobbies("testLobby").then(function (lobbies) {
    console.log("all lobbies: ", lobbies);
    var currentLobby = lobbies[0];
    console.log("joining: ", currentLobby);
    _LudicConnect2.default.joinLobby(currentLobby.id);
  });
}, false);

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map