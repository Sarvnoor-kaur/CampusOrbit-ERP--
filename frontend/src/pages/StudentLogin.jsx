import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../utils/api';

const StudentLogin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-6 left-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Student Login</h1>
          <p className="text-gray-600">Access your student dashboard</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          {error && (
            <div className="mb-4">
              <Alert message={error} type="error" showIcon />
            </div>
          )}
          <Form.Item
            name="admissionNumber"
            rules={[
              { required: true, message: 'Please enter your admission number' },
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: 'Please enter a valid admission number (letters and numbers only)',
              },
            ]}
            label="Admission Number"
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="e.g., ADM2024001"
              size="large"
              className="rounded"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
            label="Password"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              size="large"
              className="rounded"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will receive your admission number via email after admin approval.
            </p>
          </div>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
            size="large"
            className="bg-indigo-600 hover:bg-indigo-700 rounded"
          >
            Login
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
            >
              Create account
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Not a student? 
            <button 
              onClick={() => navigate('/teacher/login')} 
              className="text-indigo-600 hover:text-indigo-700 ml-1"
            >
              Teacher Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
