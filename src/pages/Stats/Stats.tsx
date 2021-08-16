import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from '../../store/reducers';
import { Spin, Select, Radio, RadioChangeEvent } from 'antd';
import { fetchExercises } from '../../store/actions/exercises';
import {
  filterEntriesWithDateGap,
  parseEntriesTotalVolume,
  parseEntriesMaxWeight,
} from '../../util/exercises';
import classes from './Stats.module.css';

import VolumeChart from './VolumeChart';
import MaxChart from './MaxChart';
import EmptyBox from '../../components/EmptyBox/EmptyBox';

const { Option } = Select;

const Stats: React.FC = () => {
  const { exercises, fetched } = useSelector(
    (state: StoreState) => state.exercises
  );
  const [selectedKey, setSelectedKey] = useState<null | string>(null);
  const [dateMode, setDateMode] = useState(1);
  const [dataMode, setDataMode] = useState(1);
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
      const selectedExercise = exercises[exerciseIndex];
      if (selectedExercise.entries.length === 0) return undefined;
      const reorderedEntries =
        dateMode === 1
          ? selectedExercise.entries.slice(0, 31)
          : [...selectedExercise.entries];
      const filteredEntries = filterEntriesWithDateGap(
        reorderedEntries.reverse(),
        dateMode
      );
      return dataMode === 1
        ? parseEntriesTotalVolume(filteredEntries)
        : parseEntriesMaxWeight(filteredEntries);
    } else {
      return undefined;
    }
  }, [selectedKey, dateMode, dataMode, exercises]);

  const handleSelectionChange = (e: string) => setSelectedKey(e);

  const handleDateChange = (e: RadioChangeEvent) => setDateMode(e.target.value);

  const handleDataChange = (e: RadioChangeEvent) => setDataMode(e.target.value);

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
      {datasetForChart ? (
        <>
          <div className={classes.bottom_container}>
            <h2 className={classes.chart_label}>
              {dataMode === 1 ? 'Total Volume' : 'Max Weight'}
            </h2>
            <Radio.Group onChange={handleDataChange} defaultValue={1}>
              <Radio.Button value={1}>Volume</Radio.Button>
              <Radio.Button value={2}>Max</Radio.Button>
            </Radio.Group>
          </div>
          <div className={classes.chart_container}>
            {dataMode === 1 ? (
              <VolumeChart dataSet={datasetForChart} />
            ) : (
              <MaxChart dataSet={datasetForChart} />
            )}
          </div>
        </>
      ) : (
        <EmptyBox placeholder="No Data" />
      )}
    </div>
  ) : (
    <div className={classes.spinner_container}>
      <Spin size="large" />
    </div>
  );
};

export default Stats;
