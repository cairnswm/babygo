import React, { useState } from "react";
import { useReport } from "../context/ReportContext";
import { useClassified } from "../context/ClassifiedContext";
import { useUserRating } from "../context/UserRatingContext";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Flag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { accessElf } from "../auth/utils/accessElf";

const AdminReportsPage: React.FC = () => {
  const { reports } = useReport();
  const { ads } = useClassified();
  const { getUser } = useUserRating();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "reviewed" | "resolved"
  >("all");

  accessElf.track("Admin Reports Page");

  const filteredReports = reports
    .filter(
      (report) => statusFilter === "all" || report.status === statusFilter
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-yellow-800" />;
      case "reviewed":
        return <AlertTriangle size={16} className="text-blue-800" />;
      case "resolved":
        return <CheckCircle size={16} className="text-green-800" />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reported Advertisements</h1>
            <p className="text-gray-600 mt-2">
              Review and manage reported content
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {filteredReports.map((report) => {
              const ad = ads.find((a) => a.id === report.adId);
              const reporter = getUser(report.userId);

              if (!ad || !reporter) return null;

              return (
                <div key={report.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{ad.title}</h3>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Reported by</p>
                          <div className="flex items-center gap-2 mt-1">
                            <img
                              src={reporter.avatar}
                              alt={reporter.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-medium">
                              {reporter.name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Reported on</p>
                          <p className="text-sm font-medium">
                            {new Date(report.createdAt).toLocaleDateString()} at{" "}
                            {new Date(report.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="font-medium">{report.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-700">{report.description}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/ad/${ad.id}`}
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                        >
                          View Advertisement
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>

                    <div className="ml-6">
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style = "display: none";
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
              <Flag size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reports found</h3>
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "There are no reported advertisements at the moment."
                : `There are no ${statusFilter} reports at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
