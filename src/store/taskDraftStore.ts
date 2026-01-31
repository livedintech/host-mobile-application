import { create } from 'zustand';

export interface TaskDraft {
  taskName: string;
  taskDescription: string;
  category: string;
  listingSelection: string;
  assignTask?: string;
  selectDate?: string;        
  selectStartTime?: string;    
  selectEndTime?: string;  
}

interface TaskDraftStore {
  draft: TaskDraft | null;
  setDraft: (draft: TaskDraft) => void;
  clearDraft: () => void;
}

export const useTaskDraftStore = create<TaskDraftStore>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
