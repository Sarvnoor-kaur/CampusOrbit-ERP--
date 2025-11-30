import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card } from 'antd';
import { LoginOutlined, UserAddOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ERP System</h1>
          <div className="space-x-2">
            <Button 
              type="primary" 
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Student Login
            </Button>
            <Button 
              onClick={() => navigate('/teacher/login')}
            >
              Teacher Login
            </Button>
            <Button 
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Educational Management System
          </h2>
          <p className="text-xl text-gray-600">
            Streamlined admission, learning, and administration for modern institutions
          </p>
        </div>

        <Row gutter={[24, 24]} className="mb-16">
          <Col xs={24} sm={12} md={8}>
            <Card className="h-full hover:shadow-lg transition">
              <div className="text-center">
                <UserAddOutlined className="text-4xl text-blue-600 mb-4 block" />
                <h3 className="text-xl font-semibold mb-2">Students</h3>
                <p className="text-gray-600 mb-4">Register, apply for admission, and manage your academics</p>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/register')}
                  block
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Register Now
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card className="h-full hover:shadow-lg transition">
              <div className="text-center">
                <TeamOutlined className="text-4xl text-green-600 mb-4 block" />
                <h3 className="text-xl font-semibold mb-2">Teachers</h3>
                <p className="text-gray-600 mb-4">Manage classes, assignments, and student progress</p>
                <Button 
                  onClick={() => navigate('/teacher/login')}
                  block
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Login
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card className="h-full hover:shadow-lg transition">
              <div className="text-center">
                <DashboardOutlined className="text-4xl text-purple-600 mb-4 block" />
                <h3 className="text-xl font-semibold mb-2">Administrators</h3>
                <p className="text-gray-600 mb-4">Manage admissions, users, and system settings</p>
                <Button 
                  onClick={() => navigate('/admin/login')}
                  block
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Login
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="mb-16 bg-indigo-50 border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <FileTextOutlined className="text-2xl text-indigo-600 mb-2 block" />
                <h4 className="font-semibold text-gray-900">Admissions</h4>
                <p className="text-gray-600 text-sm">Streamlined application and approval process</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <DashboardOutlined className="text-2xl text-indigo-600 mb-2 block" />
                <h4 className="font-semibold text-gray-900">Dashboards</h4>
                <p className="text-gray-600 text-sm">Role-based personalized interfaces</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <LoginOutlined className="text-2xl text-indigo-600 mb-2 block" />
                <h4 className="font-semibold text-gray-900">Security</h4>
                <p className="text-gray-600 text-sm">JWT-based authentication and authorization</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <UserAddOutlined className="text-2xl text-indigo-600 mb-2 block" />
                <h4 className="font-semibold text-gray-900">Management</h4>
                <p className="text-gray-600 text-sm">Complete user and resource management</p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 ERP Student Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
