import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '../utils/api';
import './TeacherLogin.css';

const TeacherLogin = ({ setUser }) => {
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
      const response = await api.post('/auth/login-teacher', {
        employeeId: values.employeeId.trim(),
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
    <div className="teacher-login-container">
      <div className="teacher-login-background">
        <div className="teacher-login-blob blob-1"></div>
        <div className="teacher-login-blob blob-2"></div>
        <div className="teacher-login-blob blob-3"></div>
      </div>

      <div className="teacher-login-content">
        <Button 
          type="text" 
          className="teacher-back-button"
          onClick={() => navigate('/')}
          icon={<ArrowLeftOutlined />}
        >
          Back to Home
        </Button>

        <div className="teacher-login-box">
          <div className="teacher-login-header">
            <h1>Teacher Login</h1>
            <p>Welcome! Access your teaching dashboard</p>
          </div>

          {error && (
            <Alert 
              message="Login Error" 
              description={error} 
              type="error" 
              showIcon
              closable
              className="teacher-login-alert"
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            className="teacher-login-form"
          >
            <Form.Item
              name="employeeId"
              rules={[
                { required: true, message: 'Please enter your employee ID' },
              ]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Employee ID" 
                prefix={<UserOutlined className="input-icon" />}
                className="teacher-login-input"
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
                className="teacher-login-input"
                size="large"
              />
            </Form.Item>

            <div className="teacher-login-options">
              <Link to="/forgot-password" className="teacher-forgot-password">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="teacher-login-button"
              size="large"
              block
            >
              Sign In
            </Button>
          </Form>

          <Divider className="teacher-login-divider">or</Divider>

          <div className="teacher-login-roles">
            <p className="teacher-roles-title">Login as:</p>
            <div className="teacher-roles-links">
              <Link to="/login" className="teacher-role-link">Student Login</Link>
              <span className="teacher-role-separator">•</span>
              <Link to="/admin/login" className="teacher-role-link">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
