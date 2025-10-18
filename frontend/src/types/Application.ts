export interface Application {
  id: number;
  position: string;
  company: string;
  status: string;
  location?: string;
  salary_range?: string;
  job_url?: string;
  description?: string;
  notes?: string;
  applied_date?: string;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}
