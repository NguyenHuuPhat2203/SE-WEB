// scripts/migratePasswords.js
// Script to hash existing plain text passwords in the database
// Run this ONCE when migrating from plain text to hashed passwords

const { hashPassword } = require('../utils/password');

/**
 * This is a demo script showing how to migrate passwords.
 * In a real application with a database, you would:
 * 1. Read all users from the database
 * 2. Hash each plain text password
 * 3. Update the user records with hashed passwords
 */

function migratePasswords() {
  console.log('🔐 Password Migration Script');
  console.log('================================\n');
  
  // Example: Hash the demo passwords
  const demoPasswords = {
    'password': null,
    'student123': null,
    'tutor123': null,
  };
  
  console.log('Hashing demo passwords:\n');
  
  for (const plainPassword in demoPasswords) {
    const hashed = hashPassword(plainPassword);
    demoPasswords[plainPassword] = hashed;
    console.log(`✓ "${plainPassword}" -> ${hashed.substring(0, 40)}...`);
  }
  
  console.log('\n✅ Migration complete!');
  console.log('\nNote: In production, you would update these in your database.');
  console.log('For this demo app, manually update the passwords in userRepository.js\n');
  
  return demoPasswords;
}

// Run if called directly
if (require.main === module) {
  migratePasswords();
}

module.exports = { migratePasswords };
