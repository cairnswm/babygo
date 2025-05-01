import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Report } from '../types';
import { CURRENT_USER_ID } from '../data/mockData';

// Mock reports data
const mockReports: Report[] = [
  {
    id: 'report-1',
    adId: 'ad-1',
    userId: 'user-2',
    reason: 'inappropriate',
    description: 'This advertisement contains inappropriate content not suitable for a baby goods marketplace. The images show non-baby related items.',
    createdAt: new Date(2024, 2, 15, 10, 30).toISOString(),
    status: 'pending'
  },
  {
    id: 'report-2',
    adId: 'ad-3',
    userId: 'user-4',
    reason: 'scam',
    description: 'Seller is asking for payment outside the platform and the price seems too good to be true. Possible scam attempt.',
    createdAt: new Date(2024, 2, 14, 15, 45).toISOString(),
    status: 'reviewed'
  }
];

interface ReportContextType {
  reports: Report[];
  addReport: (adId: string, reason: string, description: string) => void;
  getAdReports: (adId: string) => Report[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(mockReports);

  const addReport = (adId: string, reason: string, description: string) => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      adId,
      userId: CURRENT_USER_ID,
      reason,
      description,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
  };

  const getAdReports = (adId: string) => 
    reports.filter(report => report.adId === adId);

  const value = {
    reports,
    addReport,
    getAdReports
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};