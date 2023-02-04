import { prismaOrm } from '../lib/prisma';

export default function Tes({ navbar }) {
  console.log(navbar);

  const data = navbar;
  return (
    <>
      <div className="p-10 box-border">
        <ul className="flex flex-col gap-2">
          {data.map((a, b) => {
            return (
              <li key={b}>
                <span>{a.name}</span>
                <ul className="">
                  {a?.child?.map((c, d) => {
                    return (
                      <li key={d}>
                        <span>{c.name}</span>
                        <ul className="ml-6">
                          {c.child.map((e, f) => {
                            return (
                              <li key={f}>
                                <span>{e.name}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const navbar = await prismaOrm.NavbarCategory.findMany({
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
  });

  const newNavbar = navbar.map((a, i) => {
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

  console.log(newNavbar);

  return {
    props: {
      navbar: newNavbar,
    },
  };
}
