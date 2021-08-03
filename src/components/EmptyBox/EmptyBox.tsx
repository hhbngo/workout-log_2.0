import React from 'react';
import { Empty } from 'antd';

interface EmptyBoxProps {
  placeholder: string;
}

const EmptyBox: React.FC<EmptyBoxProps> = ({ placeholder }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 'calc(20vh - 40px)',
      }}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={placeholder} />
    </div>
  );
};

export default EmptyBox;
