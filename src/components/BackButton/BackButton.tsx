import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface BackButtonProps {
  handleBackClick: () => void;
  loading?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBackClick }) => {
  return (
    <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<LeftOutlined />}
        onClick={handleBackClick}
      />
    </div>
  );
};

export default BackButton;
