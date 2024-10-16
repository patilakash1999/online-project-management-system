import React from 'react';
import Dashboard from '../Images/Dashboard.svg';
import DashboardActive from '../Images/Dashboard-active.svg';
import Projectlist from '../Images/Project-list.svg';
import ProjectListActive from '../Images/Project-list-active.svg'
import createProject from '../Images/create-project.svg';
import createProjectActive from '../Images/create-project-active.svg';
import Logout from '../Images/Logout.svg'
import '../css/sidebar.css'
import { useNavigate } from 'react-router-dom';

const Sidebar = ({activeMenu, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');

  navigate('/'); 
  };
  
  return (
    <div className="sidebar">
   <div 
        className="vertical-indicator" 
        style={{
          transform: `translateY(${(activeMenu === 'Dashboard' ? -3 : activeMenu === 'Project Listing' ? -1 : 1) * 30}px)`, 
          height: '40px',
          borderRadius: '20px', 
        }} 
      />
      <ul className="sidebar-menu">
        <li onClick={() => onMenuClick('Dashboard')} style={{marginTop:'100px'}}>
          <img
            src={activeMenu === 'Dashboard' ? DashboardActive : Dashboard}
            alt="Dashboard"
            className="sidebar-icon"
          />
        </li>
        <li onClick={() => onMenuClick('Project Listing')}>
          <img
            src={activeMenu === 'Project Listing' ? ProjectListActive : Projectlist}
            alt="Project Listing"
            className="sidebar-icon"
          />
        </li>
        <li onClick={() => onMenuClick('Create Project')} style={{marginBottom:'0px'}}>
          <img
            src={activeMenu === 'Create Project' ? createProjectActive : createProject}
            alt="Create Project"
            className="sidebar-icon"
          />
        </li>
        <li onClick={handleLogout} style={{marginTop:'120px'}}>
          <img
            src={activeMenu === 'Logout' ? Logout : Logout}
            alt="Logout"
            className="sidebar-icon"
          />
        </li>
      </ul>
      
    </div>
  );
};

export default Sidebar;
