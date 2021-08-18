import React, { useState } from 'react';
import { FirebaseAuth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../store/actions';
import { Link } from 'react-router-dom';
import classes from '../Login/Login.module.css';

interface RegisterFields {
  email: string;
  password: string;
  confirmPassword: string;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

const Register: React.FC = () => {
  const [formFields, setFormFields] = useState<RegisterFields>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let dispatch = useDispatch();

  const handleInputChange = (e: InputEvent) => {
    if (error) setError(null);
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (error) setError(null);
    const { email, password, confirmPassword } = formFields;
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    FirebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        setLoading(false);
        if (user) {
          dispatch(authSuccess(user));
        } else {
          setError('Something went wrong while trying to sign up');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div style={{ paddingTop: 'clamp(50px, 20%, 160px)' }}>
      <form className={classes.form_area} onSubmit={handleSubmit}>
        {error && <div className={classes.error}>{error}</div>}
        <h1>Sign Up</h1>
        <label>Email</label>
        <input
          type="text"
          placeholder="Enter email"
          name="email"
          value={formFields.email}
          onChange={handleInputChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={formFields.password}
          onChange={handleInputChange}
          required
        />
        <label>Confirm password</label>
        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={formFields.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <button className={classes.signin_btn} type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className={classes.register_block}>
          Switch to <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
