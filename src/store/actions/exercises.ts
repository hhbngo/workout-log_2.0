import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from './';
import { StoreState } from '../reducers';
import {
  mapExercises,
  insertNewEntry,
  removeEntry,
  insertNewSet,
  removeSet,
} from '../../util/exercises';
import { MessageInstance } from 'antd/lib/message';

const BASE_URL = 'https://workout-log-f70d8-default-rtdb.firebaseio.com';

interface Prefs {
  weight: number;
  reps: number;
  rest: number;
}

export interface Exercise {
  name: string;
  bodyP: string;
  entries: Entry[];
  prefs: Prefs;
  key: string;
}

export interface Entry {
  date: string;
  sets: Set[];
  key: string;
}

export interface Set {
  date: string;
  weight: number;
  reps: number;
  rest: number;
  notes: string;
  key: string;
}

export interface FetchExercisesAction {
  type: ActionTypes.FETCH_EXERCISES;
  payload: Exercise[];
}

export interface ToggleLoadingAction {
  type: ActionTypes.TOGGLE_LOADING;
}

export interface AddExerciseAction {
  type: ActionTypes.ADD_EXERCISE;
  payload: Exercise;
}

export interface SetExerciseAction {
  type: ActionTypes.SET_EXERCISE;
  payload: Exercise[];
}

export interface ResetExercisesAction {
  type: ActionTypes.RESET_EXERCISES;
}

const toggleLoad = (): ToggleLoadingAction => ({
  type: ActionTypes.TOGGLE_LOADING,
});

export const resetExercises = (): ResetExercisesAction => ({
  type: ActionTypes.RESET_EXERCISES,
});

export const fetchExercises = () => {
  return async (dispatch: Dispatch, getState: () => StoreState) => {
    try {
      const { userId, token } = getState().auth;
      const res = await axios.get(
        `${BASE_URL}/users/${userId}/exercises.json?auth=${token}`
      );
      const exerciseArray = mapExercises(res.data);
      dispatch<FetchExercisesAction>({
        type: ActionTypes.FETCH_EXERCISES,
        payload: exerciseArray,
      });
    } catch (err) {
      dispatch<FetchExercisesAction>({
        type: ActionTypes.FETCH_EXERCISES,
        payload: [],
      });
    }
  };
};

export const addExercise = (
  exerciseData: { name: string; bodyP: string; prefs: Prefs },
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const { userId, token } = getState().auth;
    dispatch(toggleLoad());
    axios
      .post(
        `${BASE_URL}/users/${userId}/exercises.json?auth=${token}`,
        exerciseData
      )
      .then((res) => {
        dispatch<AddExerciseAction>({
          type: ActionTypes.ADD_EXERCISE,
          payload: {
            name: exerciseData.name,
            bodyP: exerciseData.bodyP,
            entries: [],
            prefs: exerciseData.prefs,
            key: res.data.name,
          },
        });
        window.scrollTo(0, 0);
        message.success('Exercise created successfully!');
      })
      .catch((err) => {
        dispatch(toggleLoad());
        message.error('Unable to create exercise!');
      });
  };
};

export const deleteExercise = (
  exerciseKey: string,
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const { userId, token } = getState().auth;
    dispatch(toggleLoad());
    axios
      .delete(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}.json?auth=${token}`
      )
      .then(() => {
        const { exercises } = getState().exercises;
        const filteredExercises = exercises.filter(
          (e) => e.key !== exerciseKey
        );
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: filteredExercises,
        });
        message.success('Exercise deleted successfully!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to delete exercise!');
      });
  };
};

export const editExercise = (
  exerciseData: { name: string; bodyP: string; key: string },
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    const { userId, token } = getState().auth;
    const { key, ...rest } = exerciseData;
    dispatch(toggleLoad());
    axios
      .patch(
        `${BASE_URL}/users/${userId}/exercises/${key}/.json?auth=${token}`,
        rest
      )
      .then(() => {
        const { exercises } = getState().exercises;
        const updatedExercises = exercises.map((e) =>
          e.key === key ? { ...e, ...rest } : e
        );
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: updatedExercises,
        });
        message.success('Exercise updated successfully!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to update exercise!');
      });
  };
};

export const addEntry = (exerciseKey: string, message: MessageInstance) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(toggleLoad());
    const { userId, token } = getState().auth;
    const date = new Date().toISOString();
    axios
      .post(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}/entries.json?auth=${token}`,
        { date }
      )
      .then((res) => {
        const { exercises } = getState().exercises;
        const selectedIndex = exercises.findIndex((e) => e.key === exerciseKey);
        const selectedExercise = exercises[selectedIndex];
        if (selectedExercise) {
          const updatedExercise = insertNewEntry(selectedExercise, {
            date,
            key: res.data.name,
          });
          const updatedCollection = exercises.map((e, i) =>
            i === selectedIndex ? updatedExercise : e
          );
          dispatch<SetExerciseAction>({
            type: ActionTypes.SET_EXERCISE,
            payload: updatedCollection,
          });
          message.success('Created entry successfully!');
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to create new entry.');
      });
  };
};

export const deleteEntry = (
  exerciseKey: string,
  entryKey: string,
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(toggleLoad());
    const { userId, token } = getState().auth;
    axios
      .delete(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}/entries/${entryKey}.json?auth=${token}`
      )
      .then(() => {
        const { exercises } = getState().exercises;
        const updatedCollection = removeEntry(exercises, exerciseKey, entryKey);
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: updatedCollection,
        });
        message.success('Entry deleted successfully!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to delete entry.');
      });
  };
};

export const addSet = (
  exerciseKey: string,
  entryKey: string,
  setData: Omit<Set, 'key'>,
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(toggleLoad());
    const { userId, token } = getState().auth;
    axios
      .post(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}/entries/${entryKey}/sets.json?auth=${token}`,
        setData
      )
      .then((res) => {
        const { exercises } = getState().exercises;
        const updatedCollection = insertNewSet(
          exercises,
          exerciseKey,
          entryKey,
          { ...setData, key: res.data.name }
        );
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: updatedCollection,
        });
        message.success('Set added!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to add set.');
      });
  };
};

export const deleteSet = (
  exerciseKey: string,
  entryKey: string,
  setKey: string,
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(toggleLoad());
    const { userId, token } = getState().auth;
    axios
      .delete(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}/entries/${entryKey}/sets/${setKey}.json?auth=${token}`
      )
      .then(() => {
        const { exercises } = getState().exercises;
        const updatedCollection = removeSet(
          exercises,
          exerciseKey,
          entryKey,
          setKey
        );
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: updatedCollection,
        });
        message.success('Set deleted!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to remove set.');
      });
  };
};

export const savePrefs = (
  exerciseKey: string,
  prefs: Prefs,
  message: MessageInstance
) => {
  return (dispatch: Dispatch, getState: () => StoreState) => {
    dispatch(toggleLoad());
    const { userId, token } = getState().auth;
    axios
      .patch(
        `${BASE_URL}/users/${userId}/exercises/${exerciseKey}/prefs/.json?auth=${token}`,
        prefs
      )
      .then(() => {
        const { exercises } = getState().exercises;
        const updatedCollection = exercises.map((e) =>
          e.key === exerciseKey ? { ...e, prefs } : e
        );
        dispatch<SetExerciseAction>({
          type: ActionTypes.SET_EXERCISE,
          payload: updatedCollection,
        });
        message.success('Saved set settings!');
      })
      .catch(() => {
        dispatch(toggleLoad());
        message.error('Unable to save settings.');
      });
  };
};
