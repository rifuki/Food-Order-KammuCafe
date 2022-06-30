import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap"
import axios from "axios";
import { API_URL } from "../../../utils";

const ModalEditProduct = (props) => {
  const [_id, set_id] = useState("");
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState();
  const [kategori, setKategori] = useState("");
  const [gambar, setGambar] = useState("");
  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    //ambilDataProduk
    const valueFill = async () => {
      if(props.product){

        await set_id(props.product._id);
        await setNama(props.product.nama);
        await setHarga(props.product.harga);
        await setKategori(props.product.kategori);
        await setPreview(`${API_URL}images/${props.product.gambar}`);
      }
    }
    valueFill();
    getCategories();
  }, [props.product]);

  //ambilKategori
  const getCategories = async () => {
    const response = await axios.get(`${API_URL}categories`);
    const filterCategories = await response.data.filter((category) => {
      return category.nama !== "Semua";
    })
    await setCategories(filterCategories);
  }

  //kirimEditProduk
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("harga", harga);
    formData.append("kategori", kategori);
    formData.append("gambar", gambar);

    try {
      await axios.patch(`${API_URL}products/${_id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data"
        }
      });
      props.handleClose();
      props.getProducts();
    }
    catch (error) {
      console.log(error.message)
    }
  }

  //handleGambar
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    let newUrlImage = URL.createObjectURL(file);
    setGambar(file);
    setPreview(newUrlImage);
  }

  return (
    (_id && <Modal show={props.show} onHide={props.handleClose} fullscreen={"md-down"} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Produk</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Harga</Form.Label>
            <Form.Control type="number" value={harga} onChange={(e) => {
              setHarga(parseInt(e.target.value))
            }} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kategori</Form.Label>
            <Form.Select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              {categories && categories.map((category) => {
                return (<option key={category._id}value={category.nama}>{category.nama}</option>)
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <img
              src={preview}
              alt="previewImg"
              className="img-thumbnail w-100 mb-3"
            />
            <Form.Label htmlFor="formImage">Upload Gambar</Form.Label>
            <Form.Control type="file" onChange={handleUploadImage} accept="image/*" />
          </Form.Group>

          <Button type="submit" className="w-100 mt-3 mb-3">Simpan</Button>

        </Form>
      </Modal.Body>
    </Modal>)
  );
};

export default ModalEditProduct;