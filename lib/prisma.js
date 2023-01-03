import { PrismaClient } from '@prisma/client';

// let prismaOrm;
// // console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV == 'production') {
//   prismaOrm = new PrismaClient();
// } else {
//   global.prismaOrm = new PrismaClient();

//   prismaOrm = global.prismaOrm;
// }

const prismaOrm = global.prismaOrm || new PrismaClient({});

if (process.env.NODE_ENV !== 'production') global.prismaOrm = prismaOrm;

// console.log(global);

// console.log(prismaOrm);
// console.log(global.prisma);

export { prismaOrm };

//export const prismaOrm = new PrismaClient();
