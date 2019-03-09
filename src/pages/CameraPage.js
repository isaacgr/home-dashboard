import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Hls from "hls.js";

class CameraPage extends Component {
  componentDidMount() {
    const video = this.player;
    const config = {
      manifestLoadingTimeOut: 5000,
      fragLoadingTimeOut: 20000
    };
    if (Hls.isSupported()) {
      const hls = new Hls(config);
      console.log("Attempting to load video source");
      hls.attachMedia(video);
      hls.loadSource("http://142.116.5.24:6969/streaming.m3u8");
      hls.on(Hls.Events.ERROR, (event, data) => {
        const errorType = data.type;
        const errorDetails = data.details;
        const errorFatal = data.fatal;
        console.log(`ERROR: ${errorType}, ${errorDetails}, ${errorFatal}`);
        switch (data.details) {
          case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
            hls.attachMedia(video);
            console.log("Attempting to load video source");
            hls.loadSource("http://192.168.2.48/streaming.m3u8");
            break;
          default:
            break;
        }
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Video loaded");
        video.play();
      });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "http://142.116.5.24:6969/streaming.m3u8";
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
  }
  render() {
    return (
      <section className="video-section">
        <GooeyMenu />
        <div className="container">
          <video
            className="video-source"
            width="100%"
            ref={player => (this.player = player)}
            controls
          />
        </div>
      </section>
    );
  }
}

export default CameraPage;
