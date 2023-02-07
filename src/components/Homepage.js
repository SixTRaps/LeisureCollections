import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { VideoContext } from "./Videos";

import styles from "../stylesheets/styles.module.css";

export default function Homepage() {
  const featured = useContext(VideoContext);

  if (!featured.length) {
    return <h3>No Featured Videos</h3>;
  }
  return (
    <div className={styles.homepageContainer}>
      <div className={styles.featuredList}>
        {featured.map(({ id, image, title }) => (
          <article key={id}>
            <Link
              to={`videos/${id}`}
              className={styles.featuredLink}
              style={{
                textDecoration: "none",
                marginTop: "5px",
              }}
            >
              <img src={image} alt={title} />
              <p>{title}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
