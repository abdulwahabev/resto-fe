import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardOutlined, DesktopOutlined, PieChartOutlined, TeamOutlined } from '@ant-design/icons';

const items = [
    { key: '1', icon: <DashboardOutlined />, label: <Link to="/dashboard" className='text-decoration-none'>Dashboard</Link> },
    { key: '2', icon: <DesktopOutlined />, label: <Link to="/dashboard/products/" className='text-decoration-none'>Product</Link>, allowedroles: ["superAdmin"] },
    { key: '3', icon: <PieChartOutlined />, label: <Link to="/dashboard/orders/" className='text-decoration-none'>Orders</Link> },
    { key: '4', icon: <TeamOutlined />, label: <Link to="/dashboard/users/" className='text-decoration-none'>Users</Link>, allowedroles: ["superAdmin"] },
];

export default items;