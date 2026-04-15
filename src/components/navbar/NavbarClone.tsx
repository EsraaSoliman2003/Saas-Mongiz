import MobileNavbar from "./_components/mobileNavbar/MobileNavbar";
import NavBar from "./_components/desktopNavbar/NavBar";

const NavbarClone = ({ locale }: { locale: string }) => {
  
  return (
    <>
      {/* Desktop Navbar */}
      <NavBar locale={locale} />

      {/* Mobile Navbar */}
      <MobileNavbar locale={locale} />
    </>
  );
};

export default NavbarClone;
