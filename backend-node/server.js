const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully!');
  }
});

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'MediBook Node API is running!' });
});

// ============ PATIENT ROUTES ============

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, created_at FROM patients ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: err.message });
  }
});

// Register Patient
app.post('/api/auth/register/patient', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO patients (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, hashedPassword, phone]
    );
    res.json({ success: true, patient: result.rows[0] });
  } catch (err) {
    console.error('Error registering patient:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login Patient
app.post('/api/auth/login/patient', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const patient = result.rows[0];
    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    res.json({ success: true, patient: { id: patient.id, name: patient.name, email: patient.email } });
  } catch (err) {
    console.error('Error logging in patient:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ DOCTOR ROUTES ============

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, specialization, created_at FROM doctors ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: err.message });
  }
});

// Register Doctor
app.post('/api/auth/register/doctor', async (req, res) => {
  const { name, email, password, phone, specialization } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO doctors (name, email, password, phone, specialization) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, specialization',
      [name, email, hashedPassword, phone, specialization || 'General']
    );
    res.json({ success: true, doctor: result.rows[0] });
  } catch (err) {
    console.error('Error registering doctor:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login Doctor
app.post('/api/auth/login/doctor', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const doctor = result.rows[0];
    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    res.json({ success: true, doctor: { id: doctor.id, name: doctor.name, email: doctor.email, specialization: doctor.specialization } });
  } catch (err) {
    console.error('Error logging in doctor:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ ADMIN ROUTES ============

// Register Admin
app.post('/api/auth/register/admin', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, hashedPassword, phone]
    );
    res.json({ success: true, admin: result.rows[0] });
  } catch (err) {
    console.error('Error registering admin:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login Admin
app.post('/api/auth/login/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    res.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error('Error logging in admin:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ APPOINTMENT ROUTES ============

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.appointment_date, 
        a.appointment_time, 
        a.status, 
        a.notes,
        p.name as patient_name, 
        p.phone as patient_phone,
        d.name as doctor_name, 
        d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create Appointment
app.post('/api/appointments', async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, doctor_id, appointment_date, appointment_time, notes]
    );
    res.json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get appointments by patient
app.get('/api/appointments/patient/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, d.name as doctor_name, d.specialization 
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get appointments by doctor
app.get('/api/appointments/doctor/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as patient_name, p.phone as patient_phone 
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update appointment status
app.put('/api/appointments/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MediBook Node API running on port ${PORT}`);
});