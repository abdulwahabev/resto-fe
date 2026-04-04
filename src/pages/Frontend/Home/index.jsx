import React from "react";
import { Row, Col, Typography, Rate, Tag } from "antd";
import { FireOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    return (
        <div className="container" style={{ padding: "25px 20px" }}>
            <Row gutter={[30, 30]} align="middle">

                {/* LEFT CONTENT */}
                <Col xs={24} md={12}>
                    <Title level={2} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 20 }}>
                        Welcome to Our Restaurant 🍽️
                    </Title>

                    <Paragraph style={{ fontSize: 16, color: "#555" }}>
                        Experience the perfect blend of taste and ambiance at our restaurant.
                        We serve freshly prepared meals using high-quality ingredients that
                        bring authentic flavors to your table. Every dish is crafted with
                        passion to give you a memorable dining experience.
                    </Paragraph>

                    <Paragraph style={{ fontSize: 16, color: "#555" }}>
                        Whether you're craving traditional recipes or modern cuisine,
                        our diverse menu has something for everyone. From delicious starters
                        to mouth-watering main courses, we ensure quality and taste in every bite.
                    </Paragraph>

                    {/* ⭐ UNIQUE SECTION (instead of button) */}
                    <div
                        style={{
                            marginTop: 25,
                            padding: 20,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #fff1f0, #ffe7ba)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                        }}
                    >
                        <Text strong style={{ fontSize: 16 }}>
                            Customer Rating
                        </Text>

                        <div style={{ marginTop: 8 }}>
                            <Rate disabled defaultValue={4.5} style={{ color: "#faad14" }} />
                        </div>

                        <div style={{ marginTop: 10 }}>
                            <Tag color="red" icon={<FireOutlined />}>
                                Popular Choice
                            </Tag>
                            <Tag color="blue" icon={<ClockCircleOutlined />}>
                                Fast Service
                            </Tag>
                        </div>
                    </div>
                </Col>

                {/* RIGHT IMAGE */}
                <Col xs={24} md={12}>

                    <div style={{ overflow: "hidden", borderRadius: 20, position: "relative" }}>

                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.30)", zIndex: 1 }} />

                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" alt="restaurant" className="img-fluid" style={{
                            width: "100%", height: "100%", objectFit: "cover", transition: "0.4s", filter: "brightness(70%) contrast(110%)" // darker effect
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                    </div>
                </Col>

            </Row>
        </div>
    );
};

export default Home;