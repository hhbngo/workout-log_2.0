import React, { useState } from 'react';
import { FirebaseAuth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { authSuccess } from '../../store/actions';
import { Link } from 'react-router-dom';
import classes from './Login.module.css';

interface LoginFields {
  email: string;
  password: string;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

const Login: React.FC = () => {
  const [formFields, setFormFields] = useState<LoginFields>({
    email: '',
    password: '',
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
    setLoading(true);
    const { email, password } = formFields;
    FirebaseAuth.signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        setLoading(false);
        if (user) {
          dispatch(authSuccess(user));
        } else {
          setError('Something went wrong while authenticating');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Invalid login credentials');
      });
  };

  return (
    <div className={classes.container}>
      <form className={classes.form_area} onSubmit={handleSubmit}>
        {error && <div className={classes.error}>{error}</div>}
        <h1>Log In</h1>
        <label>Email</label>
        <input
          autoFocus
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
        <button className={classes.signin_btn} type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <Link style={{ float: 'right' }} to="/forgot_password">
          Forgot password?
        </Link>
        <p className={classes.register_block}>
          Not a member? <Link to="/register">Sign up now</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
