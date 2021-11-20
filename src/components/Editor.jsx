import React, { useEffect, useState, useMemo } from 'react';
import styles from './../styles/editor.module.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
const Editor = () => {
  const { id } = useParams();
  const [connected, setConnected] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Get instance of socket, and connect to room with id of id from useParams and change if and only if id is changed
  let socket = useMemo(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', id);
    });

    socket.on('receiveCode', (code) => {
      setInputValue(code);
    });

    return socket;
  }, [id]);

  
  // In case of component unmounting close the socket connection
  useEffect(() => {
    return () => socket.close();
  }, [socket]);

  // here inputValue is emited to server to broadcast to every in room
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (connected && inputValue !== "") {
        socket.emit('code', inputValue, id);
      }
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue, id, socket, connected]);

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

export default Editor;
