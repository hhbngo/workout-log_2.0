import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';
import dayjs from 'dayjs';
import {
  addEntry,
  deleteEntry,
  addSet,
  deleteSet,
  savePrefs,
} from '../../store/actions';
import classes from './Entry.module.css';
import { Button, message, Form } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import Modal from '../../components/Modal/Modal';
import EntryForm from './EntryForm/EntryForm';
import AddButton from '../../components/AddButton/AddButton';
import BackButton from '../../components/BackButton/BackButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import EmptyBox from '../../components/EmptyBox/EmptyBox';
import Set from './Set/Set';

interface HistoryState {
  key?: string;
}

const Entry: React.FC = () => {
  const [selectedEntryKey, setSelectedEntryKey] = useState<null | string>(null);
  const [showModal, setShowModal] = useState(false);
  const [entryDate, setEntryDate] = useState('');
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
    form.resetFields();
  };

  const handleEntryLabelClick = (key: string, date: string) => {
    setSelectedEntryKey(key);
    setEntryDate(date);
  };

  const goToHome = () => history.push('/');
  const goToEntrySelect = () => setSelectedEntryKey(null);

  const handleAddEntry = () => {
    if (exercise && exercise.key) {
      dispatch(addEntry(exercise.key, message));
    }
  };

  const handleDeleteEntry = (entryKey: string) => {
    if (exercise && exercise.key) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        dispatch(deleteEntry(exercise.key, entryKey, message));
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
      dispatch(addSet(exercise.key, selectedEntryKey, setData, message));
      handleModalClose();
    }
  };

  const handleSetDelete = (setKey: string) => {
    if (exercise && exercise.key && selectedEntryKey) {
      dispatch(deleteSet(exercise.key, selectedEntryKey, setKey, message));
      handleModalClose();
    }
  };

  const handleSavePrefs = () => {
    if (exercise && exercise.key) {
      form
        .validateFields(['weight', 'reps', 'rest'])
        .then(() => {
          const { notes, ...prefs } = form.getFieldsValue();
          dispatch(savePrefs(exercise.key, prefs, message));
        })
        .catch(() => {
          return;
        });
    }
  };

  const exercise = useMemo(() => {
    return exercises.find((e) => e.key === history.location.state.key);
  }, [exercises]);

  const entryLabels = useMemo(() => {
    return exercise && exercise.entries.length > 0 ? (
      exercise.entries.map((e, i) => {
        const date = dayjs(e.date);
        const DD = date.format('MMM DD, YYYY');
        return (
          <div
            className={classes.entry_label}
            key={i}
            onClick={() => handleEntryLabelClick(e.key, DD)}
          >
            <p className={classes.date}>{DD}</p>
            <p className={classes.time}>{date.format('hh:mm a')}</p>
            <RightOutlined />
          </div>
        );
      })
    ) : (
      <EmptyBox placeholder="No entries" />
    );
  }, [exercise]);

  const entry = useMemo(() => {
    return exercise
      ? exercise.entries.find((e) => e.key === selectedEntryKey)
      : null;
  }, [exercise, selectedEntryKey]);

  const sets = useMemo(() => {
    return entry && entry.sets.length > 0
      ? entry.sets.map((s, i) => {
          const time = dayjs(s.date).format('hh:mm a');
          return (
            <Set
              index={i}
              set={s}
              key={i}
              time={time}
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
      : '(No sets)';
  }, [entry]);

  useEffect(() => {
    if (!fetched || !exercise) history.push('/');
    window.scrollTo(0, 0);
  }, [fetched, exercise, entry]);

  return exercise ? (
    <div className={classes.container}>
      <BackButton handleBackClick={entry ? goToEntrySelect : goToHome} />
      <Modal show={showModal} onClose={handleModalClose}>
        <EntryForm
          form={form}
          show={showModal}
          onSubmit={handleSetSubmit}
          onClose={handleModalClose}
          prefs={exercise.prefs}
          onSavePrefs={handleSavePrefs}
        />
      </Modal>
      {entry ? (
        <>
          <DeleteButton
            handleDeleteClick={() => handleDeleteEntry(entry.key)}
            loading={loading}
          />
          <h1>{entryDate}</h1>
          <div className={classes.sets_container}>
            <p className={classes.volume}>
              <span>Total volume:</span> {totalVolume}
            </p>
            {sets}
            <Button
              type="dashed"
              style={{
                width: '210px',
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
