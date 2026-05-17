import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, Button, message, Spin, Typography, Space, Popconfirm } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/context/Auth';
const apiUrl = import.meta.env.VITE_API_URL;

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("jwt");
            const res = await axios.get(`${apiUrl}/orders/get-all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.orders);
        } catch (err) {
            message.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId, field, newValue) => {
        try {
            setIsUpdating(true);
            const token = localStorage.getItem("jwt");
            await axios.put(`http://localhost:8000/api/orders/update/${orderId}`,
                { [field]: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
            fetchOrders(); // Refresh data
        } catch (err) {
            message.error(`Failed to update ${field}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`http://localhost:8000/api/orders/delete/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Order deleted");
            fetchOrders();
        } catch (err) {
            message.error("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'gold';
            case 'processing': return 'blue';
            case 'shipped': return 'cyan';
            case 'delivered': return 'green';
            case 'cancelled': return 'red';
            case 'paid': return 'green';
            case 'failed': return 'volcano';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id) => <Text copyable>{id}</Text>
        },
        ...(user?.role === 'superAdmin' ? [{
            title: 'Customer',
            dataIndex: 'uid',
            key: 'uid',
            width: 150,
            render: (uid) => <Text type="secondary" style={{ fontSize: 12 }}>{uid}</Text>
        }] : []),
        {
            title: 'Products',
            dataIndex: 'product',
            key: 'products',
            render: (products) => (
                <Space orientation="vertical" size={2}>
                    {products.map((p, i) => (
                        <div key={i}>
                            <Text strong>{p.name}</Text> <Text type="secondary">x{p.quantity}</Text>
                        </div>
                    ))}
                </Space>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <Text strong style={{ color: '#722ed1' }}>Rs. {amount}</Text>
        },
        {
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                if (user?.role === 'superAdmin') {
                    return (
                        <Select
                            defaultValue={status}
                            style={{ width: 130 }}
                            onChange={(value) => handleStatusChange(record.id, 'status', value)}
                            loading={isUpdating}
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="shipped">Shipped</Option>
                            <Option value="delivered">Delivered</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    );
                }
                return <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (paymentStatus, record) => {
                if (user?.role === 'superAdmin') {
                    return (
                        <Select
                            defaultValue={paymentStatus}
                            style={{ width: 110 }}
                            onChange={(value) => handleStatusChange(record.id, 'paymentStatus', value)}
                            loading={isUpdating}
                        >
                            <Option value="pending">Pending</Option>
                            <Option value="paid">Paid</Option>
                            <Option value="failed">Failed</Option>
                        </Select>
                    );
                }
                return <Tag color={getStatusColor(paymentStatus)}>{paymentStatus.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        ...(user?.role === 'superAdmin' ? [{
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Delete Order"
                    description="Are you sure you want to delete this order?"
                    onConfirm={() => handleDeleteOrder(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            )
        }] : [])
    ];

    return (
        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    📦 {user?.role === 'superAdmin' ? 'All Orders Management' : 'My Orders'}
                </Title>
                <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={isLoading}>Refresh</Button>
            </div>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 800 }}
                style={{ borderRadius: 8, overflow: 'hidden' }}
            />
        </div>
    );
};

export default Orders;