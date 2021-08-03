import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';
import { Form, Spin, message } from 'antd';
import classes from './Home.module.css';
import Modal from '../../components/Modal/Modal';
import ExerciseForm from './ExerciseForm/ExerciseFrom';
import AddButton from '../../components/AddButton/AddButton';
import SearchBar from './SearchBar/SearchBar';
import EmptyBox from '../../components/EmptyBox/EmptyBox';
import ExerciseCard from './ExerciseCard/ExerciseCard';
import {
  fetchExercises,
  addExercise,
  deleteExercise,
  editExercise,
} from '../../store/actions';

interface EditProps {
  name: string;
  category: string;
}

const Home: React.FC = () => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedKey, setSelectedKey] = useState<null | string>(null);
  const [show, setShow] = useState(false);
  const [formMode, setFormMode] = useState('Add');
  const { loading, exercises, fetched } = useSelector(
    (state: StoreState) => state.exercises
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchExercises());
    }
    window.scrollTo(0, 0);
  }, []);

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
      dispatch(deleteExercise(key, message));
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
      addExercise(
        { name, bodyP, prefs: { weight: 45, reps: 1, rest: 60 } },
        message
      )
    );
  };

  const handleEditSubmit = (values: any) => {
    if (!selectedKey) return;
    handleModalClose();
    const { name, category: bodyP } = values;
    dispatch(editExercise({ name, bodyP, key: selectedKey }, message));
    setSelectedKey(null);
  };

  const handleEntryClick = (key: string) => history.push(`/entry`, { key });

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
      <AddButton handleAddClick={handleAddClick} />
      {exercises.length === 0 ? (
        <EmptyBox placeholder="No Exercises" />
      ) : (
        <div className={classes.cards_container}>
          {renderExerciseCards()}
          {renderPhantoms()}
        </div>
      )}
    </div>
  );
};

export default Home;
