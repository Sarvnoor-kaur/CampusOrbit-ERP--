import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, DatePicker, Select } from 'antd';
import { FileTextOutlined, EyeOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const AdminAttendancePanel = ({ user }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { attendance: [] } }));
      
      setAttendanceRecords(response.data.attendance || []);
      setStats({
        total: response.data.attendance?.length || 0,
        present: response.data.attendance?.filter(a => a.status === 'present').length || 0,
        absent: response.data.attendance?.filter(a => a.status === 'absent').length || 0,
        leave: response.data.attendance?.filter(a => a.status === 'leave').length || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch =
      record.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      record.admissionNumber?.includes(search) ||
      record.subject?.toLowerCase().includes(search.toLowerCase());
    
    const matchesDate = !dateFilter || 
      dayjs(record.date).format('YYYY-MM-DD') === dateFilter.format('YYYY-MM-DD');
    
    const matchesType = typeFilter === 'all' || record.status === typeFilter;
    
    return matchesSearch && matchesDate && matchesType;
  });

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'leave': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Monitor and manage student attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-gray-600 mt-2">Total Records</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{stats.present}</p>
            <p className="text-gray-600 mt-2">Present</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600">{stats.absent}</p>
            <p className="text-gray-600 mt-2">Absent</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-amber-600">{stats.leave}</p>
            <p className="text-gray-600 mt-2">Leave</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search by student name or admission number..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <DatePicker
            placeholder="Filter by date"
            value={dateFilter}
            onChange={setDateFilter}
            style={{ width: '100%' }}
          />
          <Select
            placeholder="Filter by status"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Present', value: 'present' },
              { label: 'Absent', value: 'absent' },
              { label: 'Leave', value: 'leave' },
            ]}
          />
          <Button type="primary" icon={<DownloadOutlined />} className="bg-blue-600">
            Export Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Admission No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {dayjs(record.date).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">{record.admissionNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{record.studentName}</td>
                    <td className="px-4 py-3 text-gray-600">{record.subject || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded font-semibold text-sm ${getStatusColor(record.status)}`}>
                        {record.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">
            Showing {paginatedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length}
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredRecords.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        title="Attendance Record Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-semibold text-gray-900">
                  {dayjs(selectedRecord.date).format('DD/MM/YYYY')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`font-semibold text-sm px-2 py-1 rounded inline ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status?.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Admission Number</p>
                <p className="font-semibold text-gray-900">{selectedRecord.admissionNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Student Name</p>
                <p className="font-semibold text-gray-900">{selectedRecord.studentName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Subject</p>
                <p className="font-semibold text-gray-900">{selectedRecord.subject || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Remarks</p>
                <p className="font-semibold text-gray-900">{selectedRecord.remarks || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAttendancePanel;
