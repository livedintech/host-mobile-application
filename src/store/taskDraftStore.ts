import { ChecklistSection, TaskChecklistApiResponse } from '@/types/api/taskManagentType';
import { create } from 'zustand';

export interface TaskDraft {
   taskId: number; 
  taskName: string;
  taskDescription: string;
  category: string;
  listingSelection: string;
  assignTask?: string;
  selectDate?: string;
  selectStartTime?: string;
  selectEndTime?: string;
    taskType?: string;
  // NEW FIELDS
  // 🔹 RAW API DATA
  checklistApiData?: TaskChecklistApiResponse;

  // 🔹 UI STATE
  checklistData: ChecklistSection[];
  selectedChecklistItems: string[];

}

interface TaskDraftStore {
  draft: TaskDraft | null;
  setDraft: (
    draft:
      | Partial<TaskDraft>
      | ((prev: TaskDraft | null) => Partial<TaskDraft>)
  ) => void;
  updateChecklist: (data: ChecklistSection[]) => void;
  updateSelectedItems: (items: string[]) => void;
  clearDraft: () => void;
  isCleaningCategory: boolean;
}

export const useTaskDraftStore = create<TaskDraftStore>((set) => ({
  draft: null,
  isCleaningCategory: false,

setDraft: (draft) =>
  set((state) => {
    const incoming =
      typeof draft === 'function'
        ? draft(state.draft)
        : draft;

    const nextDraft = {
      ...state.draft,
      ...incoming,
    } as TaskDraft;

    return {
      draft: nextDraft,
      isCleaningCategory: Number(nextDraft.category) === 18,
    };
  }),


  // Helper to specifically update checklist structure
  updateChecklist: (data) => 
    set((state) => ({
      draft: state.draft ? { ...state.draft, checklistData: data } : null
    })),

  // Helper to update which IDs are checked
  updateSelectedItems: (items) => 
    set((state) => ({
      draft: state.draft ? { ...state.draft, selectedChecklistItems: items } : null
    })),

  clearDraft: () => set({ draft: null, isCleaningCategory: false }),
}));