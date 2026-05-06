import dayjs from "dayjs";

import React from "react";
import { navLinks, navIcons } from "#constants";


const Navbar = () => {
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" />
        <p className="font-bold">Saranga's Portfolio</p>
        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id} className="hover:underline">
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {
            navIcons.map(({id, img}) => (
              <li key={id}>
                <img src={img} alt={`icon-${id}`} className="icon-hover" />
              </li>
            ))
          }
        </ul>

        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
