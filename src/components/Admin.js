import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { Authenticator } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { createVideo, deleteVideo } from "../graphql/mutations";
import config from "../aws-exports";

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config;

export default function Admin() {
  const [image, setImage] = useState(null);
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    image: "",
    videoURL: "",
  });
  const uuid = uuidv4();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!videoDetails.title) return;
      console.log(videoDetails);
      // await API.graphql(
      //   graphqlOperation(deleteVideo, {
      //     input: { id: "328f6678-1a13-43ca-aa42-0a1c00fe884a" },
      //   })
      // );
      await API.graphql(graphqlOperation(createVideo, { input: videoDetails }));
      setVideoDetails({ title: "", image: "", videoURL: "" });
    } catch (e) {
      console.log(e);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `images/${uuid}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;

    try {
      await Storage.put(key, file, {
        level: "public",
        contentType: file.type,
      });
      const image = await Storage.get(key, { level: "public" });
      setImage(image);
      setVideoDetails({ ...videoDetails, image: url });
    } catch (e) {
      console.log(e);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const extension = file.name.split(".")[1];
    const name = file.name.split(".")[0];
    const key = `videos/${uuid}${name}.${extension}`;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;

    try {
      await Storage.put(key, file, {
        level: "public",
        contentType: file.type,
      });
      setVideoDetails({ ...videoDetails, title: name, videoURL: url });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
      <form onSubmit={handleSubmit}>
        <div className="form-image">
          {image ? (
            <img className="image-preview" src={image} alt="" />
          ) : (
            <input
              type="file"
              accept="image/png"
              onChange={(e) => handleImageUpload(e)}
            />
          )}
        </div>
        <div className="form-video">
          {videoDetails.title ? (
            <h2>Upload: {videoDetails.title}</h2>
          ) : (
            <input type="file" onChange={(e) => handleVideoUpload(e)} />
          )}
        </div>
        <div className="submit-form">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
