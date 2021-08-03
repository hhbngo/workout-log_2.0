import { combineReducers } from 'redux';
import authReducer, { AuthState } from './auth';
import exercisesReducer, { ExerciseState } from './exercises';

export interface StoreState {
  auth: AuthState;
  exercises: ExerciseState;
}

export default combineReducers<StoreState>({
  auth: authReducer,
  exercises: exercisesReducer,
});
