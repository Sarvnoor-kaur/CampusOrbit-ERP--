import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminSubjectsPage = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { subjects: [] } }));
      
      setSubjects(response.data.subjects || []);
      setStats({
        total: response.data.subjects?.length || 0,
        active: response.data.subjects?.filter(s => s.status === 'active').length || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subjectId) => {
    Modal.confirm({
      title: 'Delete Subject',
      content: 'Are you sure you want to delete this subject? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/subjects/${subjectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
          message.success('Subject deleted successfully');
          fetchSubjects();
        } catch (error) {
          message.error('Failed to delete subject');
        }
      },
    });
  };

  const filteredSubjects = subjects.filter(s =>
    s.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
    s.subjectCode?.includes(search) ||
    s.course?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subject Management</h1>
        <p className="text-gray-600">Create and manage academic subjects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-gray-600 mt-2">Total Subjects</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{stats.active}</p>
            <p className="text-gray-600 mt-2">Active Subjects</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Subjects List</h2>
          <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600">
            Add Subject
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by subject name, code, or course..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            size="large"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubjects.length > 0 ? (
                paginatedSubjects.map((subject, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-semibold">{subject.subjectCode}</td>
                    <td className="px-4 py-3 text-gray-900">{subject.subjectName}</td>
                    <td className="px-4 py-3 text-gray-600">{subject.course || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{subject.credits || '-'}</td>
                    <td className="px-4 py-3">
                      <Tag color={subject.status === 'active' ? 'green' : 'default'}>
                        {subject.status?.toUpperCase() || 'ACTIVE'}
                      </Tag>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSubject(subject);
                          setModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </button>
                      <button className="text-amber-600 hover:text-amber-800">
                        <EditOutlined className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteOutlined className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">
            Showing {paginatedSubjects.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredSubjects.length)} of {filteredSubjects.length}
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredSubjects.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        title="Subject Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedSubject && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Subject Code</p>
                <p className="font-semibold text-gray-900">{selectedSubject.subjectCode}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-gray-900">
                  <Tag color={selectedSubject.status === 'active' ? 'green' : 'default'}>
                    {selectedSubject.status?.toUpperCase() || 'ACTIVE'}
                  </Tag>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Subject Name</p>
                <p className="font-semibold text-gray-900">{selectedSubject.subjectName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Course</p>
                <p className="font-semibold text-gray-900">{selectedSubject.course || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Credits</p>
                <p className="font-semibold text-gray-900">{selectedSubject.credits || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Description</p>
                <p className="font-semibold text-gray-900">{selectedSubject.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSubjectsPage;
