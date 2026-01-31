export type TaskStatus = 'To-do' | 'In-progress' | 'Completed';

export interface Task {
  id: string;
  taskName: string;
  description: string;
  category: string;
  property: string;
  assignedTask: string;
  status: TaskStatus;
  checklistItems: string[];
  selectDate?: string;
  selectStartTime?: string;
  selectEndTime?: string;
}