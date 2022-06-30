import { useCallback, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ModalAddProductComponent, ModalEditProductComponent } from "../../components/admin/admin_product_components";
import axios from "axios";
import swal from "sweetalert";
import jwtDecode from 'jwt-decode';
import NavbarAdmin from "../../components/admin/NavbarAdminComponent";
import { API_URL, numberWithCommas } from "../../utils";

const AdminProducts = () => {
  const navigate = useNavigate();
  // const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  const [products, setProducts] = useState("");

  //Modal Box
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState();
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (product) => {
    setShowEdit(true);
    setEditProduct(product);
  }
  //End Modal Box

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await axios.get(`${API_URL}admin/token`);
        setToken(response.data.accessToken);
        const decoded = jwtDecode(token);
        // setName(decoded.username);
        setExpire(decoded.exp);
      }
      catch (error) {
        if (error.response) {
          navigate('/admin');
        }
      }
    }
    refreshToken()
    getProducts();
  }, []);

  //tokenHandle
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

  //ambilProduk
  const getProducts = useCallback(async () => {
    try {
      await axios.get(API_URL + "products/")
        .then(res => setProducts(res.data));
    }
    catch (error) {
      console.log(error.message);
    }
  }, []);

  //hapusProduk
  const deleteProduct = async (id) => {
    swal({
      title: "Anda Yakin?",
      // text: "Once deleted, you wil not be able to recover this imanginary file!",
      text: "^ ω ^",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          try {
            await axios.delete(API_URL + "products/" + id)
            swal("Produk Berhasil dihapus!", {
              icon: "success",
              timer: 3000,
              button: false
            });
            getProducts();
          }
          catch (error) {
            console.log(error.message);
          }
        }
      });
  };

  return (
    <div className='bg-dark text-white' style={{ minHeight: '100vh' }}>
      
      {/* Navbar */}
      <NavbarAdmin />
      {/* End Navbar */}

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12 text-center">

            <h3 className="my-3">Produk List</h3>
            <Button className="w-100 my-2" onClick={handleShowAdd}>Tambah Produk</Button>

            <Table bordered hover className="table-dark text-center my-3 align-middle text-white table-hover mb-5">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gambar</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {(!products) ? (<tr>
                  <td>
                    Sedang Loading...
                  </td>
                </tr>) :
                  products && products.map((product, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>
                        <img src={API_URL + "images/" + product.gambar} alt="gambarProduk" className="img-thumbnail" style={{ width: "500px", marginRight: -100, marginLeft: -100 }} />
                      </td>
                      <td>{product.nama}</td>
                      <td>Rp. {numberWithCommas(product.harga)}</td>
                      <td>{product.kategori}</td>
                      <td>
                        <Button className="btn btn-primary" onClick={() => handleShowEdit(product)}>Edit</Button>
                        &emsp;
                        <Button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>Hapus</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>

          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalEditProductComponent show={showEdit} handleClose={handleCloseEdit} product={editProduct} getProducts={getProducts} />
      <ModalAddProductComponent show={showAdd} handleClose={handleCloseAdd} getProducts={getProducts} />
      {/* EndModal */}

    </div>
  );
};

export default AdminProducts;