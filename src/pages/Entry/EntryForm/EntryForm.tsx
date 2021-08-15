import React from 'react';
import classes from './EntryForm.module.css';
import { Form, Input, Button, FormInstance, Checkbox } from 'antd';

interface EntryFormProps {
  form: FormInstance;
  show: boolean;
  onSubmit: (values: any) => void;
  onClose: () => void;
  prefs: { weight: number; reps: number; rest: number };
  onSavePrefs: () => void;
  checked: boolean;
  onCheck: () => void;
}

const { Item } = Form;

const EntryForm: React.FC<EntryFormProps> = ({
  form,
  show,
  onSubmit,
  onClose,
  prefs,
  onSavePrefs,
  checked,
  onCheck,
}) => {
  return (
    <div className={`${classes.container} ${show ? classes.show : ''}`}>
      <h1>Add Set</h1>
      <Form form={form} onFinish={onSubmit} labelAlign="right">
        <div style={{ display: 'flex', marginBottom: '2px' }}>
          <Item
            name="weight"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            label="weight"
            initialValue={prefs.weight}
          >
            <Input type="number" style={{ fontSize: '16px' }} step={0.5} />
          </Item>
          <Item
            name="reps"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            initialValue={prefs.reps}
            label="reps"
            style={{ marginLeft: '8px', marginRight: '8px' }}
          >
            <Input type="number" style={{ fontSize: '16px' }} />
          </Item>
          <Item
            name="rest"
            rules={[{ required: true }]}
            wrapperCol={{ span: 12 }}
            initialValue={prefs.rest}
            label="rest (s)"
          >
            <Input type="number" style={{ fontSize: '16px' }} />
          </Item>
        </div>
        <Checkbox
          checked={checked}
          onChange={onCheck}
          style={{ marginBottom: checked ? '0px' : '15px' }}
        >
          Include note?
        </Checkbox>
        <Item
          name="notes"
          initialValue=""
          style={{ marginTop: '10px', display: checked ? 'block' : 'none' }}
        >
          <Input placeholder="Notes" style={{ fontSize: '16px' }} />
        </Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '4px',
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
