import { prismaOrm } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') res.status(405).json({ status: false, message: 'request tidak valid' });

  try {
    const sideBar = await prismaOrm.NavbarCategory.findMany({
      select: {
        name: true,
        menu: {
          select: {
            name: true,
            url: true,
            icon: true,
            navbarItemChild: {
              select: {
                name: true,
                url: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const newSidebar = sideBar.map((a, i) => {
      const newMenu = a.menu.map((b, j) => {
        const newNavbarItemChild = b.navbarItemChild.map((c, k) => {
          return {
            name: c.name,
            url: c.url,
          };
        });
        return {
          name: b.name,
          url: b.url,
          icon: b.icon,
          isOpen: false,
          child: newNavbarItemChild,
        };
      });
      return {
        name: a.name,
        child: newMenu,
      };
    });
    if (!sideBar) return res.status(400).json({ status: false, message: 'Menu does not exists' });

    return res.status(200).json({ status: true, data: newSidebar });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: false, message: 'error bang' });
  }
}
