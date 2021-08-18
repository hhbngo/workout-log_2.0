import { Exercise, Entry, Set } from '../store/actions';
import dayjs from 'dayjs';

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

const sortDatesFunction = (a: string, b: string) => {
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateA > dateB ? 1 : -1;
};

export const mapExercises = (rawData: RawData) => {
  const mappedExercises = [];
  const entryDates: string[] = [];

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
        setWithKey.data = dayjs(setWithKey.data).format('hh:mm a');
        mappedSets.push(setWithKey);
      }
      entryWithKey.sets = mappedSets;
      const formattedEntryDate = dayjs(entryWithKey.date)
        .format('MMM DD, YYYY-hh:mm a')
        .split('-');
      if (!entryDates.includes(formattedEntryDate[0]))
        entryDates.push(formattedEntryDate[0]);
      entryWithKey.date = formattedEntryDate[0];
      entryWithKey.time = formattedEntryDate[1];
      mappedEntries.push(entryWithKey);
    }
    exerciseWithKey.entries = mappedEntries.reverse();
    mappedExercises.push(exerciseWithKey);
  }

  return {
    exercises: mappedExercises.reverse(),
    entryDates: entryDates.sort(sortDatesFunction).reverse(),
  };
};

export const regroupEntryDates = (exercises: Exercise[]) => {
  const entryDatesArr: string[] = [];
  exercises.forEach((exercise) => {
    exercise.entries.forEach((entry) => {
      if (!entryDatesArr.includes(entry.date)) entryDatesArr.push(entry.date);
    });
  });
  return entryDatesArr.sort(sortDatesFunction).reverse();
};

export const insertNewEntry = (
  exercise: Exercise,
  entryData: { date: string; key: string }
) => {
  const formattedEntryDate = dayjs(entryData.date)
    .format('MMM DD, YYYY-hh:mm a')
    .split('-');
  entryData.date = formattedEntryDate[0];
  return {
    ...exercise,
    entries: [
      { ...entryData, time: formattedEntryDate[1], sets: [] },
      ...exercise.entries,
    ],
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

  setData.data = dayjs(setData.data).format('hh:mm a');

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

export const filterEntriesWithDateGap = (entries: Entry[], gap: number) => {
  if (entries.length <= 1) return entries;
  const selectedEntries = [];
  selectedEntries.push(entries[0]);
  let dateCounter = new Date(entries[0].date).getDate();
  entries.forEach((en) => {
    const date = new Date(en.date).getDate();
    if (date >= dateCounter + gap) {
      selectedEntries.push(en);
      dateCounter = date;
    }
  });
  return selectedEntries;
};

export const parseEntriesTotalVolume = (entries: Entry[]) => {
  return entries.map((en) => {
    const date = dayjs(en.date).format('MM/DD');
    const totalVolume = en.sets
      .map((set) => set.weight * set.reps)
      .reduce((a, b) => a + b, 0);
    return {
      date,
      volume: totalVolume,
    };
  });
};

export const parseEntriesMaxWeight = (entries: Entry[]) => {
  return entries.map((en) => {
    const date = dayjs(en.date).format('MM/DD');
    if (en.sets.length === 0) return { date, max: 0 };
    const maxWeight = en.sets.reduce((a, b) =>
      parseFloat(a.weight.toString()) > parseFloat(b.weight.toString()) ? a : b
    ).weight;
    return {
      date,
      max: maxWeight,
    };
  });
};

export const saveExerciseKeyToLocalStorage = (
  exerciseKey: string,
  entryKey?: string
) => {
  window.localStorage.setItem('exerciseKey', exerciseKey);
  entryKey && window.localStorage.setItem('entryKey', entryKey);
};
