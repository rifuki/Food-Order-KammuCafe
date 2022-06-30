import { useEffect, useState } from "react";
import { Container, Button, Modal, Form } from "react-bootstrap"
import Masonry from "react-masonry-css";
import axios from "axios";
import swal from "sweetalert";
import { HeaderCustomerComponent, NavbarCustomerComponent } from "../../components/customer";
import { DishCategoryComponent, DishMenuComponent } from "../../components/customer/home_page_components";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../utils";

const HomePage = () => {
    const search = useLocation().search;
    const [listMenus, setListMenus] = useState([]);
    const [choosedCategory, setChoosedCategory] = useState("Semua");

    const [tableMark, setTableMark] = useState(false);
    //modalBoxIsiDataPelanggan
    const [show, setShow] = useState(false);

    useEffect(() => {
        handleTable();
        (localStorage.getItem("customerData") === null ? setShow(true) : setShow(false));
        getProducts(choosedCategory);
    }, [choosedCategory]);

    //handle meja
    const handleTable = () => {
        const tableNumber = new URLSearchParams(search).get("table");
        if (tableNumber !== "" && tableNumber !== null) {
            setTableMark(true);
            setTableNumber(tableNumber);
            console.log(tableNumber);
            console.log(tableMark);
        }
        else {
            console.log("No Meja Kosong");
            setTableNumber("0");
        }
    };
    //menyimpanDataPelangganDiLocalStorage&Database
    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const saveUserInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}customer`, {
                nama: customerName,
                no_meja: tableNumber
            })
            const customerData = {
                _id: response.data._id,
                nama: response.data.nama,
                no_meja: response.data.no_meja
            }
            await localStorage.setItem("customerData", JSON.stringify(customerData));
            await localStorage.setItem("hello", response.data.nama);
            if (response.data) setShow(false);
        } catch (error) {
            console.log(error)
        }
    };

    //dapatkanListProduk/Menu
    const getProducts = async (value) => {
        try {
            if (value === "Semua" || value === null) {
                const response = await axios.get(`${API_URL}products`);
                setListMenus(response.data);
            }
            else {
                const response = await axios.get(`${API_URL}products/category?nama=${value}`);
                setListMenus(response.data);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    //gantiKategoriProduk
    const changeCategory = (value) => {
        setChoosedCategory(value);
        getProducts(value);
    };

    //masukkanKeKeranjang
    const insertToCart = (produk) => {
        const customerData = JSON.parse(localStorage.getItem("customerData"));
        //ambilDataKeranjangPelanggan
        axios
            .get(`${API_URL}cart/${customerData._id}/${produk._id}`)
            .then(res => {
                //jikaMasihKosongTambahkanProdukKeKeranjang
                if (res.data.length === 0) {
                    const cartData = {
                        pelanggan: customerData,
                        jumlah: 1,
                        produk: produk,
                        total_harga: produk.harga
                    }
                    axios
                        .post(`${API_URL}cart/`, cartData)
                        .then((res) => {
                            swal({
                                title: produk.nama,
                                text: "Sukses Masuk Keranjang",
                                icon: "success",
                                button: false,
                                timer: 2000
                            })
                        })
                        .catch((error) => {
                            console.log("error" + error);
                        })
                }
                //jikaProdukSudahMasukKeranjangEditTotalBayar
                else {
                    const cartData = {
                        jumlah: res.data[0].jumlah + 1,
                        produk: produk,
                        total_harga: res.data[0].total_harga + produk.harga
                    }
                    axios
                        .put(`${API_URL}cart/${res.data[0]._id}`, cartData)
                        .then(res => {
                            swal({
                                title: produk.nama,
                                text: "Ditambahkan lagi ke Keranjang",
                                icon: "success",
                                button: false,
                                timer: 2000
                            })
                        })
                        .catch((error) => {
                            console.log("error" + error);
                        })
                }
            });
    };

    const breakpoints = {
        default: 3,
        1100: 2,
        700: 1
    }

    return (
        <>
            {/* Header */}
            <HeaderCustomerComponent text={"Mau makan apa hari ini ?"} />
            {/* End Header */}

            {/* Main Content */}
            <main>
                <Container fluid>
                    <div className="mt-3 mb-5">
                        {/* Category Products */}
                        <DishCategoryComponent changeCategory={changeCategory} choosedCategory={choosedCategory} />
                        {/* End Category Products */}

                        {/* List Menu */}
                        <Masonry
                            breakpointCols={breakpoints}
                            className="row"
                        >
                            {listMenus && listMenus.map((listMenu) => {
                                return <DishMenuComponent
                                    key={listMenu._id}
                                    listMenu={listMenu}
                                    insertToCart={insertToCart} />
                            })}
                        </Masonry>
                        {/* End List Menu */}

                    </div>
                </Container>
            </main>
            {/* End Main Content */}

            {/* Navbar */}
            <NavbarCustomerComponent />
            {/* End Navbar */}

            {/* Modal */}
            <Modal show={show} backdrop="static" keyboard={false} centered>
                <Modal.Header >
                    <Modal.Title className="w-100 h-100 text-center" style={{ fontSize: "18px" }}>Selamat Datang di Website Pemesanan <strong>Kammu Cafe</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={saveUserInfo}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Masukkan Nama Anda</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setCustomerName(e.target.value)}
                                value={customerName}
                                autoFocus
                                required
                            />
                            <Form.Label>Masukkan No Meja</Form.Label>
                            {tableMark ? <Form.Control
                                type="number"
                                onChange={(e) => setTableNumber(e.target.value)}
                                value={tableNumber}
                                disabled
                            /> : <Form.Control
                                type="number"
                                min="0"
                                onChange={(e) => setTableNumber(e.target.value)}
                                value={tableNumber}
                            />}
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ width: "100%" }}>Simpan Nama</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* End Modal */}
        </>
    );
};

export default HomePage;