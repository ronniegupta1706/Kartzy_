import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({ email: 'admin@kartzy.com' }); // Clean any old entry

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
    name: 'Admin',
    email: 'admin@kartzy.com',
    password: 'admin123', // plain text; schema will hash it
    isAdmin: true,
});


    await adminUser.save();

    console.log('✅ Admin user created');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
