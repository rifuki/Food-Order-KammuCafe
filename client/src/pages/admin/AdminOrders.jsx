import { useEffect, useState } from "react";
import {
  Container,
  Accordion,
  Card,
  Col,
  Button,
  Table,
  ListGroup,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/admin/NavbarAdminComponent";
import axios from "axios";
import swal from "sweetalert";
import jwtDecode from "jwt-decode";
import { API_URL, numberWithCommas } from "../../utils";
import Masonry from "react-masonry-css";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [pesanans, setPesanans] = useState([]);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${API_URL}admin/token`);
        setToken(response.data.accessToken);
        const decoded = jwtDecode(token);
        setExpire(decoded.exp);
      } catch (error) {
        if (error.response) {
          navigate("/admin");
        }
      }
    };

    refreshToken();
    console.log(pesanans);
    getOrders();
  }, [pesanans]);

  //dapatkan semua transaksi pelanggan
  const getOrders = async () => {
    let tempData = [];
    const response = await axios.get(`${API_URL}orders/`);
    if (response.data !== null) {
      tempData = [...response.data];
      tempData = tempData.filter((data) => {
        return data.isBayar === true;
      });
      await setPesanans(tempData);
    }
  };

  //verifyToken admin
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(`${API_URL}token`);
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //batalkan pesanan pelanggan
  const cancelOrder = async (nama_pelanggan, id_pesanan) => {
    try {
      swal({
        title: "Anda Yakin?",
        text: `Pesanan atas nama ${nama_pelanggan} akan dibatalkan`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            swal("Pesanan Berhasil Dibatalkan!", {
              icon: "warning",
              timer: 2000,
              button: false,
            });
            await axios.delete(`${API_URL}orders/${id_pesanan}`);
            getOrders();
          } catch (error) {
            console.log(error.message);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //konfirmasi pesanan pelanggan
  const confirmOrder = async (nama_pelanggan, id_pesanan) => {
    try {
      swal({
        title: "Anda Yakin?",
        text: `Harap konfirmasi kembali pesanan atas nama ${nama_pelanggan}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (successPaid) => {
        if (successPaid) {
          try {
            swal({
              title: "Sukses",
              text: `Pesanan atas nama ${nama_pelanggan} siap disajikan`,
              icon: "success",
              button: false,
              timer: 2000,
            });
            await axios.put(`${API_URL}orders/order/${id_pesanan}`, {
              isReady: true,
            });
          } catch (error) {
            console.log(error.message);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <NavbarAdmin />
      {/* End Navbar */}

      <Container>
        <Accordion
          defaultActiveKey="0"
          className="d-flex align-items-center flex-column"
        >
          {/* Title */}
          <div className="d-flex flex-column align-items-center">
            <h3
              className="text-center text-white"
              style={{ marginTop: "60px" }}
            >
              Daftar Pesanan
            </h3>
            <div
              className="w-100 my-4 text-center"
              style={{ height: "2px", backgroundColor: "#FFF" }}
            ></div>
          </div>
          {/* End Title */}

          {/* Not Paid Yet */}
          <Accordion.Item eventKey="0" className="w-100 bg-dark shadow">
            <Accordion.Header>Belum Selesai</Accordion.Header>
            <Accordion.Body>
              {pesanans.length !== 0 ? (
                <Masonry breakpointCols={breakpoints} className="row">
                  {pesanans.map((order) => {
                    if (order.isReady === false) {
                      return (
                        <Col className="mb-4" key={order._id}>
                          <Card
                            style={{ borderRadius: "10px" }}
                            className="shadow my-2"
                          >
                            <Container>
                              <Table className="mt-3 table-borderless">
                                <tbody>
                                  <tr>
                                    <td>ID Transaksi</td>
                                    <td>
                                      <p className="text-break">{order._id}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Tanggal Order</td>
                                    <td>
                                      {new Date(
                                        order.tanggal_bayar
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Nama Pelanggan</td>
                                    <td>{order.pesanan[0].pelanggan.nama}</td>
                                  </tr>
                                  <tr>
                                    <td>No Meja</td>
                                    <td>
                                      {order.pesanan[0].pelanggan.no_meja}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <ListGroup>
                                {order.pesanan.map((item) => {
                                  return (
                                    <ListGroupItem
                                      key={item._id}
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      {item.produk.nama}
                                      <span className="badge bg-primary rounded-pill">
                                        {item.jumlah}
                                      </span>
                                    </ListGroupItem>
                                  );
                                })}
                              </ListGroup>
                              <div
                                className="my-3"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p>Total Bayar : </p>
                                <p>Rp. {numberWithCommas(order.total_bayar)}</p>
                              </div>
                              <div className="mb-3">
                                <Button
                                  style={{ width: "100%" }}
                                  className="btn btn-danger my-1"
                                  onClick={() =>
                                    cancelOrder(
                                      order.pesanan[0].pelanggan.nama,
                                      order._id
                                    )
                                  }
                                >
                                  Batalkan Pesanan
                                </Button>
                                <Form.Group className="row my-3 align-items-center justify-content-around">
                                  Estiminasi &nbsp; :
                                  <Form.Control
                                    className="w-50"
                                    type="text"
                                    onChange={(e) => {
                                      axios.put(
                                        `${API_URL}orders/order/${order._id}`,
                                        {
                                          estiminasi: parseInt(e.target.value),
                                        }
                                      );
                                    }}
                                  />
                                  Menit
                                </Form.Group>
                                <Button
                                  style={{ width: "100%" }}
                                  className="btn btn-success my-2"
                                  onClick={() =>
                                    confirmOrder(
                                      order.pesanan[0].pelanggan.nama,
                                      order._id
                                    )
                                  }
                                >
                                  Konfirmasi
                                </Button>
                              </div>
                            </Container>
                          </Card>
                        </Col>
                      );
                    }
                  })}
                </Masonry>
              ) : (
                <p className="text-white">Pesanan Kosong</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
          {/* End Not Paid Yet */}

          {/* Paid */}
          <Accordion.Item eventKey="1" className="my-5 w-100 bg-dark">
            <Accordion.Header>Sudah Selesai</Accordion.Header>
            <Accordion.Body>
              {pesanans.length !== 0 ? (
                <Masonry breakpointCols={breakpoints} className="row">
                  {pesanans.map((order) => {
                    if (order.isReady === true) {
                      return (
                        <Col className="mb-4" key={order._id}>
                          <Card
                            style={{ borderRadius: "10px" }}
                            className="shadow my-2"
                          >
                            <Container>
                              <Table className="mt-3 table-borderless">
                                <tbody>
                                  <tr>
                                    <td>ID Transaksi</td>
                                    <td>
                                      <p className="text-break">{order._id}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Tanggal Order</td>
                                    <td>
                                      {new Date(
                                        order.tanggal_transaksi
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Nama Pelanggan</td>
                                    <td>{order.pesanan[0].pelanggan.nama}</td>
                                  </tr>
                                  <tr>
                                    <td>No Meja</td>
                                    <td>
                                      {order.pesanan[0].pelanggan.no_meja}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <ListGroup>
                                {order.pesanan.map((item) => {
                                  return (
                                    <ListGroupItem
                                      key={item._id}
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      {item.produk.nama}
                                      <span className="badge bg-primary rounded-pill">
                                        {item.jumlah}
                                      </span>
                                    </ListGroupItem>
                                  );
                                })}
                              </ListGroup>
                              <div
                                className="my-3"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p>Total Bayar : </p>
                                <p>Rp. {numberWithCommas(order.total_bayar)}</p>
                              </div>
                              <div className="mb-3"></div>
                            </Container>
                          </Card>
                        </Col>
                      );
                    }
                  })}
                </Masonry>
              ) : (
                <p className="text-white">Pesanan Kosong</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
          {/* End Paid */}
        </Accordion>
      </Container>
    </div>
  );
};

export default AdminOrders;
