import { useEffect, useState } from "react";
import { ListGroup, Badge, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import swal from "sweetalert";
import { HeaderCustomerComponent, NavbarCustomerComponent } from "../../components/customer/";
import { API_URL, numberWithCommas } from "../../utils";

const CartPage = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [payTotal, setPayTotal] = useState("");
  const [payTotalString, setPayTotalString] = useState("");
  const customerData = JSON.parse(localStorage.getItem("customerData"));

  useEffect(() => {
    getCart();
  }, []);

  //pindahkan kerjanjang ke transaksi
  const submitPayTotal = async () => {
    const orders = {
      total_bayar: payTotal,
      pesanan: carts,
    };
    axios.post(`${API_URL}orders`, orders)
      .then(res => {
        swal({
          title: "Sukses",
          text: "Silahkan Lakukan Pembayaran pada Kasir",
          icon: "warning",
          button: false,
          timer: 2000
        })
          .then(() => {
            getCart();
            navigate("/transaction");
          });
      });
  };

  //ambil keranjang berdasarkan id pelanggan
  const getCart = async () => {
    const response = await axios.get(
      `${API_URL}cart?id_pelanggan=${customerData._id}`
    );
    setCarts(response.data);
    const total = response.data.reduce(function (result, item) {
      return parseInt(result) + parseInt(item.total_harga);
    }, 0);
    setPayTotal(total);
    setPayTotalString(numberWithCommas(total));
  };

  return (
    <div className="bg-dark text-white" style={{ minHeight: "100vh" }}>

      {/* Header */}
      <HeaderCustomerComponent text={`Nomor Meja : ${customerData.no_meja}`} />
      {/* End Header */}

      {/* Carts Content */}
      <Container fluid>
        {carts.length !== 0 ? (
          <>
            <ListGroup className="list-group-cart">
              {carts.map((cart) => {
                return (

                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-center"
                    key={cart._id}
                  >
                    {/* Left */}
                    <div className="d-flex align-items-center">
                      <Badge style={{ fontSize: "15px" }}>{cart.jumlah}</Badge>
                      <div className="mx-3">
                        <h6 className="my-1">{cart.produk.nama}</h6>
                        <p className="my-1">Rp. {numberWithCommas(cart.produk.harga)}</p>
                      </div>
                    </div>
                    {/* Right */}
                    <h6 className="align-middle my-1">Rp. {numberWithCommas(cart.total_harga)}</h6>
                  </ListGroup.Item>

                );
              })}
            </ListGroup>
            <div className="my-3 d-flex justify-content-between">
              <h5 className="my-1">Total Bayar</h5>
              <h5 className="my-1">Rp. {payTotalString}</h5>
            </div>
            <Button
              className="checkout w-100 bg-dark btn btn-primary"
              onClick={() => submitPayTotal()}
            >
              Bayar
            </Button>
          </>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "70vh" }}
          >
            <div className="d-flex flex-column text-center">
              <FontAwesomeIcon icon={faCartShopping} size="4x" className="my-2" />
              <h2 className="my-2">Keranjang Kosong</h2>
            </div>

          </div>
        )}
      </Container>
      {/* End Carts Content */}

      {/* Navbar */}
      <NavbarCustomerComponent />
      {/* End Navbar */}

    </div>
  );
};

export default CartPage;
