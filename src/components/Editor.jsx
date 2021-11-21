import React, { useEffect, useState, useMemo } from 'react';
import styles from './../styles/editor.module.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CodeInput from './CodeInput';
import { useSelector } from 'react-redux';

const Editor = () => {
  const { id } = useParams();
  const DEVIDER = `[devider]-${id}`;

  const { isLogged } = useSelector((state) => {
    return {
      isLogged: state.userAuth.isLogged
    };
  });

  const [connected, setConnected] = useState(false);
  const [languages, setLanguages] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [srcDoc, setSrcDoc] = useState('');
  const [shouldEmitCode, setShouldEmitCode] = useState(true);

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
      setLanguages({
        html: langs[0],
        css: langs[1],
        js: langs[2]
      });
      setShouldEmitCode(false);
    });

    return socket;
  }, [id, DEVIDER]);

  // In case of component unmounting close the socket connection
  useEffect(() => {
    return () => socket.close();
  }, [socket]);

  // here inputValue is emited to server to broadcast to every in room
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        connected &&
        // need to do so because when user is just connected he should not send his initial empty code to server to broadcast to everyone else.
        shouldEmitCode &&
        (languages.html !== '' || languages.css !== '' || languages.js !== '')
      ) {
        const code =
          languages.html + DEVIDER + languages.css + DEVIDER + languages.js;
        socket.emit('code', code, id);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [languages, id, socket, connected, shouldEmitCode, DEVIDER]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${languages.html}</body>
        <style>${languages.css}</style>
        <script>${languages.js}</script>
      </html>
    `);
    }, 250);

    return () => {
      clearTimeout(timeOut);
    };
  }, [languages]);

  // Essentialy editor should consist at least of code inputs and iframe where that code is executed so i need a few(3)
  // code inputs and 1 iframe and i want also be able to rearange
  // positions of these elementss
  return (
    isLogged ?
      <div className={styles.container}>
        <div className={styles.codeEditors}>
          <CodeInput
            language="xml"
            displayName="HTML"
            value={languages.html}
            onChange={(value) => {
              setLanguages((oldLangs) => {
                return {
                  html: value,
                  css: oldLangs.css,
                  js: oldLangs.js
                };
              });
            }}
            shouldEmitCode={setShouldEmitCode}
          />
          <CodeInput
            language="css"
            displayName="CSS"
            value={languages.css}
            onChange={(value) => {
              setLanguages((oldLangs) => {
                return {
                  html: oldLangs.html,
                  css: value,
                  js: oldLangs.js
                };
              });
            }}
            shouldEmitCode={setShouldEmitCode}
          />
          <CodeInput
            language="javascript"
            displayName="JS"
            value={languages.js}
            onChange={(value) => {
              setLanguages((oldLangs) => {
                return {
                  html: oldLangs.html,
                  css: oldLangs.css,
                  js: value
                };
              });
            }}
            shouldEmitCode={setShouldEmitCode}
          />
        </div>

        <div className={styles.iframe}>
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="2px"
            width="100%"
            height="100%"
          />
        </div>
      </div> : "You are not loged in"
  );
};

export default Editor;
