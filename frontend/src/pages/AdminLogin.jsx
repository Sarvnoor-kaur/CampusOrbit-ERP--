import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '../utils/api';
import './AdminLogin.css';

const AdminLogin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login-admin', {
        email: values.email.trim(),
        password: values.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        message.success('Login successful');
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <Link to="/" className="back-button">
        <ArrowLeftOutlined style={{ marginRight: '8px' }} />
        Back to Home
      </Link>

      <div className="login-content">
        <div className="login-box">
          <div className="login-header">
            <h1>Admin Portal</h1>
            <p>Administration System Access</p>
          </div>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
              label={<span style={{ color: '#e8e8e8' }}>Email Address</span>}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="admin@school.com"
                size="large"
                className="dark-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              label={<span style={{ color: '#e8e8e8' }}>Password</span>}
            >
              <Input
                prefix={<LockOutlined />}
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                size="large"
                className="dark-input"
                suffix={
                  passwordVisible ? (
                    <EyeTwoTone onClick={() => setPasswordVisible(false)} style={{ color: '#ef4444' }} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => setPasswordVisible(true)} style={{ color: '#d0d0d0' }} />
                  )
                }
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link to="#" style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className="login-button"
            >
              Sign In
            </Button>
          </Form>

          <Divider style={{ borderColor: 'rgba(200, 200, 200, 0.2)', margin: '2rem 0' }}>
            <span style={{ color: '#d0d0d0', fontSize: '0.875rem' }}>Other Access Methods</span>
          </Divider>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <Link to="/login" style={{ color: '#0ea5e9', textAlign: 'center', fontSize: '0.875rem' }}>
              Student Login
            </Link>
            <Link to="/teacher/login" style={{ color: '#06b6d4', textAlign: 'center', fontSize: '0.875rem' }}>
              Teacher Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
