import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, FormControl, Card, Box,Typography,Snackbar, Alert } from '@mui/material';
import reasonOptions from '../static-data/Reason.json';
import typeOptions from '../static-data/Type.json';
import categoryOptions from '../static-data/Category.json';
import priorityOptions from '../static-data/Priority.json';
import divisionOptions from '../static-data/division.json';
import departmentOptions from '../static-data/department.json';
import locationOptions from '../static-data/location.json';
// import '../css/CreateProject.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const CreateProject = () => {
  const [project, setProject] = useState({
    theme: '',
    reason: '',
    type: '',
    category: '',
    priority: '',
    division: '',
    department: '',
    startDate: '',
    endDate: '',
    location: '',
    status:'Registered'
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? '' : prevErrors[name]
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!project.theme) formErrors.theme = 'Project Theme is required';
    if (!project.reason) formErrors.reason = 'Reason is required';
    if (!project.type) formErrors.type = 'Type is required';
    if (!project.category) formErrors.category = 'Category is required';
    if (!project.priority) formErrors.priority = 'Priority is required';
    if (!project.division) formErrors.division = 'Division is required';
    if (!project.department) formErrors.department = 'Department is required';
    if (!project.startDate) formErrors.startDate = 'Start Date is required';
    if (!project.endDate) formErrors.endDate = 'End Date is required';
    if (!project.location) formErrors.location = 'Location is required';

    if (project.startDate && project.endDate && new Date(project.endDate) < new Date(project.startDate)) {
      formErrors.endDate = 'End Date cannot be before Start Date';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.post('http://localhost:5000/createProject', project, {
          headers: {
            Authorization: token
          }
        });

        if (response.data.success === 'true') {
          setSnackbar({ open: true, message: response.data.message || 'Project Saved Successfully', severity: 'success' });
          setProject({
            theme: '',
            reason: '',
            type: '',
            category: '',
            priority: '',
            division: '',
            department: '',
            startDate: '',
            endDate: '',
            location: ''
          });
          // setTimeout(() => {
          //   navigate('/dashboard');  
          // }, 1000);
        
        } else {
          setSnackbar({ open: true, message: response.data.message || 'Error saving project.', severity: 'error' });

          console.log('Error saving project:', response.data.message);
        }
      } catch (error) {
        
        console.error('Error:', error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });  
  };

  const reset =()=>{
    setProject({
      theme: '',
      reason: '',
      type: '',
      category: '',
      priority: '',
      division: '',
      department: '',
      startDate: '',
      endDate: '',
      location: ''
    });
      
  }

  return (
    <Card style={{ padding: '20px',paddingBottom:'0px',paddingRight:'100px',maxWidth: '1200px', margin: '10px auto',borderRadius:'15px',}}>
    <form onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box flexGrow={1}>
          <TextField
            fullWidth
            variant="outlined"
            name="theme"
            value={project.theme}
            onChange={handleChange}
            error={!!errors.theme} 
            helperText={errors.theme}
            placeholder='Enter Project Theme'
            sx={{
              '.MuiOutlinedInput-root': {
                height: '80px', 
              },
              '.MuiInputBase-input': {
                height: '100%', 
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginLeft:'300px',borderRadius:'100px'}}
        >
          Save Project
        </Button>
      </Box>

      {/* Row 2: Reason, Type, Division */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box flex={1} mr={1}>
          <Typography variant="body1" align="left">Reason</Typography>
          <FormControl fullWidth error={ !!errors.reason}>
            <Select name="reason" value={project.reason} onChange={handleChange}>
              {reasonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            { errors.reason && (
              <Typography color="error">{errors.reason}</Typography>
            )}
          </FormControl>
        </Box>
        <Box flex={1} mx={1}>
          <Typography variant="body1" align="left">Type</Typography>
          <FormControl fullWidth error={!!errors.type}>
            <Select name="type" value={project.type} onChange={handleChange}>
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            { errors.type && (
              <Typography color="error">{errors.type}</Typography>
            )}
          </FormControl>
        </Box>
        <Box flex={1} ml={1}>
          <Typography variant="body1" align="left">Division</Typography>
          <FormControl fullWidth error={!!errors.division}>
            <Select name="division" value={project.division} onChange={handleChange}>
              {divisionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            { errors.division && (
              <Typography color="error">{errors.division}</Typography>
            )}
          </FormControl>
        </Box>
      </Box>

      {/* Row 3: Category, Priority, Department */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box flex={1} mr={1}>
          <Typography variant="body1" align="left">Category</Typography>
          <FormControl fullWidth error={ !!errors.category}>
            <Select name="category" value={project.category} onChange={handleChange}>
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography color="error">{errors.category}</Typography>
            )}
          </FormControl>
        </Box>
        <Box flex={1} mx={1}>
          <Typography variant="body1" align="left">Priority</Typography>
          <FormControl fullWidth error={ !!errors.priority}>
            <Select name="priority" value={project.priority} onChange={handleChange}>
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            { errors.priority && (
              <Typography color="error">{errors.priority}</Typography>
            )}
          </FormControl>
        </Box>
        <Box flex={1} ml={1}>
          <Typography variant="body1" align="left">Department</Typography>
          <FormControl fullWidth error={ !!errors.department}>
            <Select name="department" value={project.department} onChange={handleChange}>
              {departmentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <Typography color="error">{errors.department}</Typography>
            )}
          </FormControl>
        </Box>
      </Box>

      {/* Row 4: Start Date, End Date, Location */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box flex={1} mr={1}>
          <Typography variant="body1" align="left">Start Date</Typography>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            error={!!errors.startDate} 
            helperText={errors.startDate} 
          />
        </Box>

        <Box flex={1} mx={1}>
          <Typography variant="body1" align="left">End Date</Typography>
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
            error={!!errors.endDate} 
            helperText={errors.endDate} 
          />
        </Box>

        <Box flex={1} ml={1}>
          <Typography variant="body1" align="left">Location</Typography>
          <FormControl fullWidth error={!!errors.location}>
            <Select name="location" value={project.location} onChange={handleChange}>
              {locationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.location && (
              <Typography color="error">{errors.location}</Typography>
            )}
          </FormControl>
        </Box>
      </Box>
      <Box flex={1} ml={102}>
            <p>Status: <strong>Registered</strong></p>
          </Box>
          <Box flex={1} mb={100}>
          <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}  
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }} 
          sx={{ mb: 50 }}
          
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        </Box>
    </form>
    
  </Card>

  );
};

export default CreateProject;
