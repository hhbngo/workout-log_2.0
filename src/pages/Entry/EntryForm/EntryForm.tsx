import React from 'react';
import classes from './EntryForm.module.css';
import { Form, Input, Button, FormInstance } from 'antd';

interface EntryFormProps {
  form: FormInstance;
  show: boolean;
  onSubmit: (values: any) => void;
  onClose: () => void;
  prefs: { weight: number; reps: number; rest: number };
  onSavePrefs: () => void;
}

const { Item } = Form;

const EntryForm: React.FC<EntryFormProps> = ({
  form,
  show,
  onSubmit,
  onClose,
  prefs,
  onSavePrefs,
}) => {
  return (
    <div className={`${classes.container} ${show ? classes.show : ''}`}>
      <h1>Add Set</h1>
      <Form form={form} onFinish={onSubmit} labelAlign="right">
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <Item
            name="weight"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            label="Weight"
            initialValue={prefs.weight}
          >
            <Input
              type="number"
              style={{ fontSize: '16px', textAlign: 'right' }}
            />
          </Item>
          <Item
            name="reps"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            initialValue={prefs.reps}
            label="Reps"
          >
            <Input
              type="number"
              style={{ fontSize: '16px', textAlign: 'right' }}
            />
          </Item>
          <Item
            name="rest"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            initialValue={prefs.rest}
            label="Rest (secs)"
          >
            <Input
              type="number"
              style={{ fontSize: '16px', textAlign: 'right' }}
            />
          </Item>
        </div>

        <Item name="notes" initialValue="">
          <Input placeholder="Notes" style={{ fontSize: '16px' }} />
        </Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px',
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
            Submit
          </Button>
        </div>
      </Form>
      <p className={classes.save_settings} onClick={onSavePrefs}>
        Save Settings
      </p>
    </div>
  );
};

export default EntryForm;
