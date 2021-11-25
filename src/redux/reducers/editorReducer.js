import {
  SET_ID_OF_ROOM,
  SET_IS_CONNECTED_TO_SERVER,
  SET_IS_LOGGED,
  SET_LANGUAGES,
  SET_SHOULD_EMIT_CODE,
  SET_SOCKET,
  SET_SRC_DOC
} from '../actionType';

const initState = {
  idOfRoom: null,
  isConnectedToServer: false,
  languages: {
    html: '',
    css: '',
    js: ''
  },
  srcDoc: {},
  shouldEmitCode: false,
  socket: null
};

export const editorReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED: {
      return {
        ...state,
        isLogged: action.isLogged
      };
    }
    case SET_ID_OF_ROOM: {
      return {
        ...state,
        idOfRoom: action.idOfRoom
      };
    }

    case SET_IS_CONNECTED_TO_SERVER: {
      return {
        ...state,
        isConnectedToServer: action.isConnectedToServer
      };
    }

    case SET_LANGUAGES: {
      return {
        ...state,
        languages: action.languages
      };
    }

    case SET_SRC_DOC: {
      return {
        ...state,
        srcDoc: action.srcDoc
      };
    }

    case SET_SHOULD_EMIT_CODE: {
      return {
        ...state,
        shouldEmitCode: action.shouldEmitCode
      };
    }

    case SET_SOCKET: {
      return {
        ...state,
        socket: action.socket
      };
    }

    default: {
      return state;
    }
  }
};
