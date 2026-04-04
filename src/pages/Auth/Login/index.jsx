import { Form, Input, Button, Card, Row, Col, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/Auth";

const { Title, Text } = Typography;

const initialState = { email: "", password: "" };

const Login = () => {
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const { readProfile } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => { setState(prev => ({ ...prev, [e.target.name]: e.target.value })) };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        const { email, password } = state;

        if (!email) return window.toastify("Please enter your email", "error");
        if (!password) return window.toastify("Please enter your password", "error");

        setIsProcessing(true);

        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", { email, password });
            if (res.status === 200) {
                localStorage.setItem("jwt", res.data.token);
                window.toastify(res.data.message || "Login successful", "success");

                setState(initialState);
                readProfile(res.data.token);
                navigate("/");
            }
        }
        catch (err) {
            if (err.response) window.toastify(err.response.data.message, "error");
            else window.toastify("Server not responding", "error");
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "20px" }}>

            <div className="container">

                <Row justify="center">

                    <Col xs={24} sm={18} md={12} lg={10}>

                        <Card style={{ borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid rgba(255,255,255,0.3)", overflow: "hidden" }} styles={{ body: { padding: "40px 30px" } }}>
                            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                                <Title level={3} style={{ marginBottom: "8px", fontWeight: "700" }}>Welcome Back</Title>
                                <Text type="secondary">Please enter your details to Login</Text>
                            </div>

                            <Form layout="vertical" requiredMark={false}>
                                <Form.Item label={<Text strong>Email Address</Text>}>
                                    <Input name="email" value={state.email} onChange={handleChange} prefix={<MailOutlined className="text-muted" />} placeholder="name@company.com" size="large"
                                        style={{ borderRadius: "8px", paddingTop: "8px", paddingBottom: "8px" }} />
                                </Form.Item>

                                <Form.Item label={<Text strong>Password</Text>}>
                                    <Input.Password name="password" value={state.password} onChange={handleChange} prefix={<LockOutlined className="text-muted" />} placeholder="••••••••" size="large"
                                        style={{ borderRadius: "8px", paddingTop: "8px", paddingBottom: "8px" }} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" onClick={handleLogin} htmlType="submit" block size="large" loading={isProcessing}
                                        style={{ height: "48px", borderRadius: "8px", fontWeight: "600", fontSize: "16px", background: "#1677ff" }}>
                                        Login
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div style={{ textAlign: "center", marginTop: "10px" }}>
                                <Text type="secondary">Don't have an account? </Text>
                                <Link to="/auth/register" style={{ fontWeight: "600" }}>Create account</Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </main>
    );
};

export default Login;