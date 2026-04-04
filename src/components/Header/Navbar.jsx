import { Space, Button, Dropdown } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = () => {
    const { isAuth, handleLogout } = useAuth();
    const location = useLocation();

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    return (

        <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>

            <nav className="navbar navbar-expand-lg py-2">

                <div className="container">

                    {/* --- Logo Style --- */}
                    <Link className="navbar-brand d-flex align-items-center" to="/" style={{ gap: '10px' }}>

                        <div style={{ background: 'linear-gradient(135deg, #FF4D4F, #FF7875)', width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: '0 4px 10px rgba(240, 179, 180, 0.3)' }}>
                            <span style={{ color: "#fff", fontSize: "22px", fontWeight: "bold" }}>R</span>
                        </div>
                        <span className="fw-bolder" style={{ fontSize: "22px", letterSpacing: '-0.5px', color: '#262626' }}>
                            Food<span style={{ color: '#52c41a' }}>Express</span>
                        </span>

                    </Link>

                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* --- Center Links --- */}
                        <ul className="navbar-nav mx-auto" style={{ gap: '15px' }}>
                            <li className="nav-item">
                                <Link className={`nav-link fw-600 ${isActive('/') ? 'text-danger' : ''}`} to="/"
                                    style={{ transition: '0.3s', borderBottom: isActive('/') ? '2px solid #ff4d4f' : '2px solid transparent' }}>
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link fw-600 ${isActive('/products') ? 'text-danger' : ''}`} to="/products"
                                    style={{ transition: '0.3s', borderBottom: isActive('/products') ? '2px solid #ff4d4f' : '2px solid transparent' }}>
                                    Products
                                </Link>
                            </li>
                        </ul>

                        {/* --- Right Side Actions --- */}
                        <div className="d-flex align-items-center" style={{ gap: '20px' }}>

                            <Space size="middle">

                                {isAuth ? (
                                    <Dropdown placement="bottomRight" arrow
                                        menu={{
                                            items: [{
                                                key: '1', style: { padding: 0 }, label: (
                                                    <Link to="/dashboard" style={{ display: 'block', color: '#fff', background: '#52c41a', padding: '10px 16px', borderRadius: '4px', textAlign: 'center', fontWeight: '600', textDecoration: 'none', }}>
                                                        Go to Dashboard
                                                    </Link>
                                                )
                                            },
                                            {
                                                key: '2', label: (
                                                    <div onClick={handleLogout} style={{ textAlign: 'center', fontWeight: '600', width: '100%' }}>
                                                        Logout
                                                    </div>), icon: <LogoutOutlined />, danger: true, style: { marginTop: '4px' }
                                            },],
                                            style: { padding: '4px' }
                                        }}>
                                        <Button shape="circle" size="large" icon={<UserOutlined />} style={{ border: '2px solid #52c41a', color: '#52c41a' }} />
                                    </Dropdown>
                                ) : (
                                    <>
                                        <Link to="/auth/login" style={{ color: '#595959', fontWeight: '600', textDecoration: 'none' }}>
                                            Login
                                        </Link>
                                        <Link to="/auth/register">
                                            <Button type="primary" style={{ borderRadius: '8px', background: '#52c41a', borderColor: '#52c41a', fontWeight: '600' }}>
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </Space>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;