import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface DeleteButtonProps {
  handleDeleteClick: () => void;
  loading?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  handleDeleteClick,
  loading,
}) => {
  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
      <Button
        type="default"
        shape="circle"
        size="large"
        icon={<DeleteOutlined />}
        onClick={handleDeleteClick}
        loading={loading}
        disabled={loading}
      />
    </div>
  );
};

export default DeleteButton;
