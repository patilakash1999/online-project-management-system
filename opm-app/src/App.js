import './App.css';
import LoginPage from './component/login';
import Dashboard from './component/Dashboard';
import CreateProject from './component/CreateProject';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-project" element={<CreateProject/>}/>
      </Routes>
    </Router>
  );
}

export default App;
