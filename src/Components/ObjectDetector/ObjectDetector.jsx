// Import dependencies
import React, { useRef, useState, useEffect} from "react";
//import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";

import { drawReact } from "../../utilities.js"

function ObjectDetector() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isShowVideo, setIsShowVideo] = useState(false);



const startCam = () => {
    setImgSrc(null)
    setIsShowVideo(true);
}

const stopCam = () => {
    let stream = webcamRef.current.stream;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsShowVideo(false);
}

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 1000);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawReact(obj, ctx); 
    }
  };

  const capture= async () =>{
    const imageSrc = webcamRef.current.getScreenshot();
    stopCam()
    setImgSrc(imageSrc);
    console.log(imageSrc)
    //const net = await cocossd.load();
   // const img = document.getElementById('img');
    // Set canvas height and width
    //canvasRef.current.width = videoWidth;
    //canvasRef.current.height = videoHeight;
   
    //console.log("here")
    //const predictions = await net.detect(tensor);
    //console.log(predictions)
    //const ctx = canvasRef.current.getContext("2d");
    //drawReact(predictions, ctx); 

  }
 
  


  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  useEffect(()=>{runCoco()},[runCoco]);

  return (
    <div className="App">
        {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
      <div className="camView">
      {isShowVideo && <>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
           
            zindex: 8,
            width: 1280,
            height: 720,
          }}
        />
      <Webcam
        ref={webcamRef}
        muted={true} 
        audio={false}
        height={720}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        />
        
        </>
      }
      </div>)}

     
      <button onClick={startCam} disabled={isShowVideo}>Start Webcam</button>
      <button onClick={stopCam} disabled={!isShowVideo}>Stop Webcam</button>
      <button onClick={capture} disabled={!isShowVideo}>Take Screenshot</button>
    </div>
  );
}

export default ObjectDetector;
