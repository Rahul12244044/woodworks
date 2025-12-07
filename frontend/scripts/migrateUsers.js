import { connectDB } from '../lib/db';
import User from '../models/User';

const migrateUsers = async () => {
  try {
    await connectDB();
    console.log('🔄 Migrating users...');
    
    // Add active: true to all existing users
    const result = await User.updateMany(
      { active: { $exists: false } },
      { $set: { active: true } }
    );
    
    console.log(`✅ Migration complete. Updated ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();