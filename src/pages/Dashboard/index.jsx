import React, { useState } from 'react';
import { DashboardOutlined, DesktopOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/Auth';
import Routes from './Routes';
import items from './Users/sliderbar';

const { Header, Sider, Content, Footer } = Layout;

const Dashboard = () => {

    const { user, handleLogout } = useAuth();

    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    return (

        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg" onBreakpoint={(broken) => {
                setIsMobile(broken);
                setCollapsed(broken);
            }}
                onMouseEnter={() => {
                    if (!isMobile) setCollapsed(false);
                }}
                onMouseLeave={() => {
                    if (!isMobile) setCollapsed(true);
                }}>

                <div
                    style={{ margin: '16px 0', height: '60px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 16, color: '#fff', fontSize: '18px', fontWeight: '600', gap: '10px', transition: 'all 0.3s ease', }}>
                    {/* 🔥 Logo Icon */}
                    <img
                        src="https://www.shutterstock.com/image-illustration/restaurant-spoon-logo-illustration-vector-260nw-2510968089.jpg"
                        alt="logo"
                        style={{ height: '35px', width: '35px', objectFit: 'cover', borderRadius: '50%', }} />

                    {/* 🔥 Text with Great Vibes font */}
                    {!collapsed && (
                        <span>
                            <Link to="/" className="text-white great-vibes-regular" style={{ textDecoration: 'none' }}>
                                Restaurant
                            </Link>
                        </span>
                    )}
                </div>

                {/* 🔥 Menu */}
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items.filter(item => !item.allowedroles || item.allowedroles.includes(user?.role))}
                />
            </Sider>

            {/* Right Side Layout */}
            <Layout>

                {/* 🔥 Header */}
                <Header
                    style={{ padding: '0 10px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', }}
                >
                    {/* Left: Toggle */}
                    <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '18px' }} />

                    {/* Center: Title */}
                    <h2 style={{ margin: 0 }}>My Dashboard</h2>

                    {/* Right: Logout Button */}
                    <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ borderRadius: '3px', padding: '6px 10px', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '6px' }}>
                        Logout
                    </Button>

                </Header>

                {/* 🔥 Content */}
                <Content>

                    <Routes />

                </Content>

                <Footer style={{ padding: '15px 20px', textAlign: 'center', background: colorBgContainer, borderTop: '1px solid #e8e8e8', fontSize: '14px', color: '#555', fontFamily: 'Poppins, sans-serif', }}>
                    © {new Date().getFullYear()} <strong>Restaurant</strong> | All Rights Reserved.
                </Footer>

            </Layout>
        </Layout >
    );
};

export default Dashboard;