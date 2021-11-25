import {
  SET_ID_OF_ROOM,
  SET_IS_CONNECTED_TO_SERVER,
  SET_IS_LOGGED,
  SET_LANGUAGES,
  SET_SHOULD_EMIT_CODE,
  SET_SOCKET,
  SET_SRC_DOC
} from './actionType';
import { DEVIDER } from '../constants';

/**
 * @param {String} type name of an dispatched action
 * @param {String} name name of property in store of data that is being dispatched
 * @returns action creator
 */
const createActionCreator = (type, name) => {
  return (data) => {
    const action = { type };
    action[name] = data;
    return action;
  };
};

export const setIsLogged = createActionCreator(SET_IS_LOGGED, 'isLogged');
export const setIdOfRoom = createActionCreator(SET_ID_OF_ROOM, 'idOfRoom');
export const setIsConnectedToServer = createActionCreator(
  SET_IS_CONNECTED_TO_SERVER,
  'isConnectedToServer'
);
export const setLanguages = createActionCreator(SET_LANGUAGES, 'languages');
export const setSrcDoc = createActionCreator(SET_SRC_DOC, 'srcDoc');
export const setShouldEmitCode = createActionCreator(
  SET_SHOULD_EMIT_CODE,
  'shouldEmitCode'
);
export const setSocket = createActionCreator(SET_SOCKET, 'socket');

export const sendCodeToServer = (shouldSendCodeToServer) => {
  return (_, state) => {
    const { shouldEmitCode, languages, idOfRoom, socket } = state().editor;
    const { html, css, js } = languages;
    const devider = DEVIDER;
    setTimeout(() => {
      // means if for example component has been unmounted we should not dispatch anything
      if (!shouldSendCodeToServer) return;
      else if (shouldEmitCode && (html !== '' || css !== '' || js !== '')) {
        const code =
          languages.html + devider + languages.css + devider + languages.js;
        socket.emit('code', code, idOfRoom);
      }
    }, 1000);
  };
};

export const updateIframe = (shouldUpdateIframe) => {
  return (dispatch, state) => {
    const { languages } = state().editor;
    const { html, css, js } = languages;
    setTimeout(() => {
      if (!shouldUpdateIframe) return;
      console.log("about ot update iframe")
      dispatch(
        setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `)
      );
    }, 250);
  };
};
