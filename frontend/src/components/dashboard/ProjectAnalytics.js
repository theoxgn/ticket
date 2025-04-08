import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, 
  AreaChart, RadialBarChart, RadialBar
} from 'recharts';

const ProjectAnalytics = ({ projects, tickets }) => {
  const [projectProgress, setProjectProgress] = useState([]);
  const [projectMemberDistribution, setProjectMemberDistribution] = useState([]);
  const [projectTicketsDistribution, setProjectTicketsDistribution] = useState([]);
  const [projectActivityTimeline, setProjectActivityTimeline] = useState([]);
  
  useEffect(() => {
    if (projects && projects.length > 0 && tickets && tickets.length > 0) {
      processProjectData();
    }
  }, [projects, tickets]);
  
  const processProjectData = () => {
    // Calculate project progress (simulated data)
    const progressData = projects.slice(0, 5).map(project => {
      // Random progress percentage between 10 and 100
      const progress = Math.floor(Math.random() * 90) + 10;
      return {
        name: project.name,
        progress: progress,
        color: getProgressColor(progress)
      };
    });
    setProjectProgress(progressData);
    
    // Calculate member distribution across projects
    const memberData = projects.slice(0, 5).map(project => ({
      name: project.name,
      value: project.members?.length || 0,
      color: getRandomColor(project.id)
    }));
    setProjectMemberDistribution(memberData);
    
    // Calculate tickets distribution across projects
    const ticketCountByProject = {};
    tickets.forEach(ticket => {
      if (ticket.projectId) {
        ticketCountByProject[ticket.projectId] = (ticketCountByProject[ticket.projectId] || 0) + 1;
      }
    });
    
    const ticketDistribution = projects.slice(0, 5).map(project => ({
      name: project.name,
      value: ticketCountByProject[project.id] || 0,
      color: getRandomColor(project.id + 10) // Offset to get different colors
    }));
    setProjectTicketsDistribution(ticketDistribution);
    
    // Generate project activity timeline (simulated)
    generateActivityTimeline();
  };
  
  const generateActivityTimeline = () => {
    // Simulated data for project activity over time
    const timelineData = [
      { name: 'Week 1', active: 3, completed: 1 },
      { name: 'Week 2', active: 4, completed: 2 },
      { name: 'Week 3', active: 5, completed: 2 },
      { name: 'Week 4', active: 4, completed: 3 },
      { name: 'Week 5', active: 6, completed: 3 },
      { name: 'Week 6', active: 7, completed: 4 },
    ];
    
    setProjectActivityTimeline(timelineData);
  };
  
  const getProgressColor = (progress) => {
    if (progress < 30) return '#ef4444';  // red
    if (progress < 70) return '#f59e0b';  // amber
    return '#10b981';  // green
  };
  
  const getRandomColor = (seed) => {
    // Simple color generation based on seed
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#14b8a6', // teal
      '#f43f5e', // rose
    ];
    
    return colors[seed % colors.length];
  };
  
  // Custom tooltip
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
        {/* Project Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Project Progress</h3>
          {projectProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={projectProgress}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="progress" name="Completion %" radius={[0, 10, 10, 0]}>
                  {projectProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No project data available</p>
            </div>
          )}
        </div>
        
        {/* Project Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Project Activity Timeline</h3>
          {projectActivityTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={projectActivityTimeline}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  name="Active Projects" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#93c5fd" 
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  name="Completed Projects" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#6ee7b7" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No activity data available</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Member Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Team Members by Project</h3>
          {projectMemberDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectMemberDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectMemberDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No member data available</p>
            </div>
          )}
        </div>
        
        {/* Project Tickets Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-md font-medium text-secondary-800 mb-4">Tickets by Project</h3>
          {projectTicketsDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                innerRadius="20%" 
                outerRadius="80%" 
                data={projectTicketsDistribution}
                startAngle={180} 
                endAngle={0}
                cx="50%" 
                cy="50%"
              >
                <RadialBar 
                  minAngle={15} 
                  label={{ fill: '#666', position: 'insideStart' }} 
                  background 
                  clockWise={true} 
                  dataKey="value" 
                  nameKey="name"
                >
                  {projectTicketsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Legend iconSize={10} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-secondary-500">No ticket distribution data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;