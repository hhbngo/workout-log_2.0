import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';
import {
  addEntry,
  deleteEntry,
  addSet,
  deleteSet,
  savePrefs,
} from '../../store/actions';
import classes from './Entry.module.css';
import { Button, Form } from 'antd';

import Modal from '../../components/Modal/Modal';
import EntryForm from './EntryForm/EntryForm';
import AddButton from '../../components/AddButton/AddButton';
import BackButton from '../../components/BackButton/BackButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import EntryLabel from '../../components/EntryLabel/EntryLabel';
import EmptyBox from '../../components/EmptyBox/EmptyBox';
import Set from './Set/Set';

interface HistoryState {
  key?: string;
}

const Entry: React.FC = () => {
  const [selectedEntryKey, setSelectedEntryKey] = useState<null | string>(
    window.localStorage.getItem('entryKey')
  );
  const [showModal, setShowModal] = useState(false);
  const [entryDate, setEntryDate] = useState('');
  const [notesChecked, setNotesCheckd] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory<HistoryState>();
  const { exercises, fetched, loading } = useSelector(
    (state: StoreState) => state.exercises
  );
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNotesCheckd(false);
    form.resetFields();
  };

  const handleEntryLabelClick = (key: string, date: string) => {
    setSelectedEntryKey(key);
  };

  const goToHome = () => history.push('/');
  const goToEntrySelect = () => setSelectedEntryKey(null);

  const handleAddEntry = () => {
    if (exercise && exercise.key) {
      dispatch(addEntry(exercise.key));
    }
  };

  const handleDeleteEntry = (entryKey: string) => {
    if (exercise && exercise.key) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        dispatch(deleteEntry(exercise.key, entryKey));
      }
    }
  };

  const handleSetSubmit = () => {
    if (exercise && exercise.key && selectedEntryKey) {
      const fields = form.getFieldsValue();
      const setData = {
        data: new Date().toISOString(),
        ...fields,
      };
      dispatch(addSet(exercise.key, selectedEntryKey, setData));
      handleModalClose();
    }
  };

  const handleSetDelete = (setKey: string) => {
    if (exercise && exercise.key && selectedEntryKey) {
      dispatch(deleteSet(exercise.key, selectedEntryKey, setKey));
      handleModalClose();
    }
  };

  const handleSavePrefs = () => {
    if (exercise && exercise.key) {
      form
        .validateFields(['weight', 'reps', 'rest'])
        .then(() => {
          const { notes, ...prefs } = form.getFieldsValue();
          dispatch(savePrefs(exercise.key, prefs));
        })
        .catch(() => {
          return;
        });
    }
  };

  const handleNotesCheck = () => {
    if (notesChecked) form.resetFields(['notes']);
    setNotesCheckd(!notesChecked);
  };

  const exercise = useMemo(() => {
    return exercises.find((e) => e.key === history.location.state.key);
  }, [exercises]);

  const entryLabels = useMemo(() => {
    return exercise && exercise.entries.length > 0 ? (
      exercise.entries.map((e, i) => {
        return (
          <EntryLabel
            key={i}
            handleEntryLabelClick={() => handleEntryLabelClick(e.key, e.date)}
            date={e.date}
            time={e.time || ' '}
          />
        );
      })
    ) : (
      <EmptyBox placeholder="No entries" />
    );
  }, [exercise]);

  const entry = useMemo(() => {
    if (!exercise) return null;
    const selected = exercise.entries.find((e) => e.key === selectedEntryKey);
    selected && setEntryDate(selected.date);
    return selected;
  }, [exercise, selectedEntryKey]);

  const sets = useMemo(() => {
    return entry && entry.sets.length > 0
      ? entry.sets.map((s, i) => {
          return (
            <Set
              index={i}
              set={s}
              key={i}
              time={s.data}
              onDeleteSet={handleSetDelete}
            />
          );
        })
      : null;
  }, [entry]);

  const totalVolume = useMemo(() => {
    return entry && entry.sets.length > 0
      ? entry.sets
          .map((set) => set.weight * set.reps)
          .reduce((a, b) => a + b, 0)
      : '(no sets)';
  }, [entry]);

  const handleDuplicateSet = () => {
    if (exercise && exercise.key && selectedEntryKey && entry) {
      const previousSet = entry.sets[entry.sets.length - 1];
      const setData = { ...previousSet, data: new Date().toISOString() };
      dispatch(addSet(exercise.key, selectedEntryKey, setData));
    }
  };

  useEffect(() => {
    if (!fetched || !exercise) {
      history.push('/');
    } else {
      const previousEntryKey = window.localStorage.getItem('entryKey');
      if (previousEntryKey) window.localStorage.removeItem('entryKey');
    }
  }, [fetched, exercise, entry]);

  return exercise ? (
    <div className={classes.container}>
      <BackButton handleBackClick={entry ? goToEntrySelect : goToHome} />

      {entry ? (
        <>
          <Modal show={showModal} onClose={handleModalClose}>
            <EntryForm
              form={form}
              show={showModal}
              onSubmit={handleSetSubmit}
              onClose={handleModalClose}
              prefs={exercise.prefs}
              onSavePrefs={handleSavePrefs}
              checked={notesChecked}
              onCheck={handleNotesCheck}
            />
          </Modal>
          <DeleteButton
            handleDeleteClick={() => handleDeleteEntry(entry.key)}
            loading={loading}
          />
          <h1>{entryDate}</h1>
          <div className={classes.sets_container}>
            <p className={classes.volume}>
              <span>Volume:</span> {totalVolume}
            </p>
            {sets}
            {sets && sets.length > 0 && (
              <div className={classes.duplicate_set}>
                <p onClick={handleDuplicateSet}>Duplicate previous set +</p>
              </div>
            )}
            <Button
              type="dashed"
              style={{
                width: '216px',
                marginTop: '10px',
              }}
              onClick={handleOpenModal}
              loading={loading}
            >
              <strong>Add Set +</strong>
            </Button>
          </div>
        </>
      ) : (
        <>
          <AddButton handleAddClick={handleAddEntry} loading={loading} />
          <h1>{exercise.name}</h1>
          {entryLabels}
        </>
      )}
    </div>
  ) : null;
};

export default Entry;
