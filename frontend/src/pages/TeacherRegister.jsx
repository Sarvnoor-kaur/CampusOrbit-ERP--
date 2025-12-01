import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, Alert, Select, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '../utils/api';
import './TeacherRegister.css';

const { Option } = Select;

const TeacherRegister = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
    
    fetchDepartments();
  }, [navigate]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

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
      const response = await api.post('/auth/register-teacher', {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        mobile: values.mobile.trim(),
        password: values.password,
        department: values.department,
        qualification: values.qualification.trim(),
      });

      if (response.data.success) {
        message.success('Registration successful! Please login with your credentials.');
        navigate('/teacher/login');
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
    <div className="teacher-register-container">
      <div className="teacher-register-background">
        <div className="teacher-register-blob blob-1"></div>
        <div className="teacher-register-blob blob-2"></div>
        <div className="teacher-register-blob blob-3"></div>
      </div>

      <div className="teacher-register-content">
        <Button 
          type="text" 
          className="teacher-back-button-register"
          onClick={() => navigate('/')}
          icon={<ArrowLeftOutlined />}
        >
          Back to Home
        </Button>

        <div className="teacher-register-box">
          <div className="teacher-register-header">
            <h1>Teacher Registration</h1>
            <p>Join our teaching team today</p>
          </div>

          {error && (
            <Alert 
              message="Registration Error" 
              description={error} 
              type="error" 
              showIcon
              closable
              className="teacher-register-alert"
              onClose={() => setError('')}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            className="teacher-register-form"
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
                className="teacher-register-input"
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
                className="teacher-register-input"
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
                className="teacher-register-input"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="department"
              rules={[
                { required: true, message: 'Please select a department' },
              ]}
              className="form-item-custom"
            >
              <Select 
                placeholder="Select Department" 
                className="teacher-register-select"
                size="large"
              >
                {departments.map((dept) => (
                  <Option key={dept._id} value={dept._id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="qualification"
              rules={[
                { required: true, message: 'Please enter your qualification' },
              ]}
              className="form-item-custom"
            >
              <Input 
                placeholder="Qualification (e.g., M.Tech, M.Sc)" 
                className="teacher-register-input"
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
                className="teacher-register-input"
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
                className="teacher-register-input"
                size="large"
              />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="teacher-register-button"
              size="large"
              block
            >
              Create Account
            </Button>
          </Form>

          <Divider className="teacher-register-divider">or</Divider>

          <div className="teacher-register-footer">
            <p>Already have an account? <Link to="/teacher/login" className="teacher-login-link">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
