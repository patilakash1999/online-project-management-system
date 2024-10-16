
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../css/Dashboard.css'; 
import { useNavigate } from 'react-router-dom';
import logo from '../Images/Logo.svg';
import Sidebar from './Sidebar';
import CreateProject from './CreateProject'
import DashBoardContent from './DashBoardContent'
import ProjectList from './ProjectList'
const Dashboard = () => {
    
    const [activeMenu, setActiveMenu] = useState('Dashboard'); 
const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
    }
  }, [navigate]); 


    

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);
    };

    const handleBackToDashboard = () => {
        setActiveMenu('Dashboard');
    };
    const renderContent = () => {
        switch (activeMenu) {
            case 'Dashboard':
                return <DashBoardContent/>

            case 'Project Listing':

              return <ProjectList/> 

            case 'Create Project':
                return <CreateProject/>
          
            default:
                break;

        }
    };

    return (
      <div className="dashboard-layout">
            <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
        <div className="dashboard-container">
          <div className="dashboard-header">
          {activeMenu !== 'Dashboard' && (
                        <span 
                            onClick={handleBackToDashboard} 
                            style={{ 
                                cursor: 'pointer', 
                                fontSize: '24px', 
                                marginRight: '12px',
                                fontWeight:800, 
                            }}>
                            &lt; 
                        </span>
                    )}
                <h3>{activeMenu}</h3>
                <img src={logo} alt="Logo" className="dashboard-logo-image" />
            </div>
            {renderContent()} 
        </div>
        </div>
    );
};

export default Dashboard;
