import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Collapse, message, Modal } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  LockOutlined,
  SendOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  FaGraduationCap,
  FaBook,
  FaUsers,
  FaCog,
  FaCheckCircle,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaFacebook,
} from 'react-icons/fa';
import axios from 'axios';
import './ModernLandingPage.css';

const ModernLandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm] = Form.useForm();
  const [contactLoading, setContactLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      Object.entries(sectionsRef.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.75) {
            setVisibleSections(prev => ({ ...prev, [key]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = async (values) => {
    try {
      setContactLoading(true);
      await axios.post('/api/messages/contact', {
        name: values.name,
        email: values.email,
        message: values.message
      });
      message.success('Message sent successfully! We will contact you soon.');
      contactForm.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const faqItems = [
    {
      key: '1',
      label: 'How do I register for an account?',
      children: 'Click on the "Register" button in the top navigation or "Get Started" button in the hero section. Fill in your details and select your course. You will then be directed to complete the admission application form.',
    },
    {
      key: '2',
      label: 'How do I fill the application form?',
      children: 'After registration, you\'ll be redirected to the application form. Fill in your personal details, guardian information, academic background, and upload required documents. Submit the form for admin review.',
    },
    {
      key: '3',
      label: 'How does admin approve applications?',
      children: 'Admins review submitted applications in the admin dashboard. They verify documents, check eligibility, and approve or reject applications. Once approved, you receive an email with your admission number and temporary password.',
    },
    {
      key: '4',
      label: 'How do I reset my password?',
      children: 'On the login page, click "Forgot Password?". Enter your email address and follow the instructions sent to your email to reset your password securely.',
    },
    {
      key: '5',
      label: 'What are the system requirements?',
      children: 'You need a modern web browser (Chrome, Firefox, Safari, Edge) and a stable internet connection. The system works on desktop, tablet, and mobile devices.',
    },
    {
      key: '6',
      label: 'Is my data secure?',
      children: 'Yes, all data is encrypted using JWT tokens and stored securely in MongoDB. We follow industry-standard security practices and GDPR compliance.',
    },
  ];

  const features = [
    {
      icon: <FileTextOutlined />,
      title: 'Student Admission',
      description: 'Streamlined digital admission with real-time tracking and document management.'
    },
    {
      icon: <DollarOutlined />,
      title: 'Fee Management',
      description: 'Automated fee collection, receipts, and comprehensive financial reporting.'
    },
    {
      icon: <CalendarOutlined />,
      title: 'Attendance Monitoring',
      description: 'Digital attendance tracking with analytics and automated notifications.'
    },
    {
      icon: <BarChartOutlined />,
      title: 'Results & Reports',
      description: 'Comprehensive grading system with detailed analytics and PDF reports.'
    },
    {
      icon: <ScheduleOutlined />,
      title: 'Timetable & Scheduling',
      description: 'Dynamic timetable management with conflict detection and mobile access.'
    },
    {
      icon: <NotificationOutlined />,
      title: 'Communication Hub',
      description: 'Integrated messaging and notification system for all stakeholders.'
    },
  ];

  const roles = [
    {
      title: 'Admin',
      icon: <FaCog size={40} />,
      features: [
        'Full system control and configuration',
        'User management and permissions',
        'Financial oversight and reporting',
        'System analytics and dashboards'
      ]
    },
    {
      title: 'Teacher',
      icon: <FaBook size={40} />,
      features: [
        'Attendance management',
        'Grade submission and tracking',
        'Assignment creation and grading',
        'Student performance analytics'
      ]
    },
    {
      title: 'Student',
      icon: <FaGraduationCap size={40} />,
      features: [
        'Application submission',
        'Fee payment and tracking',
        'Access learning materials',
        'View grades and attendance'
      ]
    },
  ];

  const workflowSteps = [
    { step: 1, title: 'Student Application', icon: <FileTextOutlined /> },
    { step: 2, title: 'Admin Review', icon: <FaCog size={20} /> },
    { step: 3, title: 'Admission Confirmed', icon: <FaCheckCircle size={20} /> },
    { step: 4, title: 'Student Login', icon: <LockOutlined /> },
    { step: 5, title: 'Dashboard Access', icon: <BarChartOutlined /> },
  ];

  return (
    <div className="modern-landing-page">
      {/* ========== NAVBAR ========== */}
      <nav className="navbar-section">
        <div className="navbar-container">
          <div className="navbar-logo">
            <FaGraduationCap size={28} className="logo-icon" />
            <span>EduManage</span>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseOutlined size={24} /> : <MenuOutlined size={24} />}
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#roles" className="nav-link">Roles</a>
            <a href="#workflow" className="nav-link">Workflow</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <div className="navbar-buttons">
            <Button 
              type="primary" 
              ghost 
              className="nav-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              type="primary" 
              className="nav-btn-filled"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section id="home" className="hero-section" ref={el => sectionsRef.current.hero = el}>
        <div className="hero-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="animated-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`
              }}></div>
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text" style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: 1 - scrollY / 800
          }}>
            <h1 className="hero-headline">
              Unified ERP System for <span className="gradient-text">Smarter Student Management</span>
            </h1>
            <p className="hero-description">
              A complete digital solution to manage admissions, attendance, fees, results, and communication—built for modern institutions.
            </p>
            <div className="hero-buttons">
              <Button 
                size="large" 
                className="btn-primary"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Explore System <ArrowRightOutlined />
              </Button>
              <Button 
                size="large" 
                type="primary"
                className="btn-secondary"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="three-d-container">
              <div className="floating-card card-1">
                <FaGraduationCap size={40} />
              </div>
              <div className="floating-card card-2">
                <FaBook size={40} />
              </div>
              <div className="floating-card card-3">
                <FaUsers size={40} />
              </div>
              <div className="glow-orb"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES CAROUSEL ========== */}
      <section id="features" className="features-section" ref={el => sectionsRef.current.features = el}>
        <div className="section-container">
          <h2 className={`section-title ${visibleSections.features ? 'visible' : ''}`}>
            Powerful Features
          </h2>
          <p className="section-subtitle">Everything you need for complete student management</p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card ${visibleSections.features ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ABOUT SYSTEM ========== */}
      <section className="about-section" id="about" ref={el => sectionsRef.current.about = el}>
        <div className="section-container">
          <div className={`about-content ${visibleSections.about ? 'visible' : ''}`}>
            <div className="about-text">
              <h2>Why ERP for Modern Institutions?</h2>
              <p>
                Traditional manual systems create bottlenecks, paperwork clutter, and communication gaps. Our comprehensive ERP solution integrates every aspect of student management into a single, intuitive platform.
              </p>
              <div className="benefits-list">
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Eliminate paperwork and reduce administrative overhead</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Real-time data visibility for better decision making</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Enhanced communication between all stakeholders</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Automated workflows and reduced human errors</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Complete security and data privacy compliance</span>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-graphic">
                <div className="graphic-element element-1"></div>
                <div className="graphic-element element-2"></div>
                <div className="graphic-element element-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ROLE-BASED ACCESS ========== */}
      <section id="roles" className="roles-section" ref={el => sectionsRef.current.roles = el}>
        <div className="section-container">
          <h2 className={`section-title ${visibleSections.roles ? 'visible' : ''}`}>
            Tailored for Every Role
          </h2>
          <p className="section-subtitle">Different dashboards, same powerful platform</p>

          <div className="roles-grid">
            {roles.map((role, index) => (
              <div 
                key={index}
                className={`role-card ${visibleSections.roles ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="role-icon-wrapper">
                  <div className="role-icon">{role.icon}</div>
                </div>
                <h3>{role.title}</h3>
                <ul className="role-features">
                  {role.features.map((feature, idx) => (
                    <li key={idx}>
                      <FaArrowRight className="arrow-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  type="primary" 
                  ghost 
                  block 
                  className="role-btn"
                  onClick={() => navigate('/login')}
                >
                  Access Dashboard
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WORKFLOW ========== */}
      <section id="workflow" className="workflow-section" ref={el => sectionsRef.current.workflow = el}>
        <div className="section-container">
          <h2 className={`section-title ${visibleSections.workflow ? 'visible' : ''}`}>
            Seamless Workflow
          </h2>
          <p className="section-subtitle">From application to enrollment in 5 simple steps</p>

          <div className="workflow-container">
            {workflowSteps.map((item, index) => (
              <div 
                key={index}
                className={`workflow-step ${visibleSections.workflow ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="step-icon">{item.icon}</div>
                <div className="step-number">{item.step}</div>
                <h4>{item.title}</h4>
                {index < workflowSteps.length - 1 && (
                  <div className="step-connector">
                    <FaArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="faq-section" ref={el => sectionsRef.current.faq = el}>
        <div className="section-container">
          <h2 className={`section-title ${visibleSections.faq ? 'visible' : ''}`}>
            Frequently Asked Questions
          </h2>
          
          <div className={`faq-container ${visibleSections.faq ? 'visible' : ''}`}>
            <Collapse 
              items={faqItems}
              className="faq-accordion"
            />
          </div>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="contact-section" ref={el => sectionsRef.current.contact = el}>
        <div className="section-container">
          <h2 className={`section-title ${visibleSections.contact ? 'visible' : ''}`}>
            Get in Touch
          </h2>

          <div className="contact-content">
            <div className={`contact-info ${visibleSections.contact ? 'visible' : ''}`}>
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h4>Email</h4>
                <p>
                  <a href="mailto:support@edumanage.com">support@edumanage.com</a>
                </p>
              </div>
              <div className="info-card">
                <div className="info-icon">📱</div>
                <h4>Phone</h4>
                <p>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </p>
              </div>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h4>Address</h4>
                <p>123 Education Boulevard, Tech City, TC 12345</p>
              </div>
            </div>

            <Form 
              form={contactForm}
              layout="vertical"
              onFinish={handleContactSubmit}
              className={`contact-form ${visibleSections.contact ? 'visible' : ''}`}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="Your Name" className="form-input" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email address' }
                ]}
              >
                <Input placeholder="Your Email" type="email" className="form-input" />
              </Form.Item>

              <Form.Item
                name="message"
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <Input.TextArea 
                  placeholder="Your Message" 
                  rows={4}
                  className="form-input"
                />
              </Form.Item>

              <Button 
                type="primary"
                htmlType="submit"
                size="large"
                loading={contactLoading}
                className="submit-btn"
              >
                <SendOutlined /> Send Message
              </Button>
            </Form>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <FaGraduationCap size={24} />
              <span>EduManage</span>
            </div>
            <p>Transforming education management through innovative technology</p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-social">
            <a href="#" className="social-icon"><FaLinkedin /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaGithub /></a>
            <a href="#" className="social-icon"><FaFacebook /></a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 EduManage. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>

      {/* Animated Background */}
      <div className="page-background">
        <div className="bg-element element-1"></div>
        <div className="bg-element element-2"></div>
        <div className="bg-element element-3"></div>
      </div>
    </div>
  );
};

export default ModernLandingPage;
