import React from 'react';
import loader from "./../assets/loader.svg"
import styles from "./../styles/loader.module.css"

const Loader = () => {
    return (
        <div className={styles.container}>
            <img src={loader} alt="Loader" />
        </div>
    );
};

export default Loader;