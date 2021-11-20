import React, { useEffect, useState, useMemo } from 'react';
import styles from './../styles/editor.module.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CodeInput from './CodeInput';

const Editor = () => {
  const { id } = useParams();
  const DEVIDER = `[devider]-${id}`;

  const [connected, setConnected] = useState(false);

  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [needToEmmitCode, setNeedToEmmitCode] = useState(true);

  // Get instance of socket, and connect to room with id of id from useParams and change if and only if id is changed
  let socket = useMemo(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', id);
    });

    socket.on('receiveCode', (code) => {
      if (code === '') return;
      const langs = code.split(DEVIDER);
      setHtml(langs[0]);
      setCss(langs[1]);
      setJs(langs[2]);
      setNeedToEmmitCode(false);
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
      if (
        connected &&
        needToEmmitCode &&
        (html !== '' || css !== '' || js !== '')
      ) {
        const code = html + DEVIDER + css + DEVIDER + js;
        socket.emit('code', code, id);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [html, css, js, id, socket, connected, needToEmmitCode]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `);
    }, 250);

    return () => {
      clearTimeout(timeOut);
    };
  }, [html, css, js]);

  // Essentialy editor should consist at least of code inputs and iframe where that code is executed so i need a few(3)
  // code inputs and 1 iframe and i want also be able to rearange
  // positions of these elementss
  return (
    <div className={styles.container}>
      <div className={styles.codeEditors}>
        <CodeInput
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}
          needToEmmitCode={setNeedToEmmitCode}
        />
        <CodeInput
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
          needToEmmitCode={setNeedToEmmitCode}
        />
        <CodeInput
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
          needToEmmitCode={setNeedToEmmitCode}
        />
      </div>

      <div className={styles.iframe}>
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Editor;
