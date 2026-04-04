import { Table, Image, Tag, Dropdown, Button, Popconfirm, Modal, Form, Input, Select, Space } from 'antd';
import { EllipsisOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const { TextArea } = Input;
const { Option } = Select;
import axios from 'axios';

const All = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [form] = Form.useForm();

    // ✅ Fetch Products
    const readProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem("jwt");

        axios.get("http://localhost:8000/api/products/all", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data.products);
                }
            })
            .catch(err => {
                window.toastify(err.response?.data?.message || "Failed to fetch products", "error");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { readProducts(); }, []);

    // ✅ Edit Product
    const handleEdit = (product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            description: product.description,
        });
        setIsEditModalVisible(true);
    };

    // ✅ Update Product
    const handleUpdateProduct = async (product) => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.patch(`http://localhost:8000/api/products/update/${editingProduct.id}`, product, { headers: { Authorization: `Bearer ${token}` } });

            if (res.status === 200) {
                window.toastify("Product updated successfully", "success");
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data.updatedProduct : p));
                setIsEditModalVisible(false);
                form.resetFields();
                setEditingProduct(null);
            }
        } catch (err) {
            window.toastify(err.response?.data?.message || "Failed to update product", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    // ✅ Delete Product
    const handleDelete = async (product) => {
        try {
            const token = localStorage.getItem("jwt");

            const res = await axios.delete(`http://localhost:8000/api/products/delete/${product.id}`, { headers: { Authorization: `Bearer ${token}` } });

            if (res.status === 200) {
                window.toastify("Product deleted successfully", "success");

                const filtered = products.filter(p => p.id !== product.id);
                setProducts(filtered);
            }
        } catch (err) {
            window.toastify(err.response?.data?.message || "Failed to delete product", "error");
        }
    };

    // ✅ Table Columns
    const columns = [
        {
            title: 'Image', dataIndex: 'imageURL', key: 'image',
            render: (url) => (
                <Image width={60} src={url} style={{ borderRadius: '8px', border: '1px solid #f0f0f0' }} placeholder />
            ),
        },

        { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },

        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => (<span style={{ color: '#52c41a' }}>${price?.toFixed(2)}</span>) },

        { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (stock) => (stock > 0 ? <Tag color="green">{stock}</Tag> : <Tag color="red">Out of stock</Tag>) },

        { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="blue">{cat}</Tag> },

        { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },

        {
            title: 'Action',
            key: 'action', render: (product) => {
                const items = [
                    { key: 'edit', label: (<span onClick={() => handleEdit(product)}><EditOutlined /> Edit</span>), },
                    { key: 'delete', label: (<Popconfirm title="Are you sure to delete this product?" onConfirm={() => handleDelete(product)}><span style={{ color: 'red' }}><DeleteOutlined /> Delete</span></Popconfirm>), },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button icon={<EllipsisOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '20px' }}>

            <div className="bg-white rounded shadow-sm border" style={{ overflow: 'hidden' }}>

                <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">

                    <h3 className="m-0 fw-bold text-dark">All Products</h3>

                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/products/add')}>Add Product</Button>

                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={false}
                    bordered={false}
                    style={{ margin: 0 }}
                    loading={loading}
                />
            </div>

            <Modal
                title={`Edit Product: ${editingProduct?.name}`}
                open={isEditModalVisible}
                onCancel={() => { setIsEditModalVisible(false); setEditingProduct(null); form.resetFields(); }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateProduct}>
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input placeholder="Enter name" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Form.Item name="price" label="Price" rules={[{ required: true, message: "Price is required" }]} style={{ flex: 1 }}>
                            <Input type="number" placeholder="Enter price" />
                        </Form.Item>

                        <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Stock is required" }]} style={{ flex: 1 }}>
                            <Input type="number" placeholder="Enter stock" />
                        </Form.Item>
                    </div>

                    <Form.Item name="category" label="Category" rules={[{ required: true, message: "Category is required" }]}>
                        <Select placeholder="Select Category">
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

                    <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
                        <TextArea rows={3} placeholder="Enter description" />
                    </Form.Item>

                    <Form.Item className="text-end" style={{ marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => { setIsEditModalVisible(false); setEditingProduct(null); form.resetFields(); }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={isUpdating}>Save</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default All;