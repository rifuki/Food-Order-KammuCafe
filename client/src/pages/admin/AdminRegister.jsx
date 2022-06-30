import { useState, useEffect } from "react"
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import { API_URL } from "../../utils";

const AdminRegister = () => {
    const navigate = useNavigate("/");
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
                    navigate('/admin');
                }
            }
        }
        refreshToken()
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
    });

    //handleRegister
    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}admin/register/`, {
                username: username,
                password: password,
                confirmPassword: confirmPassword
            });
            navigate("/admin");
        }
        catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }} >
            <Card style={{ width: "18rem" }}>
                <Card.Body>
                    <Form onSubmit={Register}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex justify-content-center">
                            <Button type="submit" className="w-100">Daftar</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminRegister;