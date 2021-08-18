import React from 'react';
import classes from './EntryLabel.module.css';
import { RightOutlined } from '@ant-design/icons';

interface EntryLabelProps {
  handleEntryLabelClick: () => void;
  date: string;
  time: string;
}

const EntryLabel: React.FC<EntryLabelProps> = ({
  handleEntryLabelClick,
  date,
  time,
}) => {
  return (
    <div className={classes.entry_label} onClick={handleEntryLabelClick}>
      <p className={classes.date}>{date}</p>
      <p className={classes.time}>{time}</p>
      <RightOutlined />
    </div>
  );
};

export default EntryLabel;
