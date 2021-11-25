import React, { useEffect, useMemo } from 'react';
import styles from './../styles/editor.module.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CodeInput from './CodeInput';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  sendCodeToServer,
  setIdOfRoom,
  setIsConnectedToServer,
  setLanguages,
  setShouldEmitCode,
  setSocket,
  updateIframe
} from '../redux/actionCreators';
import { DEVIDER } from '../constants';

const Editor = () => {
  // i can do so because useSelector will not rerender component again and again because it will not rerender component if useSelector returns the same objects after dispatching an action
  const dispatch = useDispatch();
  dispatch(setIdOfRoom(useParams().id));

  const { isLogged, languages, srcDoc, id } =
    useSelector((state) => {
      return {
        isLogged: state.userAuth.isLogged,
        connected: state.editor.isConnectedToServer,
        languages: state.editor.languages,
        srcDoc: state.editor.srcDoc,
        shouldEmitCode: state.editor.shouldEmitCode,
        id: state.editor.idOfRoom
      };
    }, shallowEqual);
/*   console.log('connected: ', connected) */

  const devider = DEVIDER;

  // Get instance of socket, and connect to room with id of id from useParams and change if and only if id is changed and dispatch it to the store
  let initSocket = useMemo(() => {
    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      dispatch(setIsConnectedToServer(true));
      socket.emit('join-room', id);
    });

    socket.on('receiveCode', (code) => {
      const langs = code.split(devider);
      if (code === '') {
        return;
      };
      dispatch(
        setLanguages({
          html: langs[0],
          css: langs[1],
          js: langs[2]
        })
      );
      dispatch(setShouldEmitCode(false));
    });

    return socket;
  }, [id, devider, dispatch]);
  dispatch(setSocket(initSocket));

  // In case of component unmounting close the socket connection
  useEffect(() => {
    return () => initSocket.close();
  }, [initSocket]);

  // here code is emited to server to broadcast to everybody in room
  useEffect(() => {
    let shouldSendCodeToserver = true;
    dispatch(sendCodeToServer(shouldSendCodeToserver));
    return () => {
      shouldSendCodeToserver = false;
    };
  }, [languages, dispatch]);

  // logic for updating iframe, every time languages changed, execute callback in following useEffect
  useEffect(() => {
    let shouldUpdateIframe = true;
    dispatch(updateIframe(shouldUpdateIframe))
    return () => {
      shouldUpdateIframe = false;
    };
  }, [languages, dispatch]);

  // Essentialy editor should consist at least of code inputs and iframe where that code is executed so i need a few(3)
  // code inputs and 1 iframe and i want also be able to rearange
  // positions of these elementss
  return isLogged ? (
    <div className={styles.container}>
      <div className={styles.codeEditors}>
        <CodeInput
          language="xml"
          displayName="HTML"
          value={languages.html}
          onChange={(value) => {
            dispatch(
              setLanguages({
                html: value,
                css: languages.css,
                js: languages.js
              })
            );
          }}
          shouldEmitCode={(value) => dispatch(setShouldEmitCode(value))}
        />
        <CodeInput
          language="css"
          displayName="CSS"
          value={languages.css}
          onChange={(value) => {
            dispatch(
              setLanguages({
                html: languages.html,
                css: value,
                js: languages.js
              })
            );
          }}
          shouldEmitCode={(value) => dispatch(setShouldEmitCode(value))}
        />
        <CodeInput
          language="javascript"
          displayName="JS"
          value={languages.js}
          onChange={(value) => {
            dispatch(
              setLanguages({
                html: languages.html,
                css: languages.css,
                js: value
              })
            );
          }}
          shouldEmitCode={(value) => dispatch(setShouldEmitCode(value))}
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
    </div>
  ) : (
    'You are not loged in'
  );
};

export default Editor;
