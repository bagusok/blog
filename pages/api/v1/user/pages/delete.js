import { Prisma } from '@prisma/client';
import { authentication } from '../../../../../lib/auth';
import { prismaOrm } from '../../../../../lib/prisma';
import { decodeJwt } from '../../../../../lib/decodeJwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, message: 'Method Tidak Valid' });
  }

  let auth = await authentication(req, res);

  if (!auth) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }

  let { username, role } = decodeJwt(req);

  console.log(role);

  if (role != 'ADMIN') return res.status(401).json({ status: false, message: 'You dont have permision' });

  try {
    const { pageId } = req.body;

    const checkUser = await prismaOrm.User.findFirst({
      where: {
        username: username,
      },
    });

    console.log(checkUser);
    if (!checkUser) {
      return res.status(401).json({
        status: false,
        message: 'User Not Found',
      });
    }

    const deletePost = await prismaOrm.Pages.delete({
      where: {
        id: Number(pageId),
      },
    });

    if (!deletePost) {
      return res.status(403).json({
        status: true,
        message: 'Delete Pages Failed',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Delete Pages Success',
      //   data: deletePost,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2025') {
        return res.status(404).json({
          status: false,
          message: 'Pages Not Found',
        });
      }
      return res.status(500).json({
        status: false,
        message: e,
      });
    }

    return res.status(500).json({ status: false, message: 'Error Bangsat' });
  }
}
