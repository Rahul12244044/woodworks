// app/admin/contact-messages/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      }).toString();

      const response = await fetch(`/api/admin/contact-messages?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const response = await fetch('/api/admin/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          status: newStatus
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, status: newStatus } : msg
        ));
        
        if (selectedMessage?._id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
      } else {
        alert(data.error || 'Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message status');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusCount = (status) => {
    if (filters.status === 'all') {
      // In a real app, you might want to fetch this from the API
      return messages.filter(msg => msg.status === status).length;
    }
    return 0;
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading contact messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-gray-600 mt-2">
                Manage customer inquiries and feedback
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMessages}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{getStatusCount('new')}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{getStatusCount('replied')}</div>
              <div className="text-sm text-gray-600">Replied</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount('archived')}</div>
              <div className="text-sm text-gray-600">Archived</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or message..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="createdAt">Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No contact messages found
                        </td>
                      </tr>
                    ) : (
                      messages.map((message) => (
                        <tr 
                          key={message._id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{message.name}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium truncate max-w-xs">
                              {message.subject}
                            </div>
                            {message.woodType && (
                              <div className="text-xs text-gray-500 mt-1">
                                Wood: {message.woodType}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(message.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing page {filters.page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                    disabled={filters.page >= pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Message Details */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">From</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                    <p className="font-medium text-gray-900">{selectedMessage.subject}</p>
                    {selectedMessage.woodType && (
                      <p className="text-sm text-gray-600 mt-1">
                        Wood Type: {selectedMessage.woodType}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {selectedMessage.ipAddress && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Technical Info</h3>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>IP: {selectedMessage.ipAddress}</p>
                        {selectedMessage.userAgent && (
                          <p className="truncate">Browser: {selectedMessage.userAgent}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['new', 'read', 'replied', 'archived'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateMessageStatus(selectedMessage._id, status)}
                          disabled={selectedMessage.status === status}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedMessage.status === status
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedMessage.email)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Copy email"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <div className="text-gray-400 text-4xl mb-4">📨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                <p className="text-gray-600">
                  Click on a message from the list to view its details and manage it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}