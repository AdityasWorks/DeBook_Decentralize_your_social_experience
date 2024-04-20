import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';
import logo from './logo.png';
import "./Navbar.css";

const Navbar = ({ account, web3Handler }) => {
  return (
    <BootstrapNavbar expand="lg" variant="dark" className="navbar">
      <div className="container-fluid"> {/* Update this line */}
        <div className="brand-container">
          <BootstrapNavbar.Brand href="http://www.github.com/AdityasWorks" className="brand">
            <img src={logo} width="40" height="40" className="logo" alt="" />
            Debook
          </BootstrapNavbar.Brand>
        </div>
        <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BootstrapNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-link">
              Profile
            </Nav.Link>
          </Nav>
          <Nav>
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button nav-button btn-sm mx-4"
              >
                <Button variant="outline-light" className="buttonn">
                  {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button onClick={web3Handler} variant="outline-light" className="connectwal">
                Connect Wallet
              </Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
