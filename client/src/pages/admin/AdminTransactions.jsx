import { useEffect, useState } from "react"
import { Container, Accordion, Card, Col, Button, Table, ListGroup, ListGroupItem } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/admin/NavbarAdminComponent";
import axios from "axios";
import swal from "sweetalert";
import jwtDecode from "jwt-decode";
import { API_URL, numberWithCommas } from "../../utils";
import Masonry from "react-masonry-css";

const AdminTransactions = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [pesanans, setPesanans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${API_URL}admin/token`);
        setToken(response.data.accessToken);
        const decoded = jwtDecode(token);
        setExpire(decoded.exp);
      }
      catch (error) {
        if (error.response) {
          navigate("/admin");
        }
      }
    }

    refreshToken();
    getOrders();
  }, [pesanans]);

  //dapatkan semua transaksi pelanggan
  const getOrders = async () => {
    const response = await axios.get(`${API_URL}orders/`);
    await setPesanans(response.data);
    await console.log(response);  
  }


  //verifyToken admin
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${API_URL}token`);
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  })

  //batalkan pesanan pelanggan
  const cancelOrder = async (nama_pelanggan, id_pesanan) => {
    try {
      swal({
        title: "Anda Yakin?",
        text: `Pesanan atas nama ${nama_pelanggan} akan dibatalkan`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            try {
              swal("Pesanan Berhasil Dibatalkan!", {
                icon: "warning",
                timer: 2000,
                button: false
              });
              await axios.delete(`${API_URL}orders/${id_pesanan}`)
              getOrders();
            }
            catch (error) {
              console.log(error.message);
            }
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  //konfirmasi pesanan pelanggan
  const confirmOrder = async (nama_pelanggan, id_pesanan) => {
    try {
      swal({
        title: "Anda Yakin?",
        text: `Harap konfirmasi kembali transaksi atas nama ${nama_pelanggan}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (successPaid) => {
          if (successPaid) {
            try {
              swal({
                title: "Sukses Dibayarkan",
                text: `Transaksi atas nama ${nama_pelanggan} sukses masuk database`,
                icon: "success",
                button: false,
                timer: 2000
              });
              await axios.put(`${API_URL}orders/${id_pesanan}`, {
                isBayar: true
              })
              getOrders();
            }
            catch (error) {
              console.log(error.message);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  //cetak faktur
  const getInvoice = (data) => {
    try {
      setLoading(true);
      axios.post(`${API_URL}orders/faktur`, {
        data_transaksi: data
      })
        .then((res) => {
          setLoading(false);

          if (res.status === 200) window.open(res.data, "_blank", "noopener, noreferrer");
        })
    } catch (error) {
      console.log(error);
    }
  }

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
  }

  return (
    <div className="bg-dark" style={{ minHeight: "100vh" }}>

      {/* Navbar */}
      <NavbarAdmin />
      {/* End Navbar */}

      <Container>

        <Accordion defaultActiveKey="0" className="d-flex align-items-center flex-column">

          {/* Title */}
          <div className="d-flex flex-column align-items-center">
            <h3 className="text-center text-white" style={{ marginTop: "60px" }}>Daftar Transaksi</h3>
            <div className="w-100 my-4 text-center" style={{ height: "2px", backgroundColor: "#FFF" }}></div>
          </div>
          {/* End Title */}

          {/* Not Paid Yet */}
          <Accordion.Item eventKey="0" className="w-100 bg-dark shadow">
            <Accordion.Header>Belum Bayar</Accordion.Header>
            <Accordion.Body>

              {pesanans.length !== 0 ?
                (
                  <Masonry
                    breakpointCols={breakpoints}
                    className="row"
                  >
                    {
                      pesanans.map((order) => {
                        if (order.isBayar === false) {
                          return (
                            <Col className="mb-4" key={order._id}>
                              <Card style={{ borderRadius: "10px" }} className="shadow my-2">
                                <Container>
                                  <Table className="mt-3 table-borderless">
                                    <tbody>
                                      <tr>
                                        <td>ID Transaksi</td>
                                        <td><p className="text-break">{order._id}</p></td>
                                      </tr>
                                      <tr>
                                        <td>Nama Pelanggan</td>
                                        <td>{order.pesanan[0].pelanggan.nama}</td>
                                      </tr>
                                      <tr>
                                        <td>No Meja</td>
                                        <td>{order.pesanan[0].pelanggan.no_meja}</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <ListGroup>
                                    {order.pesanan.map((item) => {
                                      return (
                                        <ListGroupItem key={item._id} className="d-flex justify-content-between align-items-center">
                                          {item.produk.nama}
                                          <span className="badge bg-primary rounded-pill">{item.jumlah}</span>
                                        </ListGroupItem>
                                      )
                                    })
                                    }
                                  </ListGroup>
                                  <div className="my-3" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p>Total Bayar : </p>
                                    <p>Rp. {numberWithCommas(order.total_bayar)}</p>
                                  </div>
                                  <div className="mb-3">
                                    <Button style={{ width: "100%" }} className="btn btn-danger my-1" onClick={() => cancelOrder(order.pesanan[0].pelanggan.nama, order._id)}>Batalkan Transaksi</Button>
                                    <Button style={{ width: "100%" }} className="btn btn-primary my-2" onClick={() => confirmOrder(order.pesanan[0].pelanggan.nama, order._id)}>Konfirmasi</Button>
                                  </div>
                                </Container>
                              </Card>
                            </Col>)
                        }
                      })
                    }
                  </Masonry>
                ) : <p className="text-white">Transaksi Kosong</p>}
            </Accordion.Body>
          </Accordion.Item>
          {/* End Not Paid Yet */}

          {/* Paid */}
          <Accordion.Item eventKey="1" className="my-5 w-100 bg-dark">
            <Accordion.Header>Sudah Bayar</Accordion.Header>
            <Accordion.Body>
              {pesanans.length !== 0 ?
                (
                  <Masonry
                    breakpointCols={breakpoints}
                    className="row"
                  >
                    {
                      pesanans.map((order) => {
                        if (order.isBayar === true) {
                          return (
                            <Col className="mb-4" key={order._id}>
                              <Card style={{ borderRadius: "10px" }} className="shadow my-2">
                                <Container>
                                  <Table className="mt-3 table-borderless">
                                    <tbody>
                                      <tr>
                                        <td>ID Transaksi</td>
                                        <td><p className="text-break">{order._id}</p></td>
                                      </tr>
                                      <tr>
                                        <td>Tanggal Order</td>
                                        <td>{new Date(order.tanggal_transaksi).toLocaleString()}</td>
                                      </tr>
                                      <tr>
                                        <td>Nama Pelanggan</td>
                                        <td>{order.pesanan[0].pelanggan.nama}</td>
                                      </tr>
                                      <tr>
                                        <td>No Meja</td>
                                        <td>{order.pesanan[0].pelanggan.no_meja}</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                  <ListGroup>
                                    {order.pesanan.map((item) => {
                                      return (
                                        <ListGroupItem key={item._id} className="d-flex justify-content-between align-items-center">
                                          {item.produk.nama}
                                          <span className="badge bg-primary rounded-pill">{item.jumlah}</span>
                                        </ListGroupItem>
                                      )
                                    })
                                    }
                                  </ListGroup>
                                  <div className="my-3" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p>Total Bayar : </p>
                                    <p>Rp. {numberWithCommas(order.total_bayar)}</p>
                                  </div>
                                  <div className="mb-3">
                                    {loading ? <button style={{ width: "100%" }} className="btn btn-info text-white">Sedang Loading...</button> : <button style={{ width: "100%" }} className="btn btn-success" onClick={() => getInvoice(order)}>Cetak Faktur</button>}
                                  </div>
                                </Container>
                              </Card>
                            </Col>)
                        }
                      })
                    }
                  </Masonry>
                ) : <p className="text-white">Transaksi Kosong</p>}
            </Accordion.Body>
          </Accordion.Item>
          {/* End Paid */}

        </Accordion>

      </Container>
    </div >
  );
};

export default AdminTransactions;;