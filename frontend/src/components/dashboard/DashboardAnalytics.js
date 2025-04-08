import React, { useState } from 'react';
import { 
  FaChartLine, 
  FaChevronDown, 
  FaChevronUp, 
  FaTicketAlt, 
  FaProjectDiagram,
  FaLightbulb
} from 'react-icons/fa';
import TicketAnalytics from './TicketAnalytics';
import ProjectAnalytics from './ProjectAnalytics';

const DashboardAnalytics = ({ tickets, projects }) => {
  const [ticketAnalyticsExpanded, setTicketAnalyticsExpanded] = useState(true);
  const [projectAnalyticsExpanded, setProjectAnalyticsExpanded] = useState(true);

  const toggleTicketAnalytics = () => {
    setTicketAnalyticsExpanded(!ticketAnalyticsExpanded);
  };

  const toggleProjectAnalytics = () => {
    setProjectAnalyticsExpanded(!projectAnalyticsExpanded);
  };

  // Calculate some basic insights for the insights box
  const totalTickets = tickets?.length || 0;
  const openTickets = tickets?.filter(ticket => ticket.status === 'open')?.length || 0;
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(project => project.isActive)?.length || 0;

  return (
    <div className="mt-8">
      {/* Analytics Header with Insights Box */}
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 text-white">
          <div className="flex items-center mb-4">
            <FaChartLine className="mr-3 text-2xl text-indigo-200" /> 
            <h2 className="text-xl font-bold">Dashboard Analytics</h2>
          </div>
          
          <p className="opacity-90 mb-6">
            Visualize your team's progress and identify trends with our interactive analytics dashboard.
          </p>
          
          {/* Insights Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">{totalTickets}</div>
              <div className="text-sm text-indigo-200">Total Tickets</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">{openTickets}</div>
              <div className="text-sm text-indigo-200">Open Tickets</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">{totalProjects}</div>
              <div className="text-sm text-indigo-200">Total Projects</div>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">{activeProjects}</div>
              <div className="text-sm text-indigo-200">Active Projects</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticket Analytics Section - Collapsible */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <div 
          className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-5 cursor-pointer flex justify-between items-center transition-all duration-300"
          onClick={toggleTicketAnalytics}
        >
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg shadow-md mr-4">
              <FaTicketAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-800">Ticket Analytics</h3>
              <p className="text-sm text-blue-600">Track ticket metrics and identify workflow bottlenecks</p>
            </div>
          </div>
          
          <div className="bg-white p-2 rounded-full shadow hover:shadow-md transition-all">
            {ticketAnalyticsExpanded ? (
              <FaChevronUp className="text-blue-600" />
            ) : (
              <FaChevronDown className="text-blue-600" />
            )}
          </div>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${
          ticketAnalyticsExpanded ? 'max-h-full opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden p-0'
        }`}>
          {/* Insight box */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start">
            <FaLightbulb className="text-blue-500 text-xl mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-800 mb-1">Data Insight</h4>
              <p className="text-blue-700 text-sm">
                Your team has {openTickets} open tickets of {totalTickets} total. 
                Monitor the ticket status distribution to identify any bottlenecks in your workflow.
              </p>
            </div>
          </div>
          
          <TicketAnalytics tickets={tickets} />
        </div>
      </div>
      
      {/* Project Analytics Section - Collapsible */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <div 
          className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-5 cursor-pointer flex justify-between items-center transition-all duration-300"
          onClick={toggleProjectAnalytics}
        >
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg shadow-md mr-4">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800">Project Analytics</h3>
              <p className="text-sm text-green-600">Monitor project progress and resource allocation</p>
            </div>
          </div>
          
          <div className="bg-white p-2 rounded-full shadow hover:shadow-md transition-all">
            {projectAnalyticsExpanded ? (
              <FaChevronUp className="text-green-600" />
            ) : (
              <FaChevronDown className="text-green-600" />
            )}
          </div>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out bg-white ${
          projectAnalyticsExpanded ? 'max-h-full opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden p-0'
        }`}>
          {/* Insight box */}
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start">
            <FaLightbulb className="text-green-500 text-xl mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-green-800 mb-1">Project Insight</h4>
              <p className="text-green-700 text-sm">
                You have {activeProjects} active projects out of {totalProjects} total. 
                Review project progress to ensure timely completion and optimal resource allocation.
              </p>
            </div>
          </div>
          
          <ProjectAnalytics projects={projects} tickets={tickets} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;