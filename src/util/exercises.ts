import { Exercise, Entry, Set } from '../store/actions';

interface RawSetStructure {
  date: string;
  weight: number;
  reps: number;
  rest: string;
  notes: string;
}

interface RawEntryStructure {
  date: string;
  sets: {
    [key: string]: RawSetStructure;
  };
}

interface RawExerciseStructure {
  name: string;
  bodyP: string;
  prefs: { weight: number; reps: number; rest: number };
  entries: {
    [key: string]: RawEntryStructure;
  };
}

interface RawData {
  [key: string]: RawExerciseStructure;
}

const turnKeysToProperty = <T>(obj: any, key: string): T => {
  return { ...obj, key };
};

export const mapExercises = (rawData: RawData) => {
  const mappedExercises = [];

  for (const key in rawData) {
    const exerciseWithKey = turnKeysToProperty<Exercise>(rawData[key], key);
    const mappedEntries = [];

    for (const key in exerciseWithKey.entries) {
      const entryWithKey = turnKeysToProperty<Entry>(
        exerciseWithKey.entries[key],
        key
      );
      const mappedSets = [];

      for (const key in entryWithKey.sets) {
        const setWithKey = turnKeysToProperty<Set>(entryWithKey.sets[key], key);
        mappedSets.push(setWithKey);
      }
      entryWithKey.sets = mappedSets;
      mappedEntries.push(entryWithKey);
    }
    exerciseWithKey.entries = mappedEntries.reverse();
    mappedExercises.push(exerciseWithKey);
  }

  return mappedExercises.reverse();
};

export const insertNewEntry = (
  exercise: Exercise,
  entryData: { date: string; key: string }
) => {
  return {
    ...exercise,
    entries: [{ ...entryData, sets: [] }, ...exercise.entries],
  };
};

export const removeEntry = (
  exercises: Exercise[],
  exerciseKey: string,
  entryKey: string
) => {
  const selectedExerciseIndex = exercises.findIndex(
    (ex) => ex.key === exerciseKey
  );
  const selectedEntryIndex = exercises[selectedExerciseIndex].entries.findIndex(
    (en) => en.key === entryKey
  );
  const selectedExercise = exercises[selectedExerciseIndex];

  const updatedExercise = {
    ...selectedExercise,
    entries: selectedExercise.entries.filter(
      (e, i) => i !== selectedEntryIndex
    ),
  };

  return exercises.map((e, i) =>
    i === selectedExerciseIndex ? updatedExercise : e
  );
};

export const insertNewSet = (
  exercises: Exercise[],
  exerciseKey: string,
  entryKey: string,
  setData: Set
) => {
  const selectedExerciseIndex = exercises.findIndex(
    (ex) => ex.key === exerciseKey
  );
  const selectedEntryIndex = exercises[selectedExerciseIndex].entries.findIndex(
    (en) => en.key === entryKey
  );
  const selectedExercise = exercises[selectedExerciseIndex];

  const updatedExercise = {
    ...selectedExercise,
    entries: selectedExercise.entries.map((e, i) =>
      i === selectedEntryIndex ? { ...e, sets: e.sets.concat(setData) } : e
    ),
  };

  return exercises.map((e, i) =>
    i === selectedExerciseIndex ? updatedExercise : e
  );
};

export const removeSet = (
  exercises: Exercise[],
  exerciseKey: string,
  entryKey: string,
  setKey: string
) => {
  const selectedExerciseIndex = exercises.findIndex(
    (ex) => ex.key === exerciseKey
  );
  const selectedEntryIndex = exercises[selectedExerciseIndex].entries.findIndex(
    (en) => en.key === entryKey
  );

  const selectedExercise = exercises[selectedExerciseIndex];

  const selectedEntry = selectedExercise.entries[selectedEntryIndex];

  const selectedSetIndex = selectedEntry.sets.findIndex(
    (se) => se.key === setKey
  );

  const updatedExercise = {
    ...selectedExercise,
    entries: selectedExercise.entries.map((en, i) => {
      return i === selectedEntryIndex
        ? {
            ...en,
            sets: selectedEntry.sets.filter((s, i) => i !== selectedSetIndex),
          }
        : en;
    }),
  };

  return exercises.map((e, i) =>
    i === selectedExerciseIndex ? updatedExercise : e
  );
};
