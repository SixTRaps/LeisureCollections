import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { VideoContext } from "./Videos";
import styles from "../stylesheets/styles.module.css";
import Player from "./Player";

export default function VideoDetails() {
  const { id } = useParams();
  const videos = useContext(VideoContext);

  const video = videos.find((video) => {
    return video.id === id;
  });

  if (!video) {
    return <h3>Loading...</h3>;
  }

  const { title, image, videoURL } = video;

  return (
    <section className="video-details">
      <h3 className={styles.videoTitle}>{title}</h3>
      <Player url={videoURL}></Player>
    </section>
  );
}
