import { ActionTypes } from './';
import { Dispatch } from 'redux';
import firebase from 'firebase';

type UserData = {
  userId: string;
  token: string;
};

export interface AuthSuccessAction {
  type: ActionTypes.AUTH_SUCCESS;
  payload: UserData;
}

export interface AuthFalseAction {
  type: ActionTypes.AUTH_FALSE;
}

export const authSuccess = (user: firebase.User) => {
  return (dispatch: Dispatch) => {
    user.getIdToken().then((token) => {
      dispatch<AuthSuccessAction>({
        type: ActionTypes.AUTH_SUCCESS,
        payload: {
          userId: user.uid,
          token: token,
        },
      });
    });
  };
};

export const authFalse = (): AuthFalseAction => ({
  type: ActionTypes.AUTH_FALSE,
});
