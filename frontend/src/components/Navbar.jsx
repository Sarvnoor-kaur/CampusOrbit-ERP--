import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Row, Col, Space } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  BookOutlined, 
  TeamOutlined, 
  LoginOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/" className="logo">
              <h2>EduManage</h2>
            </Link>
          </Col>
          
          <Col className="desktop-menu">
            <Menu mode="horizontal" className="nav-menu">
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="courses" icon={<BookOutlined />}>
                <Link to="/courses">Courses</Link>
              </Menu.Item>
              <Menu.Item key="about" icon={<TeamOutlined />}>
                <Link to="/about">About</Link>
              </Menu.Item>
              <Menu.Item key="contact" icon={<UserOutlined />}>
                <Link to="/contact">Contact</Link>
              </Menu.Item>
            </Menu>
          </Col>

          <Col className="auth-buttons">
            <Space size="middle">
              <Button type="primary" ghost>
                <Link to="/login"><LoginOutlined /> Login</Link>
              </Button>
              <Button type="primary">
                <Link to="/register">Register</Link>
              </Button>
            </Space>
          </Col>

          <Col className="mobile-menu-button">
            <Button 
              type="text" 
              icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />} 
              onClick={toggleMobileMenu}
              style={{ color: '#fff', fontSize: '24px' }}
            />
          </Col>
        </Row>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Menu mode="vertical" className="mobile-nav-menu">
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/" onClick={toggleMobileMenu}>Home</Link>
              </Menu.Item>
              <Menu.Item key="courses" icon={<BookOutlined />}>
                <Link to="/courses" onClick={toggleMobileMenu}>Courses</Link>
              </Menu.Item>
              <Menu.Item key="about" icon={<TeamOutlined />}>
                <Link to="/about" onClick={toggleMobileMenu}>About</Link>
              </Menu.Item>
              <Menu.Item key="contact" icon={<UserOutlined />}>
                <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="login">
                <Button block type="primary" ghost>
                  <Link to="/login" onClick={toggleMobileMenu}><LoginOutlined /> Login</Link>
                </Button>
              </Menu.Item>
              <Menu.Item key="register">
                <Button block type="primary">
                  <Link to="/register" onClick={toggleMobileMenu}>Register</Link>
                </Button>
              </Menu.Item>
            </Menu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
