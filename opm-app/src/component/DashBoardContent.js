
import React, { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const Dashboard = () => {


    const [chartData, setChartData] = useState([]);
    const [projectCounts, setProjectCounts] = useState({
        totalProjects: 0,
        closedProjects: 0,
        runningProjects: 0,
        cancelledProjects: 0,
    });
    const [closureDelay, setClosureDelay] = useState(0);

    useEffect(() => {
        const fetchProjectCounts = async () => {
            try {
                const response = await fetch('http://localhost:5000/projectCounts');
                const data = await response.json();
                if (data.success) {
                    setProjectCounts(data.data);
                }
            } catch (error) {
                console.error('Error fetching project counts:', error);
            }
        };

        const fetchClosureDelay = async () => {
            try {
                const response = await fetch('http://localhost:5000/closureDelay');
                const data = await response.json();
                if (data.success) {
                    setClosureDelay(data.closureDelay);
                }
            } catch (error) {
                console.error('Error fetching closure delay:', error);
            }
        };

        fetchProjectCounts();
        fetchClosureDelay();
    }, []);
    useEffect(() => {
        const fetchDepartmentProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/departmentProjects');
                const data = await response.json();
                if (data.success) {
                    setChartData(data.data);
                }
            } catch (error) {
                console.error('Error fetching department project data:', error);
            }
        };

        fetchDepartmentProjects();
    }, []);

    const departments = chartData.map((d) => d.department);
    const totalProjects = chartData.map((d) => parseInt(d.totalProjects));
    const closedProjects = chartData.map((d) => parseInt(d.closedProjects));
    const successRates = chartData.map((d) => `${d.successRate}%`);

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Department wise - Total Vs Closed',
        },
        xAxis: {
            categories: departments,
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Projects',
            },
        },
        tooltip: {
            shared: true,
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,  
                    style: {
                        fontWeight: 'bold',
                    },
                    formatter: function() {
                        return this.y;  
                    },
                },
                pointWidth: 10,
                grouping: true,
                shadow: false,
                borderWidth: 0,
            },
        },
        series: [
            {
                name: 'Total',
                data: totalProjects,
                color: '#0071a7',
                dataLabels: {
                    enabled: true,  
                    style: {
                        color: 'black',
                    },
                },
            },
            {
                name: 'Closed',
                data: closedProjects,
                color: '#28a745',
                dataLabels: {
                    enabled: true,  
                    style: {
                        color: 'black',
                    },
                },
            },
        ],
        annotations: [{
            labels: successRates.map((rate, i) => ({
                point: {
                    x: i,
                    y: totalProjects[i],
                    xAxis: 0,
                    yAxis: 0,
                },
                text: `${rate}`,
            })),
        }],
    };
    return (
        <div>
                <div className="summary-cards">
                <div className="dashboard-card"><h5>Total Projects</h5><p> {projectCounts.totalProjects}</p></div>
                <div className="dashboard-card"><h5>Closed</h5><p> {projectCounts.closedProjects}</p></div>
                <div className="dashboard-card"><h5>Running</h5> <p>{projectCounts.runningProjects}</p></div>
                <div className="dashboard-card"><h5>Closure Delay</h5> <p>{closureDelay}</p></div>
                <div className="dashboard-card"><h5>Cancelled</h5> <p>{projectCounts.cancelledProjects}</p></div>
            </div>
            <div className="chart-container">

                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                
                />
            </div>
            </div>
    );
};

export default Dashboard;
