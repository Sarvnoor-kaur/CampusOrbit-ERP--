import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '../utils/api';
import './StudentLogin.css';

const StudentLogin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState('');

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
      const response = await api.post('/auth/login-student', {
        admissionNumber: values.admissionNumber.trim(),
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
    <div className="student-login-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <div className="login-content">
        <Button 
          type="text" 
          className="back-button"
          onClick={() => navigate('/')}
          icon={<ArrowLeftOutlined />}
        >
          Back to Home
        </Button>

        <div className="login-box">
          <div className="login-header">
            <h1>Student Login</h1>
            <p>Welcome back! Sign in to your account</p>
          </div>

          {error && (
            <Alert 
              message="Login Error" 
              description={error} 
              type="error" 
              showIcon
              closable
              className="login-alert"
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            className="login-form"
          >
            <Form.Item
              name="admissionNumber"
              rules={[
                { required: true, message: 'Please enter your admission number' },
              ]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Admission Number" 
                prefix={<UserOutlined className="input-icon" />}
                className="login-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
              className="form-item-custom"
            >
              <Input.Password 
                placeholder="Password" 
                prefix={<LockOutlined className="input-icon" />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="login-input"
                size="large"
              />
            </Form.Item>

            <div className="login-options">
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="login-button"
              size="large"
              block
            >
              Sign In
            </Button>
          </Form>

          <Divider className="login-divider">or</Divider>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
          </div>

          <div className="login-roles">
            <p className="roles-title">Login as:</p>
            <div className="roles-links">
              <Link to="/teacher/login" className="role-link">Teacher Login</Link>
              <span className="role-separator">•</span>
              <Link to="/admin/login" className="role-link">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
