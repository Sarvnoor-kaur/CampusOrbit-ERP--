import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Select, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Option } = Select;

const Register = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
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
        courseApplyingFor: values.courseApplyingFor,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        message.success('Account created successfully! Please complete your application form.');
        setTimeout(() => navigate('/application-form'), 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    'B.Tech Computer Science',
    'B.Tech Mechanical',
    'B.Tech Electrical',
    'B.Tech Civil',
    'B.Tech Electronics',
    'BBA',
    'MBA',
    'BCA',
    'MCA',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="glass-card">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="back-btn"
          >
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-gray-400 text-center mb-8">
            Register now • Complete your admission form in the next step
          </p>

          {error && (
            <div className="mb-6">
              <Alert message={error} type="error" showIcon />
            </div>
          )}

          <Form
            form={form}
            onFinish={handleRegister}
            className="space-y-6"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label={<span className="text-white font-medium">Full Name</span>}
              rules={[
                { required: true, message: 'Please input your full name' },
                { min: 3, message: 'Name must be at least 3 characters' },
                { max: 50, message: 'Name cannot be longer than 50 characters' },
              ]}
              hasFeedback
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="John Doe"
                size="large"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-white font-medium">Email Address</span>}
              rules={[
                { required: true, message: 'Please input your email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
              hasFeedback
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="john@example.com"
                size="large"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg"
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              label={<span className="text-white font-medium">Mobile Number</span>}
              rules={[{ validator: validateMobile }]}
              hasFeedback
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="9876543210"
                size="large"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg"
                maxLength={10}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-white font-medium">Password</span>}
              rules={[
                { required: true, message: 'Please input your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 30, message: 'Password cannot be longer than 30 characters' },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                size="large"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-white font-medium">Confirm Password</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                validatePassword,
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                size="large"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="courseApplyingFor"
              label={<span className="text-white font-medium">Course Applying For</span>}
              rules={[{ required: true, message: 'Please select a course' }]}
              hasFeedback
            >
              <Select
                placeholder="Select a course"
                size="large"
                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg"
                dropdownClassName="bg-gray-800 border-gray-700 text-white"
              >
                {courses.map((course) => (
                  <Option key={course} value={course} className="text-white hover:bg-gray-700">
                    {course}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 border-none h-12 text-lg font-medium rounded-lg"
                loading={loading}
                size="large"
              >
                Create Account
              </Button>
            </Form.Item>

            <div className="text-center mt-6">
              <span className="text-gray-400">Already have an account? </span>
              <Button
                type="link"
                className="p-0 text-indigo-400 hover:text-indigo-300 font-medium"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <style jsx global>{`
        .ant-input,
        .ant-input-password,
        .ant-select-selector {
          background: transparent !important;
          border: 1.8px solid rgba(100, 110, 250, 0.5) !important;
          color: white !important;
          border-radius: 12px !important;
          height: 48px !important;
          font-size: 15px !important;
        }

        .ant-input-password .ant-input {
          height: 100% !important;
          border: none !important;
          box-shadow: none !important;
        }

        .ant-input::placeholder {
          color: #94a3b8 !important;
        }

        .ant-input:focus,
        .ant-input-password:focus,
        .ant-select-focused .ant-select-selector {
          border-color: #818cf8 !important;
          box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.2) !important;
          background: rgba(30, 40, 80, 0.3) !important;
        }

        .ant-form-item-label > label {
          color: white !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }

        .ant-input-prefix {
          color: #818cf8 !important;
          margin-right: 10px !important;
        }

        .ant-select-arrow {
          color: #818cf8 !important;
        }

        .ant-select-selection-item {
          color: white !important;
        }

        .ant-select-dropdown {
          background: #1e293b !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          padding: 8px 0 !important;
        }

        .ant-select-item-option {
          color: white !important;
          padding: 10px 16px !important;
          border-radius: 6px !important;
          margin: 0 8px !important;
          width: calc(100% - 16px) !important;
        }

        .ant-select-item-option:hover {
          background: #2d3748 !important;
        }

        .ant-select-item-option-selected {
          background: #3b82f6 !important;
        }
      `}</style>
    </div>
  );
};

export default Register;