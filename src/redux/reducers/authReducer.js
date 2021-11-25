import { SET_IS_LOGGED } from '../actionType';

const initState = {
  isLogged: false
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_IS_LOGGED: {
      return {
        ...state,
        isLogged: action.isLogged
      };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
