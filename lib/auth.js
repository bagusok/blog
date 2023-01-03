import jwt from 'jsonwebtoken';
import { prismaOrm } from './prisma';

export const authentication = async (req) => {
  if (!req.headers.authorization) {
    return false;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    try {
      const user = await prismaOrm.User.findFirst({
        where: {
          username: decoded.username,
          AND: {
            role: decoded.role,
          },
        },
      });

      if (!user) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  } catch (err) {
    return false;
  }
};

// export const authentication = async (req, res) => {
//   if (!req.headers.authorization) {
//     return false;
//   }

//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = await jose.UnsecuredJWT.decode(token, process.env.JWT_KEY);
//     console.log('inipay', decoded);

//     // try {
//     //   const user = await prismaOrm.User.findFirst({
//     //     where: {
//     //       username: payload.username,
//     //       AND: {
//     //         role: payload.role,
//     //       },
//     //     },
//     //   });

//     //   if (!user) {
//     //     return false;
//     //   }

//     //   return true;
//     // } catch (err) {
//     //   return false;
//     // }
//   } catch (err) {
//     console.log(err.message);
//     return false;
//   }
// };
