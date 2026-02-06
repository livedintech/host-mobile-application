// export type TaskStatus = 'To-do' | 'In-Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  task_type: string;
  task_type_key: string;
  type: string;
  date: string;
  listing_id: number;
  task_id: number;
  property_id: string;
  property_address: string;
  room_code: string;
  listing_title: string;
  status: string;
  priority: string;
  assign_datetime: string;
  assigned_user_name: string;
  is_future_booking: boolean;
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
  taskType?:string;
}

export interface taskManagementCreateApiResponse {
  message: string;
  data: {
    id: number | string; 
    [key: string]: any; 
  };
}

// API checklist section (from backend)
// export interface ChecklistApiSection {
//   id: number;
//   name: string;
//   icon?: string;
// }

// API response for checklist
export interface TaskChecklistApiResponse {
  data: {
    tasks: ChecklistApiSection[];
  };
}


export interface ChecklistSection {
  id: string;
  title: string;
  icon: SvgIconName;
  items: ChecklistItem[];
}

// API section returned by getTaskChecklist
export interface ChecklistApiSection {
  id: number;
  name: string;
  icon?: SvgIconName;
}
export interface AddSectionPayload {
  task_id: number;
  section_name: string;
  checklist_names: string[];
}

export interface InsertChecklistItemPayload {
  task_id: number;
  task_checklist_detail_id: number;
  checklist_names: string[];
}


export interface FormValues {
  sectionName: string;
  items: { value: string }[];
}

// API response type for a single checklist task
export interface ChecklistTaskApi {
  id: number | string;
  task_id: number;
  host_activation_id: number;
  task_checklist_id: number;
  key: string;
  name: string;
  section_count: number;
  total_tasks: number;
  completed_tasks: number;
  video_exists: string;
  icon?: string;
}


