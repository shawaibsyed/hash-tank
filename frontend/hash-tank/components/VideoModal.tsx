import { API } from "@/constants/api.constants";
import { RootState } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const VideoPlayer = (props: any) => {

  // console.log(props+"props");
  
  const { profile } = useSelector((state: RootState) => state.profile);
  const posts = profile.posts;
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoId = props.content;
  console.log(videoId + " video");

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.src = API.BASE_URL+ `/video/${videoId}`;

      videoElement.muted = false;

      // videoElement.play();
    }
    console.log(videoId + " video");
  }, [videoId]);
  // if(props.page ==1)
    return <video ref={videoRef} height={600} width={800} controls />;
  // else  
  // return <video ref={videoRef} height={300} width={600} controls />;
};


export default VideoPlayer;