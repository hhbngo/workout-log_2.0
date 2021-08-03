import { ActionTypes, ExercisesAction, Exercise } from '../actions';

export type ExerciseState = {
  exercises: Exercise[];
  loading: boolean;
  fetched: boolean;
};

const initialState: ExerciseState = {
  exercises: [],
  loading: true,
  fetched: false,
};

const reducer = (
  state: ExerciseState = initialState,
  action: ExercisesAction
) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_LOADING:
      return { ...state, loading: !state.loading };
    case ActionTypes.FETCH_EXERCISES:
      return {
        ...state,
        exercises: action.payload,
        fetched: true,
        loading: false,
      };
    case ActionTypes.ADD_EXERCISE:
      return {
        ...state,
        exercises: [action.payload, ...state.exercises],
        loading: false,
      };
    case ActionTypes.SET_EXERCISE:
      return { ...state, exercises: action.payload, loading: false };
    case ActionTypes.RESET_EXERCISES:
      return { ...state, exercises: [], loading: true, fetched: false };
    default:
      return state;
  }
};

export default reducer;

// reset exercise reducer on logout OR set fetched to false + loading to true
