import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Landing.module.css';
import {
  SmileOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const Landing: React.FC = () => {
  return (
    <div>
      <div className={classes.hero}>
        <div className={classes.content}>
          <div className={classes.hero_about}>
            <h1>Workout Tracking Made Easy</h1>
            <p>
              An intuitive web application to track workouts. Easily record and
              analyze your progress.
            </p>
            <p>
              <span>100% completely free!</span>
            </p>
            <Link to="/register">
              <button>Register Now</button>{' '}
            </Link>
          </div>
          <img
            src="https://i.imgur.com/8NJai9F.png"
            alt="mockup"
            className={classes.hero_mockup}
          />
        </div>
        <svg className={classes.waves} viewBox="0 0 1440 320">
          <path
            fill="white"
            fillOpacity="1"
            d="M0,32L30,69.3C60,107,120,181,180,224C240,267,300,277,360,272C420,267,480,245,540,213.3C600,181,660,139,720,128C780,117,840,139,900,133.3C960,128,1020,96,1080,117.3C1140,139,1200,213,1260,245.3C1320,277,1380,267,1410,261.3L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className={classes.features}>
        <div className={classes.fm_container}>
          <img
            src="https://i.imgur.com/MfI2CVn.png"
            alt="sets"
            className={classes.features_mockup}
          />
        </div>
        <div className={classes.tabs}>
          <div className={classes.card}>
            <SmileOutlined style={{ fontSize: '40px' }} />
            <div className={classes.description}>
              <h2>Simple</h2>
              <p>
                Zero clutter. Orgainzed, friendly, easy to understand
                user-interface.
              </p>
            </div>
          </div>
          <div className={classes.card}>
            <ThunderboltOutlined style={{ fontSize: '40px' }} />
            <div className={classes.description}>
              <h2>Light. Fast</h2>
              <p>Optimized to be lightweight and performant on every device.</p>
            </div>
          </div>
          <div className={classes.card}>
            <LineChartOutlined style={{ fontSize: '40px' }} />
            <div className={classes.description}>
              <h2>Easy analysis</h2>
              <p>
                Get the necessary data about your workouts to track your
                progress correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.footer}>
        <p>Created by Hieu Ngo.</p>
      </div>
    </div>
  );
};

export default Landing;
