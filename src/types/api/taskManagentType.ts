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