import { create } from 'zustand';
import { Task, TaskStatus } from "@/types/api/taskManagentType";

interface TaskStore {
  tasks: Task[];
addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          status: 'To-do',
          ...task,
        },
      ],
    })),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }))
}));