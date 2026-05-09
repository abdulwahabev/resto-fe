import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Select, Typography, Row, Col, Dropdown, Input } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const { Title } = Typography;

const Users = () => {

    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const { Option } = Select;

    const getUsers = () => {

        setIsAppLoading(true);

        axios.get("https://resto-be.vercel.app/api/auth/all-users", { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
            .then(res => setUsers(res.data.users))
            .catch(err => window.toastify?.(err.response?.data?.message || "Failed to fetch users", "error"))
            .finally(() => setIsAppLoading(false));
    };

    useEffect(() => { getUsers(); }, []);

    const handleDelete = async (uid) => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/auth/super-Admin/delete-user/${uid}`, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } });
            setUsers(prev => prev.filter(u => u.uid !== uid));
            window.toastify?.("User deleted successfully", "success");
        } catch (err) {
            window.toastify?.(err.response?.data?.message || "Delete failed", "error");
        }
    };

    const openEditModal = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            role: record.role,
            status: record.status
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateUser = async (values) => {
        setIsLoading(true);
        try {
            const res = await axios.patch(`http://localhost:8000/api/auth/super-Admin/update-user/${editingUser.uid}`, values, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } });
            setUsers(prev => prev.map(u => u.uid === editingUser.uid ? res.data.updatedUser : u));
            setIsEditModalVisible(false);
            form.resetFields();
            window.toastify?.("User updated successfully", "success");
        } catch (err) {
            window.toastify?.(err.response?.data?.message || "Update failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        { title: 'UID', dataIndex: 'uid', key: 'uid', render: uid => <span onClick={() => { navigator.clipboard.writeText(uid); window.toastify?.("UID copied!", "success"); }} style={{ cursor: 'pointer', color: '#1677ff' }}>{uid.slice(2)}📋</span> },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Role', dataIndex: 'role', key: 'role',
            filters: [{ text: 'Super Admin', value: 'superAdmin' }, { text: 'Customer', value: 'customer' }],
            onFilter: (value, record) => record.role === value,
            render: role => <span style={{ padding: "2px 6px", borderRadius: "8px", color: "#fff", backgroundColor: role === 'superAdmin' ? '#1677ff' : '#6c757d' }}>{role === 'superAdmin' ? 'Super Admin' : 'Customer'}</span>
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
            onFilter: (value, record) => record.status === value,
            render: status => <span style={{ padding: "2px 6px", borderRadius: "8px", color: "#fff", backgroundColor: status === 'active' ? '#28a745' : '#dc3545' }}>{status}</span>
        },
        {
            title: 'Actions', key: 'actions', render: (_, record) => {
                const items = [
                    {
                        key: 'edit', label: 'Edit', icon: <EditOutlined />,
                        disabled: record.uid === user?.uid, onClick: () => openEditModal(record)
                    },
                    {
                        key: 'delete', label: 'Delete', icon: <DeleteOutlined />,
                        danger: true, disabled: record.role === "superAdmin" || record.uid === user?.uid,
                        onClick: () => Modal.confirm({ title: "Delete User", content: "Are you sure?", okType: "danger", onOk: () => handleDelete(record.uid) })
                    }
                ];
                return <Dropdown menu={{ items }} trigger={['click']}><Button type="text" icon={<MoreOutlined />} /></Dropdown>;
            }
        }
    ];

    return (
        <div className="p-4">

            <Row justify="space-between" align="middle" className="mb-4" style={{ padding: "16px 20px", borderRadius: "6px", background: "linear-gradient(135deg, #4a83d3ff, #69b1ff)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <Col>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "45px", height: "45px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff" }}>👥</div>
                        <div>
                            <Title level={3} style={{ margin: 0, color: "#fff" }}>Users Management</Title>
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>Manage All Registered Users Efficiently</span>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div style={{ padding: "6px 14px", borderRadius: "20px", background: "#fff", color: "#1677ff", fontWeight: "500", fontSize: "13px" }}>Active Panel</div>
                </Col>
            </Row>

            <Table columns={columns} dataSource={users} rowKey="uid" loading={isAppLoading} pagination={{ pageSize: 10 }} scroll={{ x: true }} locale={{ emptyText: "No users found" }} />

            <Modal title={`Edit User: ${editingUser?.name}`} open={isEditModalVisible} onCancel={() => { setIsEditModalVisible(false); setEditingUser(null); form.resetFields(); }} footer={null}>

                <Form form={form} layout="vertical" onFinish={handleUpdateUser}>

                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name required" }]}>
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email", message: "Valid email required" }]}>
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select disabled={editingUser?.role === "superAdmin"}>
                            <Option value="superAdmin">Super Admin</Option>
                            <Option value="customer">Customer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className="text-end">
                        <Space>
                            <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={isLoading}>Save</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Users;