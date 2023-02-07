import React from "react";
import { Link } from "react-router-dom";
import styles from "../stylesheets/styles.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <h2>Leisure Time</h2>
                    <p>Collections</p>
                </Link>
            </div>
        </header>
    );
}
