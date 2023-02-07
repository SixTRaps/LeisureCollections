import React, { useState, useRef, useEffect } from "react";
import styles from "../stylesheets/styles.module.css";
import { useKeyDown } from "react-keyboard-input-hook";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  BsPlayFill,
  BsPauseFill,
  BsPlayBtn,
  BsFullscreen,
  BsFullscreenExit,
} from "react-icons/bs";
import { FiVolume2, FiVolume1, FiVolumeX } from "react-icons/fi";

export default function Player({ url }) {
  const [notPlaying, setNotPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0.6);
  const [fullscreen, setFullscreen] = useState(false);

  const videoPlayerContainerRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const showPausedRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  const volumeSliderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      togglePlayPause();
      togglePlayPause();
    }, 500);
    progressBarRef.current.value = 0;
    videoPlayerRef.current.volume = 0.6;
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const time = Math.floor(videoPlayerRef.current.duration);
    setDuration(time);
  }, [
    videoPlayerRef?.current?.readyState,
    videoPlayerRef?.current?.loadedmetadata,
  ]);

  useEffect(() => {
    const onChange = () => {
      setFullscreen(document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onChange);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  const togglePlayPause = () => {
    const prevState = notPlaying;
    setNotPlaying(!prevState);
    if (prevState) {
      videoPlayerRef.current.play();
      showPausedRef.current.style["display"] = "none";
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      videoPlayerRef.current.pause();
      showPausedRef.current.style["display"] = "flex";
      cancelAnimationFrame(animationRef.current);
    }
  };

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const formatDuration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`;
    }
  };

  const changeRange = () => {
    videoPlayerRef.current.currentTime = progressBarRef.current.value;
    changePlayerCurrentTime();
  };

  const whilePlaying = () => {
    progressBarRef.current.value = videoPlayerRef.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changePlayerCurrentTime = () => {
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${(progressBarRef.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBarRef.current.value);
  };

  const forward = (e) => {
    progressBarRef.current.value = progressBarRef.current.value + 5;
    changeRange();
  };

  const back = (e) => {
    const val = Number(progressBarRef.current.value) - 5;
    if (val < 0) progressBarRef.current.value = 0;
    else progressBarRef.current.value = progressBarRef.current.value - 5;
    changeRange();
  };

  const handleClickTimeUpdate = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    progressBarRef.current.value = duration * percent;
    changeRange();
  };

  const handleVolumeIcon = () => {
    if (muted) {
      return <FiVolumeX />;
    } else {
      if (currentVolume >= 0.5) {
        return <FiVolume2 />;
      } else return <FiVolume1 />;
    }
  };

  const toggleMute = (e) => {
    videoPlayerRef.current.muted = !videoPlayerRef.current.muted;
    setMuted(!muted);
  };

  const handleVolume = (e) => {
    const volume = volumeSliderRef.current.value;
    // console.log(volume);
    if (volume === "0") {
      videoPlayerRef.current.muted = !videoPlayerRef.current.muted;
      setMuted(!muted);
      console.log(muted);
    } else {
      if (muted) {
        videoPlayerRef.current.muted = !videoPlayerRef.current.muted;
        setMuted(!muted);
      }
      setCurrentVolume(volume);
      videoPlayerRef.current.volume = volume;
    }
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement != null) {
      setFullscreen(false);
      document.exitFullscreen();
    } else {
      setFullscreen(true);
      videoPlayerContainerRef.current.requestFullscreen();
    }
  };

  const handleKeyDown = (e) => {
    const tagName = document.activeElement.tagName.toLowerCase();
    if (tagName === "button") return;
    const key = e.key.toLowerCase();
    if (key === " ") {
      togglePlayPause();
    } else if (key === "arrowleft") {
      back();
    } else if (key === "arrowright") {
      forward();
    } else if (key === "m") {
      toggleMute();
    }
  };

  return (
    <div className={styles.videoPlayerContainer} ref={videoPlayerContainerRef}>
      <div className={styles.showPaused} ref={showPausedRef}>
        <BsPlayBtn className={styles.showPausedIcon} />
      </div>
      <video src={url} ref={videoPlayerRef} onClick={togglePlayPause}></video>
      {/* progress bar */}
      <div className={styles.videoPlayerControls}>
        <div className={styles.timelineContainer}>
          <div
            className={styles.progressBar}
            ref={progressBarRef}
            onClick={handleClickTimeUpdate}
          ></div>
          <div className={styles.thumbIndicator}></div>
        </div>
        <div className={styles.controls}>
          <button className={styles.forwardBackwardBtn} onClick={back}>
            <IoChevronBack /> 5
          </button>
          <button className={styles.playPauseBtn} onClick={togglePlayPause}>
            {!notPlaying ? (
              <BsPauseFill />
            ) : (
              <BsPlayFill className={styles.playBtn} />
            )}
          </button>
          <button className={styles.forwardBackwardBtn} onClick={forward}>
            <IoChevronForward /> 5
          </button>

          {/* volume control */}
          <div className={styles.volumeControl}>
            <button className={styles.volumeBtn} onClick={toggleMute}>
              {handleVolumeIcon()}
            </button>
            <input
              className={styles.volumeSlider}
              type="range"
              min="0"
              max="1"
              defaultValue="0.6"
              step="any"
              ref={volumeSliderRef}
              onChange={handleVolume}
            />
          </div>

          {/* current time */}
          <div className={styles.durationContainer}>
            <span className={styles.currentTime}>
              {formatDuration(currentTime)}
            </span>
            /{/* duration */}
            <span className={styles.duration}>
              {duration && !isNaN(duration) ? formatDuration(duration) : "NaN"}
            </span>
          </div>

          <button className={styles.fullscreenBtn} onClick={handleFullscreen}>
            {fullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
          </button>
        </div>
      </div>
    </div>
  );
}
