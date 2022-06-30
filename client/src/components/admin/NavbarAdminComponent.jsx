import { Navbar, Nav, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/images/logo.svg";
import { API_URL } from '../../utils';

const NavbarAdminComponent = () => {

    //handleLogout
    const logout = async () => {
        try {
            const response = await axios.delete(`${API_URL}admin/logout`);
            if(response) window.location.href = "/admin";
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="/" className="text-center" style={{ fontWeight: 900 }}>
                    <img src={Logo} width="45" alt="logo"/>Kammu Cafe
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/admin/transactions">Transaksi</Nav.Link>
                        <Nav.Link as={Link} to="/admin/orders">Pesanan</Nav.Link>
                        <Nav.Link as={Link} to="/admin/products">Atur Produk</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link onClick={logout} className="text-danger d-flex align-items-center">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                           &nbsp; Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarAdminComponent;