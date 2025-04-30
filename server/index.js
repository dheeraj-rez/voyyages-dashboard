const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/agents', async (req, res) => {
  try {
    const [agents] = await pool.query(`
      SELECT 
        a.*,
        COUNT(t.id) as tours_count
      FROM agents a
      LEFT JOIN tours t ON a.id = t.agent_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if agent with email already exists
    const [existingAgents] = await pool.query(
      'SELECT * FROM agents WHERE email = ?',
      [email]
    );

    if (existingAgents.length > 0) {
      return res.status(400).json({ error: 'An agent with this email already exists' });
    }

    // Insert new agent
    const [result] = await pool.query(
      'INSERT INTO agents (name, email, phone, status) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, 'pending']
    );

    const [newAgent] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newAgent[0]);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

app.patch('/api/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, rejectionReason } = req.body;

    // Check if agent exists
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [id]
    );

    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agents[0];

    // Update agent
    await pool.query(
      'UPDATE agents SET name = ?, email = ?, phone = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [
        name || agent.name,
        email || agent.email,
        phone || agent.phone,
        status || agent.status,
        id
      ]
    );

    // Get updated agent
    const [updatedAgents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [id]
    );

    res.json(updatedAgents[0]);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if agent exists
    const [agents] = await pool.query(
      'SELECT * FROM agents WHERE id = ?',
      [id]
    );

    if (agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Delete agent
    await pool.query('DELETE FROM agents WHERE id = ?', [id]);

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 