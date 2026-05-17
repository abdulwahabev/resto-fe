import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography, Divider } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const { Title, Text, Paragraph } = Typography;

const initialState = { name: "", email: "", password: "", confirmPassword: "" };

const Register = () => {
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Input changes handle karne ka function
    const handleChange = (e) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Form submit/Sign up handle karne ka function
    const handleRegister = async (e) => {
        if (e) e.preventDefault(); // Form reload hone se rokne ke liye

        let { name, email, password, confirmPassword } = state;
        name = name.trim();

        // Validations
        if (name.length < 3) return window.toastify("Name must be at least 3 characters", "error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return window.toastify("Invalid email address", "error");
        if (password.length < 6) return window.toastify("Password must be at least 6 characters", "error");
        if (password !== confirmPassword) return window.toastify("Passwords do not match", "error");

        setIsProcessing(true);

        try {
            const res = await axios.post(`${apiUrl}/auth/register`, { name, email, password });

            if (res.status === 201) {
                window.toastify(res.data.message || "Account created!", "success");
                setState(initialState);
                navigate("/auth/login");
            }
        }
        catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Try again.";
            window.toastify(msg, "error");
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", background: "#ffffff" }}>
            <Row style={{ width: "100%" }} align="stretch">

                {/* Left Side: Visual Section */}
                <Col xs={0} lg={12} style={{
                    background: "linear-gradient(135deg, #1677ff 0%, #003a8c 100%)",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    alignItems: "center", padding: "60px", color: "#fff", position: "relative", overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                    <RocketOutlined style={{ fontSize: "80px", marginBottom: "30px", opacity: "0.9" }} />
                    <Title style={{ color: "#fff", fontSize: "48px", fontWeight: "800", textAlign: "center" }}>Start Your Journey</Title>
                    <Paragraph style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px", textAlign: "center", maxWidth: "450px" }}>
                        Join thousands of users and start managing your tasks professionally.
                    </Paragraph>
                </Col>

                {/* Right Side: Form Section */}
                <Col xs={24} lg={12} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fbff" }}>
                    <div style={{ width: "100%", maxWidth: "420px" }}>
                        <div style={{ marginBottom: "40px" }}>
                            <Title level={2} style={{ fontWeight: "800", marginBottom: "8px" }}>Create Account</Title>
                            <Text type="secondary" style={{ fontSize: "16px" }}>
                                Already have an account? <Link to="/auth/login" style={{ fontWeight: "600" }}>Login here</Link>
                            </Text>
                        </div>

                        <Form layout="vertical" size="large">
                            <Form.Item label={<Text strong>Full Name</Text>}>
                                <Input name="name" prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} placeholder="Enter your name" style={{ borderRadius: "12px" }} value={state.name} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label={<Text strong>Email Address</Text>}>
                                <Input name="email" prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} placeholder="email@example.com" style={{ borderRadius: "12px" }} value={state.email} onChange={handleChange} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={<Text strong>Password</Text>}>
                                        <Input.Password name="password" prefix={<LockOutlined style={{ color: "#bfbfbf" }} />} placeholder="••••••" style={{ borderRadius: "12px" }} value={state.password} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={<Text strong>Confirm</Text>}>
                                        <Input.Password name="confirmPassword" prefix={<LockOutlined style={{ color: "#bfbfbf" }} />} placeholder="••••••" style={{ borderRadius: "12px" }} value={state.confirmPassword} onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: "10px" }}>
                                <Button type="primary" block loading={isProcessing} onClick={handleRegister} style={{ height: "54px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", boxShadow: "0 8px 15px rgba(155, 178, 210, 0.2)" }}>
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: "center", marginTop: "30px" }}>
                            <Text style={{ fontSize: "12px", color: "#bfbfbf" }}>
                                By signing up, you agree to our <b>Terms of Service</b>.
                            </Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </main>
    );
};

export default Register;