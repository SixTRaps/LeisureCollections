import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// React Components
import Homepage from "./Homepage";
import Header from "./Header";
import Admin from "./Admin";
import VideoDetails from "./VideoDetails";
import { VideoContext } from "./Videos";

// AWS Amplify and Configurations
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { API } from "aws-amplify";
import { listVideos } from "../graphql/queries";
Amplify.configure(awsExports);

function App() {
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

  return (
    <VideoContext.Provider value={videos}>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Homepage />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route
            path="/videos/:id"
            element={<VideoDetails></VideoDetails>}
          ></Route>
        </Routes>
      </Router>
    </VideoContext.Provider>
  );
}

export default App;
