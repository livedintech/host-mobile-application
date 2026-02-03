export type TaskStatus = 'To-do' | 'In-Progress' | 'Completed';

export interface Task {
  id: string;
  taskName: string;
  description: string;
  category: string;
  property: string;
  assignedTask: string;
  status: TaskStatus;
  selectDate?: string;
  selectStartTime?: string;
  selectEndTime?: string;
  checklistData: ChecklistSection[];
  isCleaningCategory: boolean;

  preActivityMedia?: string[];
  postActivityMedia?: Record<string, string[]>;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export type SvgIconName = 'bedroom' | 'bathroom';

export interface ChecklistSection {
  id: string;
  title: string;
  icon: SvgIconName;
  items: ChecklistItem[];
}

//

export interface taskManagementCreateApiPayload {
  title: string;
  description: string;
  task_type_id: string;
  listing_id: string;
  vendor_id: string;
  start_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface taskManagementCreateApiResponse {
  message: string;
  data: {
    id: number | string; 
    [key: string]: any; 
  };
}
