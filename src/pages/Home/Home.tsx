import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';
import { Form, Spin } from 'antd';
import classes from './Home.module.css';
import Modal from '../../components/Modal/Modal';
import ExerciseForm from './ExerciseForm/ExerciseFrom';
import AddButton from '../../components/AddButton/AddButton';
import SearchBar from './SearchBar/SearchBar';
import EmptyBox from '../../components/EmptyBox/EmptyBox';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import EntryLabel from '../../components/EntryLabel/EntryLabel';
import {
  fetchExercises,
  addExercise,
  deleteExercise,
  editExercise,
} from '../../store/actions';
import { Button, Pagination } from 'antd';

interface EditProps {
  name: string;
  category: string;
}

interface HistoryState {
  key?: string;
  date?: string;
}

const getHomeMode = () => {
  const mode = localStorage.getItem('homeMode');
  return mode ? +mode : 1;
};

const getHistoricPage = () => {
  const page = localStorage.getItem('pageHistory');
  return page ? +page : 1;
};

const Home: React.FC = () => {
  const history = useHistory<HistoryState>();
  const [searchVal, setSearchVal] = useState('');
  const [viewMode, setViewMode] = useState(getHomeMode()); // 1 is exercise, 0 is days
  const [selectedKey, setSelectedKey] = useState<null | string>(null);
  const [show, setShow] = useState(false);
  const [formMode, setFormMode] = useState('Add');
  const [paginationPage, setPaginationPage] = useState(getHistoricPage());
  const [pageFactor, setPageFactor] = useState((getHistoricPage() - 1) * 6);
  const { loading, exercises, fetched, entryDates } = useSelector(
    (state: StoreState) => state.exercises
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchExercises());
    }
    window.scrollTo(0, 0);
    const previousExerciseKey = window.localStorage.getItem('exerciseKey');
    if (fetched && previousExerciseKey) {
      window.localStorage.removeItem('exerciseKey');
      history.push('/entry', { key: previousExerciseKey });
    }
  }, [fetched]);

  const handleAddClick = () => {
    form.resetFields();
    setFormMode('Add');
    setShow(true);
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleModalClose = () => {
    setShow(false);
    form.resetFields();
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>, key: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      dispatch(deleteExercise(key));
    }
  };

  const handleEditClick = (editProps: EditProps, key: string) => {
    form.setFieldsValue(editProps);
    setFormMode('Edit');
    setSelectedKey(key);
    setShow(true);
  };

  const handleAddSubmit = async (values: any) => {
    handleModalClose();
    const { name, category: bodyP } = values;
    dispatch(
      addExercise({ name, bodyP, prefs: { weight: 45, reps: 1, rest: 60 } })
    );
  };

  const handleEditSubmit = (values: any) => {
    if (!selectedKey) return;
    handleModalClose();
    const { name, category: bodyP } = values;
    dispatch(editExercise({ name, bodyP, key: selectedKey }));
    setSelectedKey(null);
  };

  const handleEntryClick = (key: string) => history.push('/entry', { key });

  const filteredExercises = useMemo(() => {
    return searchVal === ''
      ? exercises
      : exercises.filter((exercise) => {
          const search = searchVal.toLowerCase();
          const matchesName = exercise.name.toLowerCase().includes(search);
          const matchesCategory = exercise.bodyP.toLowerCase().includes(search);
          return matchesName || matchesCategory;
        });
  }, [exercises, searchVal]);

  const renderExerciseCards = () => {
    return filteredExercises.map((n) => (
      <ExerciseCard
        key={n.key}
        exercise={n}
        onSwitchClick={() => handleEntryClick(n.key)}
        handleEditClick={() =>
          handleEditClick({ name: n.name, category: n.bodyP }, n.key)
        }
        handleDeleteClick={handleDeleteClick}
        showingModal={show}
      />
    ));
  };

  const renderPhantoms = () => {
    const exerciseLength = filteredExercises.length;
    if (exerciseLength === 0) return null;
    const amount = 3 - (exerciseLength % 3);
    return [...Array(amount)].map((e, i) => (
      <div key={i} className={classes.phantom}></div>
    ));
  };

  const handleToggleMode = () => {
    const mode = 1 - viewMode;
    mode && window.localStorage.removeItem('pageHistory');
    window.localStorage.setItem('homeMode', mode.toString());
    setViewMode(mode);
    setSearchVal('');
    setPaginationPage(1);
  };

  const handlePageChange = (page: number) => {
    window.localStorage.setItem('pageHistory', page.toString());
    setPaginationPage(page);
    setPageFactor((page - 1) * 6);
  };

  return loading ? (
    <div className={classes.spinner_container}>
      <Spin size="large" />
    </div>
  ) : (
    <div className={classes.container}>
      <Modal show={show} onClose={handleModalClose}>
        <ExerciseForm
          show={show}
          form={form}
          mode={formMode}
          onSubmit={formMode === 'Add' ? handleAddSubmit : handleEditSubmit}
          onClose={handleModalClose}
        />
      </Modal>
      <SearchBar searchValue={searchVal} onInputChange={onSearchChange} />
      <AddButton handleAddClick={handleAddClick} disabled={!viewMode} />
      <Button
        type="default"
        size="middle"
        className={classes.view_button}
        onClick={handleToggleMode}
      >
        {viewMode ? 'View workouts by date »' : '« Back to exercises'}
      </Button>
      {exercises.length === 0 ? (
        <EmptyBox placeholder="No Exercises" />
      ) : viewMode ? (
        <div className={classes.cards_container}>
          {renderExerciseCards()}
          {renderPhantoms()}
        </div>
      ) : (
        <div className={classes.labels_container}>
          {entryDates.slice(0 + pageFactor, 6 + pageFactor).map((date, i) => {
            return (
              <EntryLabel
                key={i}
                handleEntryLabelClick={() => history.push('/day', { date })}
                date={date}
                time={' '}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '26px',
            }}
          >
            <Pagination
              onChange={handlePageChange}
              defaultCurrent={paginationPage}
              current={paginationPage}
              total={entryDates.length}
              pageSize={6}
              hideOnSinglePage
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
