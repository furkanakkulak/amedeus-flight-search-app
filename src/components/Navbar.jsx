import Image from 'next/image';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav>
      <div className="logo-container">
        <Image
          src={logo}
          alt="logo"
          priority={true}
        />
      </div>
    </nav>
  );
};
export default Navbar;
