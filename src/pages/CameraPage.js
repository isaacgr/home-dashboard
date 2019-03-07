import React, { Component } from "react";
import { GooeyMenu } from "../components/NavBar";
import Hls from "hls.js";

class CameraPage extends Component {
  componentDidMount() {
    const video = this.player;
    const config = {
      manifestLoadingTimeOut: 60000
    };
    if (Hls.isSupported()) {
      const hls = new Hls(config);
      hls.loadSource("http://142.116.5.24/streaming.m3u8");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        const errorType = data.type;
        const errorDetails = data.details;
        const errorFatal = data.fatal;
        console.log(`ERROR: ${errorType}, ${errorDetails}, ${errorFatal}`);
      });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "http://142.116.5.24/streaming.m3u8";
      video.addEventListener("loadedmetadata", function() {
        video.play();
      });
    }
  }
  render() {
    return (
      <>
        <GooeyMenu />
        <section className="video-section">
          <div className="container">
            <video
              width="100%"
              ref={player => (this.player = player)}
              controls
            />
          </div>
        </section>
      </>
    );
  }
}

export default CameraPage;
