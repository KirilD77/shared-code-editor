import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './../styles/topbar.module.css';

const Topbar = () => {
  const generateRandomString = () => Math.random().toString(36).slice(2);
  const [url, setUrl] = useState(generateRandomString());
  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <div className={styles.logo}>CodeShare</div>
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Link to="/" className={styles.menuLink}>
                Home
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link to="/about" className={styles.menuLink}>
                About This Site
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link to="/contact" className={styles.menuLink}>
                Contact Us
              </Link>
            </li>
            <li className={styles.menuItem}>
              <Link to={`/editor/:${url}`} onClick={() => setTimeout(() => setUrl(generateRandomString()), 0)} className={styles.menuLink}>
                Go to Editor
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
