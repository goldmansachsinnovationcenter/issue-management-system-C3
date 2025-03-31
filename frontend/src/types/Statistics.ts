import { Issue } from './Issue';

export interface Statistics {
  totalIssues: number;
  statusCounts: {
    new: number;
    assigned: number;
    closed: number;
    rejected: number;
  };
  priorityCounts: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  applicationCounts: Record<string, number>;
  assigneeCounts: Record<string, number>;
}
