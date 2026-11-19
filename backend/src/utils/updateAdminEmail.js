const pool = require('../config/db');

async function updateAdminEmail() {
  try {
    const [result] = await pool.query(
      "UPDATE users SET email = 'admin@storeportal.com', name = 'System Administrator', address = 'Corporate HQ, Tech Park Road, Bengaluru' WHERE role = 'ADMIN'"
    );
    console.log('Admin email updated successfully to admin@storeportal.com! Rows affected:', result.affectedRows);
    const [users] = await pool.query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN'");
    console.log('Current Admin record:', users);
    process.exit(0);
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
}

updateAdminEmail();
