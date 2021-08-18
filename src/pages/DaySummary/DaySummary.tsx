import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';
import classes from '../Entry/Entry.module.css';

import BackButton from '../../components/BackButton/BackButton';
import Set from '../Entry/Set/Set';
import { Entry } from '../../store/actions';

interface HistoryState {
  date: string;
}

interface EntryWithName extends Entry {
  name?: string;
}

const DaySummary: React.FC = () => {
  const history = useHistory<HistoryState>();
  const [date] = useState(history.location.state.date);
  const { exercises, fetched } = useSelector(
    (state: StoreState) => state.exercises
  );

  const dayExercisesCollection = useMemo(() => {
    const collection: EntryWithName[] = [];
    exercises.forEach((exercise) => {
      exercise.entries.forEach((entry) => {
        if (entry.date === date)
          collection.push({ ...entry, name: exercise.name });
      });
    });
    return collection;
  }, [date]);

  const renderLifts = () => {
    return dayExercisesCollection.map((entry, i) => {
      const volume = entry.sets
        .map((set) => set.weight * set.reps)
        .reduce((a, b) => a + b, 0);
      return entry.sets.length > 0 ? (
        <div className={classes.sets_container} key={i}>
          <p className={classes.v_name}>{entry.name}</p>
          <p className={classes.volume}>
            <span>Volume:</span> {volume}
          </p>
          {entry.sets.map((s, i) => {
            return <Set index={i} set={s} key={i} time={s.data} />;
          })}
        </div>
      ) : null;
    });
  };

  useEffect(() => {
    if (!fetched) history.push('/');
  }, [fetched]);

  return dayExercisesCollection ? (
    <div className={classes.container}>
      <BackButton handleBackClick={() => history.push('/')} />
      <h1 style={{ marginBottom: '70px' }}>{date}</h1>
      {renderLifts()}
    </div>
  ) : null;
};

export default DaySummary;
