import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const AdminLogin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login-admin', {
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        message.success('Login successful');
        navigate('/dashboard');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="absolute top-6 left-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="text-purple-600 hover:text-purple-700"
        >
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access the administration panel</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' }
            ]}
            label="Email Address"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="admin@school.com"
              size="large"
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            label="Password"
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Enter your password"
              size="large"
              className="rounded"
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
            size="large"
            className="bg-purple-600 hover:bg-purple-700 rounded"
          >
            Login
          </Button>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Not an admin? 
            <button 
              onClick={() => navigate('/login')} 
              className="text-purple-600 hover:text-purple-700 ml-1"
            >
              Student Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
