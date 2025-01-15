"use client";
import Pulldown from "./pulldown";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const pullDropdownChange = (value: number) => {
    console.log("選択された値:", value);
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
      />
    </header>
  );
};

export default Header;
