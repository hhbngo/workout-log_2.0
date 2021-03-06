import {
  AuthSuccessAction,
  AuthFalseAction,
  FetchExercisesAction,
  ToggleLoadingAction,
  AddExerciseAction,
  SetExerciseAction,
  SetEntryDatesAction,
  ResetExercisesAction,
} from './';

export enum ActionTypes {
  AUTH_SUCCESS,
  AUTH_FALSE,
  FETCH_EXERCISES,
  TOGGLE_LOADING,
  ADD_EXERCISE,
  SET_EXERCISE,
  SET_ENTRY_DATES,
  RESET_EXERCISES,
}

export type AuthAction = AuthSuccessAction | AuthFalseAction;
export type ExercisesAction =
  | FetchExercisesAction
  | ToggleLoadingAction
  | AddExerciseAction
  | SetExerciseAction
  | SetEntryDatesAction
  | ResetExercisesAction;
