import { useNavigate } from 'react-router-dom';

const Logout = () => {
  localStorage.removeItem('token');

  const navigate = useNavigate();
  navigate('/'); 
};

export default Logout;
