import dayjs from "dayjs";

import React from "react";
import { navLinks, navIcons } from "#constants";
import useWindowStore from "../store/window";


const Navbar = () => {

  const {openWindow} = useWindowStore();

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" />
        <p className="font-bold">Saranga's Portfolio</p>
        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)} className="cursor-pointer hover:underline">
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
