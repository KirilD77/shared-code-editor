import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './../styles/topbar.module.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
const Topbar = () => {
  const { loginWithRedirect, logout } = useAuth0();
  const generateRandomString = () => Math.random().toString(36).slice(2);
  const [url, setUrl] = useState(generateRandomString());
  const { isLogged } = useSelector((state) => {
    return {
      isLogged: state.userAuth.isLogged
    };
  });

  const logOut = () => (
    <button
      className={styles.menuLink}
      onClick={() => {
        isLogged
          ? logout({ returnTo: window.location.origin })
          : loginWithRedirect();
      }}
    >{isLogged ? "Logout" : "Login"}</button>
  );

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
              <Link
                to={`/editor/:${url}`}
                onClick={() =>
                  setTimeout(() => setUrl(generateRandomString()), 0)
                }
                className={styles.menuLink}
              >
                Go to Editor
              </Link>
            </li>

            <li className={styles.menuItem}>
              {logOut()}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
