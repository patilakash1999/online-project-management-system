const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
app.use(bodyParser.json());

const jwtSecret = 'opm_jwt_secret_key';

app.use(cors()); 
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  db.query('CREATE DATABASE IF NOT EXISTS opm_db', (err) => {
    if (err) throw err;
    console.log('Database created or already exists.');

    db.changeUser({ database: 'opm_db' }, (err) => {
      if (err) throw err;
      console.log('Using opm_db database.');

      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `;
      db.query(createUsersTableQuery, (err) => {
        if (err) throw err;
        console.log('Users table created or already exists.');
      });
    });

    const createProjectsTableQuery = `
    CREATE TABLE IF NOT EXISTS createproject (
      id INT AUTO_INCREMENT PRIMARY KEY,
      theme VARCHAR(255) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      priority VARCHAR(255) NOT NULL,
      division VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      location VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL
    )
  `;
  db.query(createProjectsTableQuery, (err) => {
    if (err) throw err;
    console.log('createProject table created or already exists.');
  });
  });
});
//--------------------------------------------------------------------------------------------------------------------------------

const createUsers = async () => {
  const users = [
    { email: 'akashpatil5820@gmail.com', password: '123456' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [user.email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
      } else {
        console.log(`User ${user.email} added to the database.`);
      }
    });
  }
};

// Call the function to create users
createUsers();

//---------------------------------------------------------------------------------------------------------------------------

// Login 
app.post('/login', (req, res) => {
  const { email, Pass } = req.body;
  console.log('Email:', email); 
  console.log('Password:', Pass); 
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Success: 'False', Message: 'Server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      console.log('Results:', results);
      console.log('Fetched User:', user);
      const isMatch = await bcrypt.compare(Pass, user.password);
      if (isMatch) {
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        console.log('Password Match:', isMatch);
        return res.json({
          Success: 'true',
          Message: 'Valid User',
          Token: token  
        });
      }
    }

    return res.status(401).json({
      Success: 'False',
      Message: 'Invalid User'
    });
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

//---------------------------------------------------------------------------------------------------------------------
//Create Project
app.post('/createProject', (req, res) => {
  const { theme, reason, type, category, priority, division, department, startDate, endDate, location,status } = req.body;

  const sql = `
    INSERT INTO createproject (theme, reason, type, category, priority, division, department, startDate, endDate, location,status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  db.query(sql, [theme, reason, type, category, priority, division, department, startDate, endDate, location,status], (err, result) => {
    if (err) {
      console.error('Error inserting project:', err);
      return res.status(500).json({ success: 'false', message: 'Server error' });
    }
    res.status(200).json({ success: 'true', message: 'Project saved successfully!' });
  });
});

//-----------------------------------------------------------------------------------------------------------------------------

//Project  Total Counts (Status:closed,running,cancel)
app.get('/projectCounts', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS totalProjects,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closedProjects,
      SUM(CASE WHEN status = 'Running' THEN 1 ELSE 0 END) AS runningProjects,
      SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelledProjects
    FROM createproject
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching project counts:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({
      success: true,
      data: results[0],
    });
  });
});

//------------------------------------------------------------------------------------------------------------------------------------

//Closure Delay Count
app.get('/closureDelay', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; 
  const sql = `
    SELECT COUNT(*) AS closureDelay 
    FROM createproject 
    WHERE status = 'Running' AND endDate < ?
  `;

  db.query(sql, [today], (err, results) => {
    if (err) {
      console.error('Error fetching closure delay count:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({
      success: true,
      closureDelay: results[0].closureDelay,
    });
  });
});

//------------------------------------------------------------------------------------------------------------------------------------------

//Chart department wise

app.get('/departmentProjects', (req, res) => {
  const sql = `
    SELECT 
      department,
      COUNT(*) AS totalProjects,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closedProjects
    FROM createproject
    GROUP BY department
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching department project data:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const data = results.map((row) => ({
      department: row.department,
      totalProjects: row.totalProjects,
      closedProjects: row.closedProjects,
      successRate: ((row.closedProjects / row.totalProjects) * 100).toFixed(2),
    }));

    res.json({
      success: true,
      data,
    });
  });
});

//-------------------------------------------------------------------------------------------------------------------------


//all project list
app.get('/projects', (req, res) => {
  const { page = 1, search = '', sort = 'Priority' } = req.query;
  const recordsPerPage = 10;
  const offset = (page - 1) * recordsPerPage;
  
  const sql = `SELECT * FROM createproject WHERE theme LIKE ? OR reason LIKE ? OR type LIKE ? OR division LIKE ? OR category LIKE ? OR priority LIKE ? OR department LIKE ? OR location LIKE ? OR status LIKE ? ORDER BY ${sort} LIMIT ? OFFSET ?`;
  const searchTerm = `%${search}%`;
  
  db.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, recordsPerPage, offset], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Fetch total count for pagination
      db.query('SELECT COUNT(*) AS total FROM createproject WHERE theme LIKE ? OR reason LIKE ? OR type LIKE ? OR division LIKE ? OR category LIKE ? OR priority LIKE ? OR department LIKE ? OR location LIKE ? OR status LIKE ?', 
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, countResult) => {
          if (err) return res.status(500).json({ error: err.message });
          
          const totalRecords = countResult[0].total;
          const totalPages = Math.ceil(totalRecords / recordsPerPage);
          
          res.json({ projects: results, totalPages, totalRecords });
      });
  });
});


//--------------------------------------------------------------------------------------------------------------------
// Update project status
app.put('/projects/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.query('UPDATE createproject SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(204).send(); 
  });
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
