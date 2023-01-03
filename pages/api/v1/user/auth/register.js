import { prismaOrm } from '../../../../../lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') res.status(405).json({ status: false, message: 'Method Tidak Valid' });

  const { username, email, password, full_name } = req.body;

  if (username?.length < 5 || !email?.includes('@') || password?.length < 6 || full_name?.length < 1) {
    return res.status(400).json({ status: false, message: 'Silahkan Isi Input dengan Benar' });
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);

  console.log(hashPassword);

  try {
    const createUser = await prismaOrm.User.create({
      data: {
        username,
        email,
        password: hashPassword,
        fullName: full_name,
      },
    });
    console.log(createUser);
    if (createUser) {
      return res.status(200).json({
        status: true,
        message: 'Sukses Daftar Akun',
      });
    }
  } catch (e) {
    console.log(e.message);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return res.status(403).json({
          status: false,
          message: 'Username Atau Email Telah Digunakan',
        });
      }
    }
    res.status(500).json({ status: false, message: 'Error Bang' });
  }
}
