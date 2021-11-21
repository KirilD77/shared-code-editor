import { SET_IS_LOGGED } from './actionType';

export const setIsLogged = (isLogged) => {
  const action = {
    type: SET_IS_LOGGED,
    isLogged
  };
  return action;
};
