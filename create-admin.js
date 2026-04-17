import crypto from 'crypto';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sacred_heart',
  port: process.env.DB_PORT || 5432,
});

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

async function createAdmin() {
  const email = 'shjp@admin.com';
  const password = 'SacredHeartJesusParish1997';
  const name = 'Sacred Heart Admin';
  
  try {
    // Hash the password
    const passwordHash = hashPassword(password);
    
    // Check if admin already exists
    const checkResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists. Updating...');
      // Update existing user to be admin
      await pool.query(
        'UPDATE users SET role = $1, is_verified = true WHERE email = $2',
        ['admin', email]
      );
      console.log('✅ Admin user updated successfully!');
      console.log(`Email: ${email}`);
      console.log(`Role: admin`);
      console.log(`Verified: true`);
    } else {
      console.log('Creating new admin user...');
      // Insert new admin user
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, phone, address, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id',
        [name, email, passwordHash, '', '', 'admin']
      );
      console.log('✅ Admin user created successfully!');
      console.log(`ID: ${result.rows[0].id}`);
      console.log(`Email: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Role: admin`);
      console.log(`Verified: true`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
