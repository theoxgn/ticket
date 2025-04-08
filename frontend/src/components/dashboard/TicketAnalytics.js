import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

const TicketAnalytics = ({ tickets }) => {
  const [ticketsByStatus, setTicketsByStatus] = useState([]);
  const [ticketsByPriority, setTicketsByPriority] = useState([]);
  const [ticketsByType, setTicketsByType] = useState([]);
  const [ticketTrend, setTicketTrend] = useState([]);
  
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      // Process tickets by status
      const statusMap = tickets.reduce((acc, ticket) => {
        const status = ticket.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
      const statusData = Object.keys(statusMap).map(status => ({
        name: getStatusLabel(status),
        value: statusMap[status],
        color: getStatusColor(status)
      }));
      
      setTicketsByStatus(statusData);
      
      // Process tickets by priority
      const priorityMap = tickets.reduce((acc, ticket) => {
        const priority = ticket.priority;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});
      
      const priorityData = Object.keys(priorityMap).map(priority => ({
        name: getPriorityLabel(priority),
        value: priorityMap[priority],
        color: getPriorityColor(priority)
      }));
      
      setTicketsByPriority(priorityData);
      
      // Process tickets by type
      const typeMap = tickets.reduce((acc, ticket) => {
        const type = ticket.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      const typeData = Object.keys(typeMap).map(type => ({
        name: getTypeLabel(type),
        value: typeMap[type],
        color: getTypeColor(type)
      }));
      
      setTicketsByType(typeData);
      
      // Generate ticket trend data (simulated for demo)
      // In a real app, you would get this from your API
      generateTicketTrendData();
    }
  }, [tickets]);
  
  const generateTicketTrendData = () => {
    // This is simulated data - in a real app this would come from your backend
    const trendData = [
      { name: 'Jan', open: 4, closed: 2 },
      { name: 'Feb', open: 6, closed: 4 },
      { name: 'Mar', open: 8, closed: 5 },
      { name: 'Apr', open: 10, closed: 8 },
      { name: 'May', open: 7, closed: 11 },
      { name: 'Jun', open: 9, closed: 7 },
    ];
    
    setTicketTrend(trendData);
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'code_review': return 'Code Review';
      case 'testing': return 'Testing';
      case 'closed': return 'Closed';
      default: return status;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return '#f59e0b'; // amber
      case 'in_progress': return '#3b82f6'; // blue
      case 'code_review': return '#8b5cf6'; // purple
      case 'testing': return '#10b981'; // green
      case 'closed': return '#6b7280'; // gray
      default: return '#d1d5db'; // light gray
    }
  };
  
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'highest': return 'Highest';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      case 'lowest': return 'Lowest';
      default: return priority;
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'highest': return '#ef4444'; // red
      case 'high': return '#f59e0b'; // amber
      case 'medium': return '#3b82f6'; // blue
      case 'low': return '#10b981'; // green
      case 'lowest': return '#6b7280'; // gray
      default: return '#d1d5db'; // light gray
    }
  };
  
  const getTypeLabel = (type) => {
    switch(type) {
      case 'bug': return 'Bug';
      case 'feature': return 'Feature';
      case 'improvement': return 'Improvement';
      case 'task': return 'Task';
      default: return type;
    }
  };
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'bug': return '#ef4444'; // red
      case 'feature': return '#3b82f6'; // blue
      case 'improvement': return '#8b5cf6'; // purple
      case 'task': return '#10b981'; // green
      default: return '#d1d5db'; // light gray
    }
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="text-gray-700 font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tickets by Status */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Tickets by Status</h3>
          {ticketsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No ticket data available</p>
            </div>
          )}
        </div>
        
        {/* Tickets by Priority */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Tickets by Priority</h3>
          {ticketsByPriority.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ticketsByPriority}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value">
                  {ticketsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No ticket data available</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Type */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Tickets by Type</h3>
          {ticketsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No ticket data available</p>
            </div>
          )}
        </div>
        
        {/* Tickets Trend */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Tickets Trend Over Time</h3>
          {ticketTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={ticketTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="open" 
                  name="Opened Tickets" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="closed" 
                  name="Closed Tickets" 
                  stroke="#10b981" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No ticket trend data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalytics;