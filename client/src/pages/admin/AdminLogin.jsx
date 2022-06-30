import { useState, useEffect } from 'react'
import { Container, Card, Form, Button } from "react-bootstrap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    useEffect( () => {
        const checkToken = async () => {
            const response = await axios.get(`${API_URL}admin/token`);
            if(response) navigate("/admin/transactions");
        }
        checkToken();
    }, []);

    const login = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}admin/login`, {
                username: username,
                password: password
            })
            navigate('/admin/transactions');
        }
        catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    return (
        <div className="bg-dark">
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }} >
                <Card style={{ width: '18rem', boxShadow: '0px 3px 30px rgba(0, 0, 0, 1)', borderRadius: '15px', background: 'rgba(33, 37, 41, 0.7)' }} className="text-white" >
                    <Card.Body>
                        <h3 className="text-center" style={{ fontWeight: "bold" }}>Kammu Cafe</h3>

                        <Form onSubmit={login}>
                            <p className="text-danger text-center" style={{ fontWeight: 800 }}>{msg}</p>

                            <Form.Group className="my-3 mt-4">
                                <Form.Control type="text" placeholder="username" onChange={(e) => {
                                    setUsername(e.target.value)
                                    setMsg("")
                                }} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control type="password" placeholder="password" onChange={(e) => {
                                    setPassword(e.target.value);
                                    setMsg("");
                                }} />
                            </Form.Group>

                            <Form.Group className="mt-4 mb-3 d-flex justify-content-center">
                                <Button type="submit" className="btn btn-danger w-100 shadow">LOGIN</Button>
                            </Form.Group>
                            <Form.Group className="mt-2 mb-2 text-center">
                                <a style={{ textDecoration: "none" }} href="/">Kembali ke halaman home</a>
                            </Form.Group>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminLogin;