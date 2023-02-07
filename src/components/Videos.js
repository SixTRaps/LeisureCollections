import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listVideos } from "../graphql/queries";

const VideoContext = React.createContext("default");

const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await API.graphql({
        query: listVideos,
        authMode: "API_KEY",
      });
      const v = data.listVideos.items;
      setVideos(v);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(videos);

  return (
    <VideoContext.Provider value={{ videos }}>{children}</VideoContext.Provider>
  );
};

export { VideoContext, VideoProvider };
