import { Container } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";

const HeaderCustomerComponent = (props) => {
    const navigate = useNavigate();
    const user = localStorage.getItem("hello");

    //keUserProfile
    const profilePage = () => {
        navigate("/user/profile");
    }

    const { putih } = props;
    return (
        <Container fluid>
            <header className={putih ? "d-flex justify-content-between align-items-center text-white" : "d-flex justify-content-between align-items-center "}>
                <div className="d-flex flex-column">
                    <p className="my-1" style={{ fontSize: "19px", fontWeight: "normal" }}>Hai, <span style={{ fontSize: "22px", fontWeight: "800" }}>{user}</span></p>
                    <p style={{ fontSize: "17px", fontWeight: "normal", margin: "-7px 0" }}>{props.text}</p>
                </div>
                {/* <FontAwesomeIcon icon={faUserCircle} size="3x" className="mt-3" onClick={() => profilePage()} /> */}
                <div className="mt-3" onClick={() => profilePage()}>
                    <img src={Logo} width="60" alt="user" />
                </div>
            </header>
            <hr className={putih && "text-white"} />
        </Container>
    );
};

export default HeaderCustomerComponent;