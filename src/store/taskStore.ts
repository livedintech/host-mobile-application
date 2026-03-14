// import { create } from 'zustand';
// import { Task, TaskStatus } from "@/types/api/taskManagentType";

// interface TaskStore {
//   tasks: Task[];
// addTask: (task: Omit<Task, 'id' | 'status'>) => void;
//   updateTaskStatus: (id: string, status: TaskStatus) => void;
// }

// export const useTaskStore = create<TaskStore>((set) => ({
//   tasks: [],

//   addTask: (task) =>
//     set((state) => ({
//       tasks: [
//         ...state.tasks,
//         {
//           id: Date.now().toString(),
//           status: 'To-do',
//           ...task,
//         },
//       ],
//     })),

//   updateTaskStatus: (id, status) =>
//     set((state) => ({
//       tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
//     }))
// }));


import { create } from 'zustand';

interface TaskState {
  taskId: number | null;
  taskType: string | null;
  checklistData: any[]; // Data for ViewChecklistAll
  selectedSectionId: number | null; // For ChecklistDetail
  
  // Actions
  setTaskInfo: (id: number, type: string) => void;
  setChecklistData: (data: any[]) => void;
  setSelectedSection: (id: number) => void;
  resetTaskStore: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  taskId: null,
  taskType: null,
  checklistData: [],
  selectedSectionId: null,

  setTaskInfo: (id, type) => set({ taskId: id, taskType: type }),
  setChecklistData: (data) => set({ checklistData: data }),
  setSelectedSection: (id) => set({ selectedSectionId: id }),
  resetTaskStore: () => set({ 
    taskId: null, 
    taskType: null, 
    checklistData: [], 
    selectedSectionId: null 
  }),
}));