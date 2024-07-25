export type BulkUploadType = {
  send_ticket: ReactNode;
  filename: string;
  file_id: string;
  status: string;
  success_count: number;
  failure_count: number;
  report_path: string;
  total_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};
