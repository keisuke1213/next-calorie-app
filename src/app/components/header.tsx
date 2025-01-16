"use client";
import Pulldown from "./pulldown";
import { FC } from "react";

interface NavLink {
  href: string;
  label: string;
}

type HeaderProps = {
  weight: number;
  setWeight: (weight: number) => void;
  options: number[];
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Header: FC<HeaderProps> = ({ weight, setWeight, options }) => {
  const pullDropdownChange = (value: number) => {
    setWeight(value);
  };
  return (
    <header className="bg-[#EF7042] text-white pt-3 pb-0">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-5xl font-bold -ml-20 pl-10 ">CALOCOT</div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                {/* <Link href={link.href}>
                  <a className="hover:text-gray-300">{link.label}</a>
                </Link> */}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Pulldown
        onChange={pullDropdownChange}
        style={{ left: "500px", width: "50px" }}
        weight={weight}
        setWeight={setWeight}
        options = {options}
      />
    </header>
  );
};

export default Header;
