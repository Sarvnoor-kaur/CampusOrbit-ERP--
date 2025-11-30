import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message, DatePicker, Select, Row, Col, Divider, Upload } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';

const AdmissionForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const nameParts = values.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Student';

      const payload = {
        personalDetails: {
          firstName,
          lastName,
          email: values.email,
          phone: values.phone,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
          gender: values.gender,
          bloodGroup: values.bloodGroup,
          nationality: values.nationality,
        },
        guardianDetails: {
          fatherName: values.fatherName,
          fatherPhone: values.fatherPhone,
          motherName: values.motherName,
          motherPhone: values.motherPhone,
          primaryGuardian: values.primaryGuardian,
          guardianPhone: values.guardianPhone,
          guardianEmail: values.guardianEmail,
          address: values.address,
        },
        academicDetails: {
          batch: values.batch,
          previousSchool: values.previousSchool,
          previousBoard: values.previousBoard,
          percentage: values.percentage,
        },
      };

      const response = await axios.post('/api/admissions/submit', payload);

      if (response.data.success) {
        message.success(response.data.message);
        form.resetFields();
        setFileList([]);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit admission form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form" style={{ maxWidth: '700px' }}>
        <div className="register-header">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="back-button"
          >
            Back
          </Button>
          <h1>Admission Form</h1>
          <p>Fill in your details to apply for admission</p>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider>Personal Details</Divider>

          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email Address"
              type="email"
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
            <Col xs={24} sm={12}>
              <Form.Item name="nationality">
                <Input placeholder="Nationality" />
              </Form.Item>
            </Col>
          </Row>

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

          <Form.Item
            name="batch"
            rules={[{ required: true, message: 'Please select a batch' }]}
          >
            <Select placeholder="Select Batch/Year">
              <Select.Option value="2025">2025</Select.Option>
              <Select.Option value="2026">2026</Select.Option>
              <Select.Option value="2027">2027</Select.Option>
            </Select>
          </Form.Item>

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
                Upload Documents (ID Card, Certificate, Marksheet)
              </Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} size="large">
            Submit Admission Form
          </Button>
        </Form>

        <p style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <a onClick={() => navigate('/login')} style={{ color: '#667eea', cursor: 'pointer', fontWeight: 500 }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdmissionForm;
