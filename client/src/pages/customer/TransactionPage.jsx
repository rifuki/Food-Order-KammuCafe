import { useEffect, useState } from "react"
import { Container, Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import Masonry from "react-masonry-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmarkCircle, faReceipt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import swal from "sweetalert";
import { HeaderCustomerComponent, NavbarCustomerComponent } from "../../components/customer";
import { API_URL, numberWithCommas } from "../../utils";

const TransactionPage = () => {
    const [orders, setOrders] = useState([]);
    const [breakpoints, setBreakpoints] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getOrders();
    }, [orders]);

    const getOrders = async () => {
        const customerData = await JSON.parse(localStorage.getItem("customerData"));
        const response = await axios.get(`${API_URL}orders/${customerData._id}`);
        if (response.data !== null) await setOrders(response.data);
        if (response.data.length < 4) {
            await setBreakpoints({
                default: response.data.length,
                1100: 2,
                700: 1
            });
        }
        if (response.data.length >= 4) {
            await setBreakpoints({
                default: 3,
                1100: 2,
                700: 1
            });
        }
    }

    //batalkan pesanan/transaksi
    const deleteOrder = async (id) => {
        swal({
            title: "Anda Yakin?",
            text: "^ ω ^",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        swal("Pesanan Berhasil Dibatalkan!", {
                            icon: "warning",
                            timer: 5000,
                            button: false
                        });
                        await axios.delete(`${API_URL}orders/${id}`)
                        getOrders();
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }
            })
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

    return (
        <div className="bg-dark" style={{ minHeight: "100vh" }}>
            {/* Header */}
            <HeaderCustomerComponent text={new Date().toLocaleString()} putih={true} />
            {/* End Header */}

            <Container fluid style={{ minHeight: "80vh" }}>

                {orders.length !== 0 ?
                    (<Masonry
                        breakpointCols={breakpoints}
                        className="row"
                    >
                        {
                            orders.map((order) => {
                                return <Card className="shadow mb-4" key={order._id}>
                                    <Container fluid>
                                        <div className="text-center mt-2">
                                            <h4 >Status Transaksi</h4>
                                            <p style={{ fontWeight: 900, fontSize: "18px" }}> Rp. {numberWithCommas(order.total_bayar)}</p>
                                            {order.isBayar ? <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" /> : <FontAwesomeIcon icon={faXmarkCircle} size="2x" color="red" />}
                                            {order.isBayar ? <p className="mt-3">Sudah Dibayar</p> : <p className="mt-3">Belum Dibayar</p>}
                                        </div>

                                        <ListGroup>
                                            {order.pesanan.map((pesanan) => {
                                                return (
                                                    <ListGroupItem key={pesanan._id} className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span>{pesanan.produk.nama}</span>
                                                            <br />
                                                            {`1x Rp.${numberWithCommas(pesanan.produk.harga)} --> `}
                                                            {`Rp.${numberWithCommas(pesanan.total_harga)}`}
                                                        </div>
                                                        <span className="badge bg-dark rounded-pill">{pesanan.jumlah}</span>
                                                    </ListGroupItem>
                                                )
                                            })}
                                        </ListGroup>
                                        <div className="my-3">
                                            {loading && order.isBayar ? <button className="btn btn-dark text-white w-100 mb-1">Sedang Loading...</button> : <></>}
                                            {order.isBayar ? <button style={{ width: "100%" }} className="btn btn-success" onClick={() => getInvoice(order)}>Cetak Faktur</button> : <Button className="btn btn-danger w-100 my-3" onClick={() => deleteOrder(order._id)}>Batalkan Pesanan</Button>}
                                        </div>
                                    </Container>
                                </Card>
                            })
                        }
                        <div className="gap-transaction">
                        </div>

                    </Masonry>)
                    :
                    <div className="d-flex flex-column text-white align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                        <FontAwesomeIcon icon={faReceipt} size="4x" className="my-2" />
                        <h2 className="my-2">Transaksi Kosong</h2>
                    </div>
                }

                {/* </div> */}
            </Container>

            {/* Navbar */}
            <NavbarCustomerComponent />
            {/* End Navbar */}
        </div>
    );
};

export default TransactionPage;