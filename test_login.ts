import { loginUser } from './src/lib/auth.ts';

async function test() {
  try {
    const user = await loginUser('dave@gmail.com', '123456'); // Wait, I don't know the password
    console.log('User:', user);
  } catch (err) {
    console.error('Login error:', err);
  }
}
test();
