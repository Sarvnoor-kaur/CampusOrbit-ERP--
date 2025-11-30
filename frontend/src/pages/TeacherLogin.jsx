import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const TeacherLogin = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login-teacher', {
        employeeId: values.employeeId,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="absolute top-6 left-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="text-green-600 hover:text-green-700"
        >
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Teacher Login</h1>
          <p className="text-gray-600">Access your teaching dashboard</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="employeeId"
            rules={[
              { required: true, message: 'Please enter your Teacher ID' }
            ]}
            label="Teacher ID"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="TCH123456"
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
            className="bg-green-600 hover:bg-green-700 rounded"
          >
            Login
          </Button>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            Not a teacher? 
            <button 
              onClick={() => navigate('/login')} 
              className="text-green-600 hover:text-green-700 ml-1"
            >
              Student Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
