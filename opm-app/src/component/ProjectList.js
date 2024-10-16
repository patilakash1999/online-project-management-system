import React, { useEffect, useState } from 'react';
import '../css/ProjectList.css'; 

const ProjectListing = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('Priority');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        let formattedDate = date.toLocaleDateString('en-US', options);
        
        formattedDate = formattedDate.replace(/(\w{3}) (\d{2}), (\d{4})/, '$1-$2, $3');
        return formattedDate;
    };

    useEffect(() => {
        fetchProjects();
    }, [currentPage, searchTerm, sortField]);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`http://localhost:5000/projects?page=${currentPage}&limit=${recordsPerPage}&search=${searchTerm}&sort=${sortField}`);
            const data = await response.json();
            setProjects(data.projects);
            setTotalRecords(data.totalRecords);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:5000/projects/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchProjects();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

  

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortField(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust the start page if endPage hits totalPages limit
        if (endPage - startPage < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        const paginationButtons = [];

        // Previous arrows
        if (currentPage > 1) {
            paginationButtons.push(
                <button key="first" onClick={() => handlePageChange(1)}>&laquo;</button>,
                <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
            );
        }

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            paginationButtons.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Ellipsis if there are more pages
        if (endPage < totalPages) {
            paginationButtons.push(<span key="ellipsis">...</span>);
            paginationButtons.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            );
        }

        // Next arrows
        if (currentPage < totalPages) {
            paginationButtons.push(
                <button key="next" onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>,
                <button key="last" onClick={() => handlePageChange(totalPages)}>&raquo;</button>
            );
        }

        return paginationButtons;
    };

    

    return (
        <div className="project-listing-container">
            <div className="search-sort-container">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className="sort-container">
                <label htmlFor="sortDropdown" className="sort-label">Sort by: </label>
               <select className="sort-dropdown" value={sortField} onChange={handleSortChange}>
                    <option value="Priority">Priority</option>
                    <option value="Department">Department</option>
                    <option value="Location">Location</option>
                    <option value="Status">Status</option>
                </select>
                </div>
            </div>

            <table className="project-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Reason</th>
                        <th>Type</th>
                        <th>Division</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Dept.</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td><p style={{fontWeight:'bold',fontFamily:'sans-serif',fontSize:'15px'}}>{project.theme}</p><p style={{ color: 'gray', fontSize: '14px' }}>
                        {formatDate(project.startDate)} to {formatDate(project.endDate)}
                    </p></td>
                            <td>{project.reason}</td>
                            <td>{project.type}</td>
                            <td>{project.division}</td>
                            <td>{project.category}</td>
                            <td>{project.priority}</td>
                            <td>{project.department}</td>
                            <td>{project.location}</td>
                            <td>{project.status}</td>
                            <td>
                                <button onClick={() => updateStatus(project.id, 'Running')} className="action-button">Start</button>
                                <button onClick={() => updateStatus(project.id, 'Closed')} className="not-action-button">Close</button>
                                <button onClick={() => updateStatus(project.id, 'Cancelled')} className="not-action-button">Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
};

export default ProjectListing;
