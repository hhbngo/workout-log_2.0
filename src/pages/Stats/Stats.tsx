import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from '../../store/reducers';
import { Spin, Select, Radio, RadioChangeEvent } from 'antd';
import { fetchExercises } from '../../store/actions/exercises';
import {
  filterEntriesWithDateGap,
  parseEntriesForCharting,
} from '../../util/exercises';
import classes from './Stats.module.css';

import VolumeChart from './VolumeChart';
import EmptyBox from '../../components/EmptyBox/EmptyBox';

const { Option } = Select;

const Stats: React.FC = () => {
  const { exercises, fetched } = useSelector(
    (state: StoreState) => state.exercises
  );
  const [selectedKey, setSelectedKey] = useState<null | string>(null);
  const [dateMode, setDateMode] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!fetched) dispatch(fetchExercises());
  }, []);

  const statOptions = useMemo(() => {
    return exercises.map((ex, i) => (
      <Option key={i} value={ex.key}>
        {ex.name}
      </Option>
    ));
  }, [exercises]);

  const datasetForChart = useMemo(() => {
    if (selectedKey) {
      const exerciseIndex = exercises.findIndex((ex) => ex.key === selectedKey);
      const reorderedEntries = [...exercises[exerciseIndex].entries].reverse();
      const filteredEntries = filterEntriesWithDateGap(
        reorderedEntries,
        dateMode
      );
      return parseEntriesForCharting(filteredEntries);
    } else {
      return undefined;
    }
  }, [selectedKey, dateMode, exercises]);

  const handleSelectionChange = (e: string) => setSelectedKey(e);

  const handleDateChange = (e: RadioChangeEvent) => setDateMode(e.target.value);

  return fetched ? (
    <div className={classes.container}>
      <div className={classes.selection}>
        <Select
          onChange={handleSelectionChange}
          style={{ fontSize: '16px', maxWidth: '150px', minWidth: '150px' }}
          placeholder="Select exercise"
          dropdownMatchSelectWidth={100}
          maxTagTextLength={10}
        >
          {statOptions}
        </Select>
        <Radio.Group onChange={handleDateChange} defaultValue={1}>
          <Radio.Button value={1}>Day</Radio.Button>
          <Radio.Button value={7}>Week</Radio.Button>
          <Radio.Button value={30}>Mo.</Radio.Button>
        </Radio.Group>
      </div>
      {selectedKey ? (
        <>
          <h2 className={classes.chart_label}>Total Volume</h2>
          <div className={classes.chart_container}>
            <VolumeChart dataSet={datasetForChart} />
          </div>
        </>
      ) : (
        <EmptyBox placeholder="No Data (Select exercise)" />
      )}
    </div>
  ) : (
    <div className={classes.spinner_container}>
      <Spin size="large" />
    </div>
  );
};

export default Stats;
