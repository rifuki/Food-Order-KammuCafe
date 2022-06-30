import { useEffect, useState } from "react";
import { Col, Accordion, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood, faCheese, faCoffee, faCubesStacked, faFish, faUtensils, faCookieBite } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../../../utils";

const Icon = ({ nama }) => {
    if (nama === "Makanan") return <FontAwesomeIcon icon={faBowlFood} className="mt-2" />
    if (nama === "Minuman") return <FontAwesomeIcon icon={faCoffee} className="mt-2" />
    if (nama === "Camilan") return <FontAwesomeIcon icon={faCheese} className="mt-2" />
    // if (nama === "Camilan") return <FontAwesomeIcon icon={faCookieBite} className="mt-2" />
    if (nama === "Seafood") return <FontAwesomeIcon icon={faFish} className="mt-2" />
    if (nama === "Lainnya") return <FontAwesomeIcon icon={faCubesStacked} className="mt-2" />
    return <FontAwesomeIcon icon={faUtensils} className="mt-2" />
}

function DishCategoryComponent(props) {
    const { changeCategory, choosedCategory } = props;
    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, [])

    //ambilKategori
    const getCategories = async () => {
        const response = await axios.get(`${API_URL}categories/`);
        await setListCategories(response.data);
    }

    return (
        <div className="dishCategory" >
            <Col md={12} mt="2" className="mb-3">
                <Accordion defaultActiveKey="" >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Daftar Kategori</Accordion.Header>
                        <Accordion.Body>
                            
                            <ListGroup style={{ borderRadius: "10px" }}>
                                {listCategories && listCategories.map((category) => {
                                    return (
                                        <ListGroup.Item key={category._id} onClick={() => changeCategory(category.nama)} className={choosedCategory === category.nama && "bg-dark text-white"} style={{ transition: "0.5s" }}>
                                            <h5 className="d-flex justify-content-evenly align-items-center">
                                                <Icon nama={category.nama} /> <span className="align-self-end">{category.nama}</span>
                                            </h5>
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </div>
    );
};

export default DishCategoryComponent;