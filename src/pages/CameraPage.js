import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
// import Hls from "hls.js";
import Janus from "../video/janus";
import _ from "lodash";

class CameraPage extends Component {
  state = {
    addr: "192.168.69.69"
  };
  plugin = null;

  componentDidMount() {
    fetch("/api/data?data=ip", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        const ip = json["data"]["values"]["ip"];
        this.setState(() => ({ addr: ip }));
        return true;
      })
      .then(success => {
        Janus.init({
          debug: true,
          callback: () => {
            this.onJanusInit("192.168.2.48", 69);
          }
        });
      });
  }

  onJanusInit(host, outputId) {
    let janus_server = `http://${host}/stream/janus`;
    this.janus = new Janus({
      server: janus_server,
      success: () => {
        this.janus.attach({
          plugin: "janus.plugin.streaming",
          opaqueId: `${Janus.randomString(12)}`,
          success: handle => {
            this.plugin = handle;
            this.plugin.send({
              message: { request: "list" },
              success: result => {
                console.log(result["list"]);
                let mp = _.find(result["list"], mountpoint => {
                  return mountpoint["id"] === outputId;
                });
                console.log(mp);
                this.plugin.send({
                  message: { request: "watch", id: mp["id"] },
                  success: result => {
                    console.log("watch: " + result);
                  },
                  error: err => console.log(err)
                });
              }
            });
          },
          error: err => {
            console.log(err);
          },
          onmessage: (message, jesp) => {
            let { error, result } = message;
            if (error) {
              console.log(error);
              return;
            } else if (result) {
              console.log(result);
            }
            if (jesp) {
              console.log(jesp);
              this.plugin.createAnswer({
                media: { audioSend: false, videoSend: false, data: false },
                jesp: jesp,
                success: jesp => {
                  this.plugin.send({
                    message: { request: "start" },
                    jesp: jesp,
                    success: result => {
                      console.log("start: " + result);
                    }
                  });
                },
                error: error => console.log("error:" + error)
              });
            }
          },
          onremotestream: stream => {
            console.log("REMOTE STREAM");
            let video = stream.getVideoTracks();
            if (video) {
              Janus.attachMediaStream(this.player, stream);
            } else {
              console.log("no video");
            }
          },
          onData: data => console.log(data),
          onCleanup: () => console.log("Cleaning up")
        });
      },
      error: error => console.log(error)
    });
  }

  setPreset = e => {
    const value = e.target.value;
    fetch(`http://${this.state.addr}:8080/api/preset?preset=${value}`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      mode: "no-cors"
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderVideo = () => {
    // const video = this.player;
    // const config = {
    //   manifestLoadingTimeOut: 5000,
    //   fragLoadingTimeOut: 20000
    // };
    // if (Hls.isSupported()) {
    //   const hls = new Hls(config);
    //   console.log("Attempting to load video source");
    //   hls.attachMedia(video);
    //   hls.loadSource(`http://${this.state.addr}:6969/streaming.m3u8`);
    //   hls.on(Hls.Events.ERROR, (event, data) => {
    //     const errorType = data.type;
    //     const errorDetails = data.details;
    //     const errorFatal = data.fatal;
    //     console.log(`ERROR: ${errorType}, ${errorDetails}, ${errorFatal}`);
    //     switch (data.details) {
    //       case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
    //         hls.attachMedia(video);
    //         console.log("Attempting to load video source");
    //         hls.loadSource(`http://${process.env.CAMERA_IP}/streaming.m3u8`);
    //         this.setState(() => ({ addr: `${process.env.CAMERA_IP}` }));
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //     console.log("Video loaded");
    //     video.play();
    //   });
    // }
    // // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
    // // This is using the built-in support of the plain video element, without using hls.js.
    // // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    // else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    //   video.src = `http://${this.state.addr}:6969/streaming.m3u8`;
    //   video.addEventListener("loadedmetadata", () => {
    //     video.play();
    //   });
    // }
  };
  render() {
    return (
      <section className="video-section">
        <GooeyMenu />
        <div className="container">
          <video
            className="video-source"
            width="100%"
            id="remotevideo"
            ref={player => (this.player = player)}
            autoPlay
            playsInline
          />
        </div>
        <div className="container">
          <h1 className="heading">Presets</h1>
          <div className="row">
            <button
              onClick={this.setPreset}
              value="1"
              className="btn btn-lg btn-primary col-sm m-2"
            >
              Full View
            </button>
            <button
              onClick={this.setPreset}
              value="2"
              className="btn btn-lg btn-primary col-sm m-2"
            >
              Plants
            </button>
            <button
              onClick={this.setPreset}
              value="3"
              className="btn btn-lg btn-primary col-sm m-2"
            >
              Car Port
            </button>
            <button
              onClick={this.setPreset}
              value="4"
              className="btn btn-lg btn-primary col-sm m-2"
            >
              Door
            </button>
            <button
              onClick={this.setPreset}
              value="5"
              className="btn btn-lg btn-primary col-sm m-2"
            >
              Table
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default CameraPage;
