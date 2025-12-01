import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Alert, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '../utils/api';
import './StudentRegister.css';

const StudentRegister = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.applicationSubmitted !== false) {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const validateMobile = (_, value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value) {
      return Promise.reject('Please input your mobile number');
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject('Please enter a valid 10-digit mobile number');
    }
    return Promise.resolve();
  };

  const validatePassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject('The two passwords do not match');
    },
  });

  const handleRegister = async (values) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register-student', {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        mobile: values.mobile.trim(),
        password: values.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        message.success('Registration successful! Redirecting to home.');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-register-container">
      <div className="register-background">
        <div className="register-blob blob-1"></div>
        <div className="register-blob blob-2"></div>
        <div className="register-blob blob-3"></div>
      </div>

      <div className="register-content">
        <Button 
          type="text" 
          className="back-button"
          onClick={() => navigate('/')}
          icon={<ArrowLeftOutlined />}
        >
          Back to Home
        </Button>

        <div className="register-box">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join our educational platform today</p>
          </div>

          {error && (
            <Alert 
              message="Registration Error" 
              description={error} 
              type="error" 
              showIcon
              closable
              className="register-alert"
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            className="register-form"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please enter your full name' },
                { min: 3, message: 'Name must be at least 3 characters' },
              ]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Full Name" 
                prefix={<UserOutlined className="input-icon" />}
                className="register-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Email Address" 
                prefix={<MailOutlined className="input-icon" />}
                className="register-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              rules={[{ validator: validateMobile }]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Mobile Number (10 digits)" 
                prefix={<PhoneOutlined className="input-icon" />}
                className="register-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
              className="form-item-custom"
            >
              <Input.Password 
                placeholder="Password" 
                prefix={<LockOutlined className="input-icon" />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="register-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
              className="form-item-custom"
            >
              <Input.Password 
                placeholder="Confirm Password" 
                prefix={<LockOutlined className="input-icon" />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="register-input"
                size="large"
              />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="register-button"
              size="large"
              block
            >
              Create Account
            </Button>
          </Form>

          <Divider className="register-divider">or</Divider>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
