import React from 'react';
import { Exercise } from '../../../store/actions';
import classes from './ExerciseCard.module.css';
import dayjs from 'dayjs';
import { Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

interface ExerciseCardProps {
  key: string;
  exercise: Exercise;
  onSwitchClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: (e: React.MouseEvent<HTMLElement>, key: string) => void;
  showingModal: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onSwitchClick,
  handleEditClick,
  handleDeleteClick,
  showingModal,
}) => {
  const { name, bodyP, key } = exercise;
  const entriesLength = exercise.entries.length;

  const stopPropagationHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={classes.container} onClick={onSwitchClick}>
      <div className={classes.top_label}>
        <Popover
          visible={showingModal ? false : undefined}
          placement="bottomRight"
          trigger="click"
          content={
            <div
              className={classes.pop_content}
              onClick={stopPropagationHandler}
            >
              <p onClick={handleEditClick}>Edit</p>
              <p onClick={(e) => handleDeleteClick(e, key)}>Delete</p>
            </div>
          }
        >
          <div className={classes.ellipses} onClick={stopPropagationHandler}>
            <EllipsisOutlined style={{ fontSize: '24px', margin: '0' }} />
          </div>
        </Popover>
        <p>{name}</p>
        <span>
          Last entry:{' '}
          {entriesLength > 0
            ? dayjs(exercise.entries[0].date).format('MM/DD/YY')
            : 'N/A'}
        </span>
      </div>
      <div className={classes.bottom_label}>
        <p>{bodyP}</p>
        <p>{entriesLength} entries</p>
      </div>
    </div>
  );
};

export default ExerciseCard;
