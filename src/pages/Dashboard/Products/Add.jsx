import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const initialState = { name: "", price: "", stock: "", category: "", description: "" };

const Add = () => {

    const [state, setState] = useState(initialState);
    const [image, setImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const { name, price, stock, category, description } = state;

        if (name.length < 3) return window.toastify("Name must be at least 3 characters long");
        if (price <= 0) return window.toastify("Price must be greater than 0");
        if (stock < 0) return window.toastify("Stock cannot be negative");
        if (!category) return window.toastify("Category is required");
        if (!description) return window.toastify("Description is required");
        if (!image) return window.toastify("Image is required");

        try {
            setIsProcessing(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("stock", stock);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("image", image);

            const token = localStorage.getItem("jwt");

            const res = await axios.post("https://resto-be.vercel.app/api/products/create", formData, { headers: { Authorization: `Bearer ${token}` } });

            if (res.status === 201) {
                window.toastify("Product added successfully", "success");
                setState(initialState);
                setImage(null);
                navigate("/dashboard/products");
            }

        } catch (err) {
            console.error(err);
            message.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ padding: '10px', maxWidth: 950, margin: '0 auto' }}>

            <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, padding: '12px 16px' }}>

                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#333' }}>Add Product</h2>

                    <Button onClick={() => navigate('/dashboard/products')} style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#1677ff', color: '#fff', borderRadius: 6, padding: '6px 14px', fontWeight: 500, border: 'none' }}>
                        All Products <ArrowRightOutlined />
                    </Button>
                </div>

                <Form layout="vertical">

                    <Form.Item label="Product Name">
                        <Input name="name" value={state.name} onChange={handleChange} />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 20 }}>
                        <Form.Item label="Price" style={{ flex: 1 }}>
                            <Input type="number" name="price" value={state.price} onChange={handleChange} />
                        </Form.Item>

                        <Form.Item label="Stock" style={{ flex: 1 }}>
                            <Input type="number" name="stock" value={state.stock} onChange={handleChange} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Category">
                        <Select value={state.category} onChange={(value) => setState({ ...state, category: value })} placeholder="Select Category">
                            <Option value="Shawarma">Shawarma</Option>
                            <Option value="Burgers">Burgers</Option>
                            <Option value="Pizza">Pizza</Option>
                            <Option value="Fast Food">Fast Food</Option>
                            <Option value="BBQ">BBQ</Option>
                            <Option value="Karahi & Handi">Karahi & Handi</Option>
                            <Option value="Rice Dishes">Rice Dishes</Option>
                            <Option value="Sandwiches">Sandwiches</Option>
                            <Option value="Fries & Sides">Fries & Sides</Option>
                            <Option value="Desserts">Desserts</Option>
                            <Option value="Beverages">Beverages</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Description">
                        <TextArea rows={3} name="description" value={state.description} onChange={handleChange} />
                    </Form.Item>

                    <Form.Item label="Image">
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    </Form.Item>

                    <Button type="primary" loading={isProcessing} onClick={handleSubmit}>Add Product</Button>

                </Form>

            </div>
        </div>
    );
};

export default Add;