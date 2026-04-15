import React from "react";
import NavbarClone from "./NavbarClone";
import { getLocale } from "next-intl/server";

const Navbar = async () => {
  const locale = await getLocale();
  return <NavbarClone locale={locale} />;
};

export default Navbar;
