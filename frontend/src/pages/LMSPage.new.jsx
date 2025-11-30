import { useState } from 'react';
import { Row, Col, Card, Button, Typography, Tag, Input, message } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  SearchOutlined,
  RocketOutlined,
  LaptopOutlined,
  TrophyOutlined,
  MessageOutlined
} from '@ant-design/icons';
import './LMSPage.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Sample data for featured courses
const featuredCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    instructor: 'John Doe',
    image: 'https://picsum.photos/300/200?random=1',
    category: 'Web Development',
    students: 1245,
    rating: 4.8,
    lessons: 24,
    duration: '12 hours'
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    instructor: 'Jane Smith',
    image: 'https://picsum.photos/300/200?random=2',
    category: 'Programming',
    students: 987,
    rating: 4.7,
    lessons: 18,
    duration: '10 hours'
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Alex Johnson',
    image: 'https://picsum.photos/300/200?random=3',
    category: 'Design',
    students: 876,
    rating: 4.9,
    lessons: 15,
    duration: '8 hours'
  },
];

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography'
];

const LMSPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Section
  const HeroSection = () => (
    <div className="lms-hero">
      <div className="container">
        <Title level={1} style={{ color: 'white', marginBottom: 20 }}>
          Learn New Skills Online
        </Title>
        <Paragraph style={{ fontSize: '1.2rem', marginBottom: 30, maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Access 5,000+ online courses from top instructors & universities. Build skills with courses, certificates, and degrees online from world-class universities and companies.
        </Paragraph>
        <div className="search-container">
          <Search
            placeholder="What do you want to learn today?"
            enterButton={<Button type="primary" size="large"><SearchOutlined /> Search Courses</Button>}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={value => console.log('Search:', value)}
          />
        </div>
      </div>
    </div>
  );

  // Categories Section
  const CategoriesSection = () => (
    <div className="categories">
      {categories.map(category => (
        <Tag 
          key={category}
          className={`category-tag ${activeCategory === category ? 'active' : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Tag>
      ))}
    </div>
  );

  // Featured Courses Section
  const FeaturedCourses = () => (
    <div style={{ margin: '40px 0' }}>
      <Title level={2} style={{ marginBottom: 30 }}>Featured Courses</Title>
      <Row gutter={[24, 24]}>
        {featuredCourses.map(course => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <Card
              hoverable
              className="course-card"
              cover={
                <img
                  alt={course.title}
                  src={course.image}
                  className="course-image"
                />
              }
            >
              <div className="course-content">
                <div>
                  <Tag color="blue" style={{ marginBottom: 10 }}>{course.category}</Tag>
                  <Title level={4} className="course-title">{course.title}</Title>
                  <p className="course-instructor">By {course.instructor}</p>
                </div>
                <div className="course-meta">
                  <span><TeamOutlined /> {course.students}</span>
                  <span><ClockCircleOutlined /> {course.duration}</span>
                  <span><CheckCircleOutlined /> {course.rating}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // Features Section
  const FeaturesSection = () => (
    <div className="features-section">
      <div className="container">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>Why Choose Our Platform</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card">
              <RocketOutlined className="feature-icon" />
              <Title level={4}>Learn Anything</Title>
              <p>Explore any interest or trending topic, take prerequisites, and advance your skills</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card">
              <LaptopOutlined className="feature-icon" />
              <Title level={4}>Flexible Learning</Title>
              <p>Learn at your own pace, with lifetime access on mobile and desktop</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card">
              <TrophyOutlined className="feature-icon" />
              <Title level={4}>Expert Teachers</Title>
              <p>Learn from industry experts who are passionate about teaching</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="feature-card">
              <MessageOutlined className="feature-icon" />
              <Title level={4}>Community</Title>
              <p>Connect with a global community of learners and instructors</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );

  // Testimonials Section
  const TestimonialsSection = () => {
    const testimonials = [
      {
        id: 1,
        text: "This platform has completely transformed the way I learn. The courses are well-structured and the instructors are top-notch.",
        author: "Sarah Johnson",
        role: "Student",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: 2,
        text: "As an instructor, I find the platform incredibly easy to use and my students love the interactive features.",
        author: "Michael Chen",
        role: "Instructor",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    ];

    return (
      <div style={{ margin: '60px 0' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>What Our Students Say</Title>
        <Row gutter={[24, 24]}>
          {testimonials.map(testimonial => (
            <Col xs={24} md={12} key={testimonial.id}>
              <div className="testimonial-card">
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="testimonial-avatar"
                  />
                  <div>
                    <h4 className="testimonial-name">{testimonial.author}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="lms-container">
      <HeroSection />
      <div className="container" style={{ padding: '0 24px' }}>
        <CategoriesSection />
        <FeaturedCourses />
        <FeaturesSection />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default LMSPage;
