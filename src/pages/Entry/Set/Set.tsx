import React from 'react';
import { Set as S } from '../../../store/actions';
import { Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classes from './Set.module.css';

interface SetProps {
  index: number;
  set: S;
  time: string;
  onDeleteSet?: (key: string) => void;
}

const Set: React.FC<SetProps> = ({ index, set, time, onDeleteSet }) => {
  const { weight, reps, rest, notes, key } = set;

  const content = (
    <div className={classes.Pop_Container}>
      <p>
        <strong>Rest:</strong> {rest}s
      </p>
      {notes !== '' ? (
        <p>
          <strong>Notes:</strong>{' '}
          <span style={{ color: '#a0a0a0' }}>{notes}</span>
        </p>
      ) : null}
      <p
        style={{
          color: 'white',
          width: 'max-content',
          marginLeft: 'auto',
          marginTop: '6px',
          backgroundColor: 'black',
          padding: '0 5px 0',
          borderRadius: '2px',
        }}
      >
        {time}
      </p>
      {onDeleteSet && (
        <p className={classes.Pop_Delete} onClick={() => onDeleteSet(key)}>
          Delete
        </p>
      )}
    </div>
  );

  return (
    <div className={classes.container}>
      <div className={classes.Set_Block}>SET {index + 1}</div>
      <div className={classes.Set_Desc}>
        <div style={{ width: '64px', textAlign: 'center' }}>{weight}</div>
        <div style={{ width: '30px', textAlign: 'center', color: '#a0a0a0' }}>
          x
        </div>
        <div style={{ width: '40px', textAlign: 'center' }}>{reps}</div>
      </div>
      <Popover trigger="click" content={content} placement="left">
        <QuestionCircleOutlined className={classes.Q_Button} />
      </Popover>
    </div>
  );
};

export default Set;
