import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Modal, Input, message, Spin, Typography, Rate, Space, Badge } from 'antd';
import { SearchOutlined, ShoppingOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const apiUrl = import.meta.env.VITE_API_URL;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [shippingAddress, setShippingAddress] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${apiUrl}/products`);
            const data = res.data.products || [];
            setProducts(data);
            setFilteredProducts(data);
        } catch (err) {
            message.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleOrderNow = (product) => {
        const token = localStorage.getItem("jwt");
        if (!token) return navigate("/auth/login");
        setSelectedProduct(product);
        setQuantity(1);
        setIsOrderModalVisible(true);
    };

    const handleCreateOrder = async () => {
        if (!shippingAddress) return message.error("Please enter delivery address or table number");

        setIsProcessing(true);
        try {
            const token = localStorage.getItem("jwt");

            const orderPayload = {
                product: [{
                    productId: selectedProduct.id,
                    name: selectedProduct.name,
                    price: Number(selectedProduct.price),
                    quantity: Number(quantity),
                    imageURL: selectedProduct.imageURL
                }],
                totalAmount: Number(selectedProduct.price * quantity),
                shippingAddress
            };

            const response = await axios.post(`${apiUrl}/orders/create`, orderPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success(response.data.message || "Order Placed Successfully!");
            setIsOrderModalVisible(false);
            setShippingAddress("");
            fetchProducts(); // Stock update hone ke baad products refresh honge

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong. Try again.";
            message.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '20%' }}><Spin size="large" /></div>;

    return (
        <main style={{ padding: "30px", backgroundColor: "#fdfdfd" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>

                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <Title level={1} style={{ fontWeight: 700, marginBottom: 10 }}>THE MENU</Title>
                    <div style={{ width: 50, height: 3, background: '#ff4d4f', margin: '0 auto 20px' }}></div>
                    <Input
                        placeholder="What are you craving?"
                        prefix={<SearchOutlined />}
                        onChange={onSearchChange}
                        style={{ width: '100%', maxWidth: 400, borderRadius: 25, height: 45 }}
                    />
                </div>

                <Row gutter={[30, 40]}>
                    {filteredProducts.map((product) => (
                        <Col xs={24} sm={12} md={8} key={product.id || product._id} style={{ display: 'flex' }}>
                            <Card
                                hoverable
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                                }}
                                styles={{
                                    body: {
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: "20px"
                                    }
                                }}
                                cover={
                                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                                        {/* PRICE SHOW RIGHT TOP */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 15,
                                            right: 15,
                                            zIndex: 5,
                                            background: '#ff4d4f',
                                            padding: '4px 12px',
                                            borderRadius: 10,
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            fontSize: '15px'
                                        }}>
                                            ${product.price}
                                        </div>

                                        <img
                                            src={product.imageURL}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />

                                        {/* STOCK QUANTITY ADDED HERE */}
                                        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                                            <Badge
                                                status={product.stock > 0 ? "processing" : "default"}
                                                text={product.stock > 0 ? `Available: ${product.stock}` : "Sold Out"}
                                                style={{
                                                    color: '#fff',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    padding: '2px 8px',
                                                    borderRadius: 5
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                            >
                                <div style={{ flex: 1 }}>
                                    <Title level={4} style={{ margin: 0, letterSpacing: -0.5 }}>{product.name}</Title>
                                    <Rate disabled defaultValue={4.5} style={{ fontSize: 10, color: '#ff4d4f', marginBottom: 10 }} />
                                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 20 }}>
                                        {product.description || "Fresh and hot food served right to your table."}
                                    </Paragraph>
                                </div>

                                <Button
                                    type="default"
                                    block
                                    size="large"
                                    icon={<ShoppingOutlined />}
                                    onClick={() => handleOrderNow(product)}
                                    disabled={product.stock <= 0}
                                    style={{
                                        background: 'transparent',
                                        borderColor: '#ff4d4f',
                                        color: '#ff4d4f',
                                        fontWeight: '600',
                                        border: 'none',
                                        borderRadius: 25,
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#ff4d4f';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#ff4d4f';
                                    }}
                                >
                                    Order Now
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title="Finish Order"
                    open={isOrderModalVisible}
                    onOk={handleCreateOrder}
                    onCancel={() => setIsOrderModalVisible(false)}
                    confirmLoading={isProcessing}
                    okButtonProps={{ style: { background: '#ff4d4f', borderRadius: 20, border: 'none' } }}
                >
                    {selectedProduct && (
                        <div style={{ padding: '10px 0' }}>
                            <Title level={5}>{selectedProduct.name}</Title>
                            <Space orientation="vertical" style={{ width: '100%' }}>
                                <Text>Quantity (Available: {selectedProduct.stock}):</Text>
                                <Input
                                    type="number"
                                    min={1}
                                    max={selectedProduct.stock}
                                    value={quantity}
                                    onChange={e => setQuantity(Number(e.target.value))}
                                />
                                <Text>Delivery/Table Address:</Text>
                                <TextArea placeholder="Table No / Address" rows={3} value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
                                <div style={{ marginTop: 15, textAlign: 'right' }}>
                                    <Text strong style={{ fontSize: 18 }}>Total: ${(selectedProduct.price * quantity).toFixed(2)}</Text>
                                </div>
                            </Space>
                        </div>
                    )}
                </Modal>
            </div>
        </main>
    );
};

export default Products;