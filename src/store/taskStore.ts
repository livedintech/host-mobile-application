import { create } from 'zustand';

import {TaskStatus,Task} from "@/types/api/taskManagentType"

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
}

export const useTaskStore = create<TaskStore>(set => ({
  tasks: [],

  addTask: task =>
    set(state => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          status: 'To-do',
          ...task,
        },
      ],
    })),
}));
