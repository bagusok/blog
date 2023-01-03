import { prismaOrm } from '../../../../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authentication } from '../../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Tidak Valid' });
  }

  const { username, password } = req.body;

  if (username?.length < 5 || password?.length < 6)
    res.status(400).json({ status: false, message: 'Silahkan Isi Input dengan Benar' });

  try {
    let checkUser = await prismaOrm.User.findUnique({
      where: {
        username,
      },
    });

    if (checkUser) {
      console.log('mulai', checkUser.password);
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      console.log(comparePassword);
      if (comparePassword) {
        const token = jwt.sign(
          {
            username,
            role: checkUser.role,
          },
          process.env.JWT_KEY,
          { expiresIn: '5d' }
        );
        return res.status(200).json({ status: true, message: 'Berhasil Login', token });
      } else {
        return res.status(401).json({ status: false, message: 'Password salah' });
      }
    }
    return res.status(401).json({ status: false, message: 'Username atau Password salah' });
  } catch (e) {
    console.log(e.message);
  }
}
