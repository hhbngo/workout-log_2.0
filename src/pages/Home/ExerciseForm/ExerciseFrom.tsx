import React from 'react';
import classes from './ExerciseForm.module.css';
import { Form, Input, Select, Button, FormInstance } from 'antd';

interface ExerciseFormProps {
  form: FormInstance;
  show: boolean;
  mode: string;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const BODY_CATEGORIES = [
  'Chest',
  'Back',
  'Arms',
  'Abdominals',
  'Legs',
  'Shoulders',
  'Compound',
];

const { Option } = Select;
const { Item } = Form;

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  form,
  show,
  mode,
  onSubmit,
  onClose,
}) => {
  return (
    <div className={`${classes.container} ${show ? classes.show : ''}`}>
      <h1>{mode} Exercise</h1>
      <Form
        form={form}
        onFinish={onSubmit}
        labelCol={{ span: 6 }}
        labelAlign="left"
      >
        <Item name="name" label="Exercise name" rules={[{ required: true }]}>
          <Input style={{ fontSize: '16px' }} />
        </Item>
        <Item name="category" label="Body part" rules={[{ required: true }]}>
          <Select style={{ fontSize: '16px' }}>
            {BODY_CATEGORIES.map((b) => (
              <Option key={b} value={b}>
                {b}
              </Option>
            ))}
          </Select>
        </Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
          }}
        >
          <Button
            type="primary"
            danger
            shape="round"
            style={{ width: '100px' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            shape="round"
            style={{ width: '100px' }}
            htmlType="submit"
          >
            {mode === 'Add' ? 'Add' : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ExerciseForm;
