import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, DatePicker, Select, Row, Col, Divider, Upload, Modal } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';
import './ApplicationFormPage.css';

const ApplicationFormPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user || user.applicationSubmitted === true) {
      message.error('Please register first');
      navigate('/register');
    }
  }, [user, navigate]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log('Form values:', values);

      const payload = {
        personalDetails: {
          firstName: user?.name.split(' ')[0] || 'Student',
          lastName: user?.name.split(' ').slice(1).join(' ') || 'N/A',
          email: user?.email,
          phone: values.phone,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
          gender: values.gender || 'Not Specified',
          bloodGroup: values.bloodGroup || 'Not Specified',
          category: values.category || 'General',
          nationality: values.nationality || 'Indian',
        },
        guardianDetails: {
          fatherName: values.fatherName || 'Not Provided',
          fatherPhone: values.fatherPhone || 'Not Provided',
          motherName: values.motherName || 'Not Provided',
          motherPhone: values.motherPhone || 'Not Provided',
          primaryGuardian: values.primaryGuardian || 'Father',
          guardianPhone: values.guardianPhone || values.fatherPhone || 'Not Provided',
          guardianEmail: values.guardianEmail || 'Not Provided',
          address: values.address || 'Not Provided',
        },
        academicDetails: {
          tenthMarks: values.tenthMarks || 0,
          twelthMarks: values.twelthMarks || 0,
          previousSchool: values.previousSchool || 'Not Provided',
          previousBoard: values.previousBoard || 'Not Specified',
          percentage: values.percentage || 0,
        },
      };

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await api.post('/admissions/submit-application', payload);

      console.log('Response from server:', response.data);

      if (response.data.success) {
        message.success('Application submitted successfully! Admin will review and notify you.');
        form.resetFields();
        setFileList([]);
        
        // Update user's application status in local storage
        const updatedUser = { ...user, applicationSubmitted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        Modal.success({
          title: 'Application Submitted Successfully',
          content: (
            <div>
              <p><strong>Your application has been submitted for review.</strong></p>
              <p style={{ marginTop: '15px', color: '#666' }}>
                Our admin team will review your application and send you an approval email with your <strong>Admission Number</strong> and login credentials.
              </p>
              <p style={{ marginTop: '15px', marginBottom: '0px', color: '#999', fontSize: '12px' }}>
                Expected review time: 1-3 business days
              </p>
            </div>
          ),
          okText: 'Continue to Home',
          onOk() {
            navigate('/');
          },
        });
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      let errorMessage = 'Failed to submit application form';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to submit this form.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid form data. Please check your inputs.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        errorMessage = error.message || 'Error setting up request';
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="application-form-container">
      <div className="application-background">
        <div className="application-blob blob-1"></div>
        <div className="application-blob blob-2"></div>
        <div className="application-blob blob-3"></div>
      </div>

      <Link to="/register" className="application-back-button">
        <ArrowLeftOutlined style={{ marginRight: '8px' }} />
        Back to Register
      </Link>

      <div className="application-content">
        <div className="application-box">
          <div className="application-header">
            <h1>Complete Your Application</h1>
            <p>Phase 2: Detailed Application Form</p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider>Personal Details</Divider>

          <Form.Item>
            <Input
              disabled
              prefix={<UserOutlined />}
              placeholder="Full Name"
              value={user?.name}
            />
          </Form.Item>

          <Form.Item>
            <Input
              disabled
              prefix={<MailOutlined />}
              placeholder="Email Address"
              type="email"
              value={user?.email}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number (10 digits)"
              maxLength="10"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dob"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker placeholder="Date of Birth" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="gender">
                <Select placeholder="Gender">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="category">
                <Select placeholder="Category">
                  <Select.Option value="General">General</Select.Option>
                  <Select.Option value="SC">SC (Scheduled Caste)</Select.Option>
                  <Select.Option value="ST">ST (Scheduled Tribe)</Select.Option>
                  <Select.Option value="OBC">OBC</Select.Option>
                  <Select.Option value="EWS">EWS</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="bloodGroup">
                <Select placeholder="Blood Group">
                  <Select.Option value="A+">A+</Select.Option>
                  <Select.Option value="A-">A-</Select.Option>
                  <Select.Option value="B+">B+</Select.Option>
                  <Select.Option value="B-">B-</Select.Option>
                  <Select.Option value="AB+">AB+</Select.Option>
                  <Select.Option value="AB-">AB-</Select.Option>
                  <Select.Option value="O+">O+</Select.Option>
                  <Select.Option value="O-">O-</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="nationality">
            <Input placeholder="Nationality" />
          </Form.Item>

          <Divider>Guardian Details</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="fatherName">
                <Input placeholder="Father's Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="fatherPhone">
                <Input placeholder="Father's Phone" maxLength="10" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="motherName">
                <Input placeholder="Mother's Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="motherPhone">
                <Input placeholder="Mother's Phone" maxLength="10" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="primaryGuardian">
                <Input placeholder="Primary Guardian Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="guardianPhone">
                <Input placeholder="Guardian Phone" maxLength="10" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="guardianEmail">
            <Input placeholder="Guardian Email" type="email" />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input.TextArea placeholder="Complete Address" rows={3} />
          </Form.Item>

          <Divider>Academic Details</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tenthMarks"
                rules={[{ required: true, message: 'Please enter 10th marks' }]}
              >
                <Input placeholder="10th Marks/Percentage" type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="twelthMarks"
                rules={[{ required: true, message: 'Please enter 12th marks' }]}
              >
                <Input placeholder="12th Marks/Percentage" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="previousSchool">
            <Input placeholder="Previous School/College Name" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="previousBoard">
                <Input placeholder="Board/University" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="percentage">
                <Input placeholder="Previous Percentage/CGPA" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Documents</Divider>

          <Form.Item>
            <Upload
              name="documents"
              fileList={fileList}
              onChange={handleFileChange}
              multiple
            >
              <Button icon={<UploadOutlined />}>
                Upload Documents (Photo, Signature, Marksheets, ID Proof)
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} size="large" className="application-submit-button">
            Submit Application
          </Button>
        </Form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormPage;
