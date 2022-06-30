import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Button } from "react-bootstrap"
import { API_URL, numberWithCommas } from "../../../utils";

const DishMenuComponent = (props) => {
    const { listMenu, insertToCart } = props;
    return (
        <Col md={12} className="mb-4">
            <Card className="shadow">
                <Card.Img variant="top" src={`${API_URL}images/${listMenu.gambar}`} />
                <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                        <Card.Title>{listMenu.nama}</Card.Title>
                        <Card.Text className="h5">
                            Rp. {numberWithCommas(listMenu.harga)}
                        </Card.Text>
                    </div>
                    <Button variant="dark" className="btn-order w-100 btn btn-dark d-flex justify-content-center align-items-center" onClick={() => insertToCart(listMenu)}><FontAwesomeIcon icon={faPlusCircle} /> &nbsp; Tambahkan ke keranjang</Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default DishMenuComponent;