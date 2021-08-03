import { ActionTypes, AuthAction } from '../actions';

export interface AuthState {
  authed: boolean | null;
  userId: string;
  token: string;
}

const initialState = {
  authed: null,
  userId: '',
  token: '',
};

const reducer = (state: AuthState = initialState, action: AuthAction) => {
  switch (action.type) {
    case ActionTypes.AUTH_SUCCESS:
      return { ...state, authed: true, ...action.payload };
    case ActionTypes.AUTH_FALSE:
      return { ...state, authed: false, userId: '', token: '' };
    default:
      return state;
  }
};

export default reducer;
