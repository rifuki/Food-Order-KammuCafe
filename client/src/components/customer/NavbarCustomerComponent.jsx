import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCartShopping,
  faNoteSticky,
  faMugHot,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const tabs = [
  {
    route: "/transaction",
    icon: faNoteSticky,
    label: "Transaksi",
  },
  {
    route: "/",
    icon: faHome,
    label: "Home",
  },
  {
    route: "/cart",
    icon: faCartShopping,
    label: "Keranjang",
  },
  {
    route: "/order",
    icon: faMugHot,
    label: "Pesanan",
  },
];

const NavbarCustomerComponent = () => {
  return (
    <Navbar bg="dark" fixed="bottom" variant="dark" style={{ height: "65px" }}>
      <Container>
        <Nav
          className="d-flex w-100"
          style={{ justifyContent: "space-between" }}
        >
          {tabs.map((tab, index) => {
            return (
              <Nav.Link key={index} as={Link} to={tab.route}>
                <div className="d-flex flex-column align-items-center">
                  <FontAwesomeIcon size="lg" icon={tab.icon} />
                  <div>{tab.label}</div>
                </div>
              </Nav.Link>
            );
          })}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarCustomerComponent;
