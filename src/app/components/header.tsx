"use client";
import Pulldown from "./pulldown";
import { FC } from "react";
import { CSSProperties } from "react";
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
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-4 md:px-6">
        {/* Logo */}
        <div className="text-5xl md:text-5xl font-bold text-center md:text-left w-full md:w-auto">CALOCOT</div>
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
