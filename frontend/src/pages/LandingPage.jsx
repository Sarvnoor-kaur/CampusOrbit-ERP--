import React from 'react';
import { Button, Typography, Row, Col, Card, Space, Divider } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  LaptopOutlined, 
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const { Title, Text, Paragraph } = Typography;

const features = [
  {
    icon: <BookOutlined className="feature-icon" />,
    title: 'Comprehensive Courses',
    description: 'Access a wide range of courses across various subjects and levels.'
  },
  {
    icon: <TeamOutlined className="feature-icon" />,
    title: 'Expert Instructors',
    description: 'Learn from experienced professionals and industry experts.'
  },
  {
    icon: <LaptopOutlined className="feature-icon" />,
    title: 'Flexible Learning',
    description: 'Study at your own pace, anytime, anywhere.'
  },
  {
    icon: <TrophyOutlined className="feature-icon" />,
    title: 'Certification',
    description: 'Earn certificates upon course completion.'
  }
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      {/* Add padding to account for fixed navbar */}
      <div style={{ paddingTop: '80px' }}></div>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ marginTop: '-80px' }}>
        <div className="container">
          <Row align="middle" style={{ minHeight: '80vh' }}>
            <Col xs={24} md={12}>
              <Title level={1} className="hero-title">
                Transform Your Learning Experience
              </Title>
              <Paragraph className="hero-subtitle">
                Join thousands of students and professionals advancing their careers with our comprehensive online courses.
              </Paragraph>
              <Space size="large">
                <Button type="primary" size="large">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="large">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={12} className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Online Learning" 
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Title level={2} className="section-title">Why Choose Our Platform</Title>
          <Row gutter={[24, 48]} className="features-grid">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="feature-card">
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <Title level={4} className="feature-title">{feature.title}</Title>
                  <Text className="feature-description">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card">
            <Row align="middle">
              <Col xs={24} md={16}>
                <Title level={3} className="cta-title">Ready to start learning?</Title>
                <Text className="cta-text">Join our community of learners today and take the first step towards achieving your goals.</Text>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                <Button type="primary" size="large">
                  <Link to="/register">Get Started Now</Link>
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
