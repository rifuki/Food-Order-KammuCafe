import { useEffect, useState } from "react"
import { Container, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Masonry from "react-masonry-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmarkCircle, faMugHot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HeaderCustomerComponent, NavbarCustomerComponent } from "../../components/customer";
import { API_URL } from "../../utils";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [breakpoints, setBreakpoints] = useState({});

    useEffect(() => {
        getOrders();
    }, [orders]);

    const getOrders = async () => {
        let tempData = [];
        const customerData = await JSON.parse(localStorage.getItem("customerData"));
        const response = await axios.get(`${API_URL}orders/${customerData._id}`);
        if (response.data !== null) {
            tempData = [...response.data];
            tempData = (tempData.filter(data => {
                return data.isBayar === true;
            }))   
        }
        setOrders(tempData);
        if (tempData.length < 4) {
            await setBreakpoints({
                default: response.data.length,
                1100: 2,
                700: 1
            });
        }
        if (tempData.length >= 4) {
            await setBreakpoints({
                default: 3,
                1100: 2,
                700: 1
            });
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
                                            <h4 >Status Pesanan</h4>
                                            {order.isReady ? <FontAwesomeIcon icon={faCheckCircle} size="2x" color="green" /> : <FontAwesomeIcon icon={faXmarkCircle} size="2x" color="red" />}
                                            {order.isReady ? <p className="mt-3">Selesai Dimasak</p> : <p className="mt-3">Sedang Dimasak</p>}
                                            <p style={{ fontWeight: 500, fontSize: "16px" }}> Estiminasi : <strong>{order.estiminasi}</strong> Menit</p>
                                        </div>

                                        <ListGroup className="mb-3">
                                            {order.pesanan.map((pesanan) => {
                                                return (
                                                    <ListGroupItem key={pesanan._id} className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span>{pesanan.produk.nama}</span>
                                                        </div>
                                                        <span className="badge bg-dark rounded">{pesanan.jumlah}</span>
                                                    </ListGroupItem>
                                                )
                                            })}
                                        </ListGroup>
                                    </Container>
                                </Card>
                            })
                        }
                        <div className="gap-transaction">
                        </div>

                    </Masonry>)
                    :
                    <div className="d-flex flex-column text-white align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                        <FontAwesomeIcon icon={faMugHot} size="4x" className="my-2" />
                        <h2 className="my-2">Pesanan Kosong</h2>
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

export default OrderPage;