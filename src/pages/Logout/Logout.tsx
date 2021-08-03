import React, { useEffect } from 'react';
import { FirebaseAuth } from '../../firebase';

const Logout: React.FC = () => {
  useEffect(() => {
    FirebaseAuth.signOut();
  }, []);

  return null;
};

export default Logout;
