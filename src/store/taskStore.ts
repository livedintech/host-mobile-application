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
  taskStatus: string | null;
  taskDescription: string | null;
  checklistData: any[];
  selectedSectionId: number | null;

  // Actions
  setCreatedTask: (id: number, type: string, data: any[]) => void;
  setTaskInfo: (id: number, type: string, status: string, description:string) => void;
  // setTaskStatus: (id: number, status: string, description: string) => void; // Added
  setChecklistData: (data: any[]) => void;
  setSelectedSection: (id: number) => void;
  resetTaskStore: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  taskId: null,
  taskType: null,
  taskStatus: null,
  taskDescription:null,
  checklistData: [],
  selectedSectionId: null,

  setTaskInfo: (id, type, status,description) => set({ taskId: id, taskType: type,taskStatus: status, taskDescription : description }),
  setCreatedTask: (id, type, data) => 
    set({ taskId: id, taskType: type, checklistData: data }),
  
  // setTaskStatus: (id, status, description) => set({ taskId: id, taskStatus: status, taskDescription : description }),
  setChecklistData: (data) => set({ checklistData: data }),
  setSelectedSection: (id) => set({ selectedSectionId: id }),
  resetTaskStore: () =>
    set({
      taskId: null,
      taskType: null,
      taskStatus: null,
      checklistData: [],
      selectedSectionId: null,
    }),
}));
