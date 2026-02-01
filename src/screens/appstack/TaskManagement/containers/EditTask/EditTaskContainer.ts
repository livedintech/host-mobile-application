import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const EditTaskContainer = () => {
  const { params } = useRoute();
  console.log("Route Params Received:", params);
  const taskId = (params as any)?.taskId;
  
  const { tasks, updateTaskStatus } = useTaskStore();
  console.log("taskEditContainer",tasks)
  const task = tasks.find((t) => t.id === taskId);
  
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveChanges = () => {
    if (task?.status === 'To-do') {
      updateTaskStatus(taskId, 'In-Progress');
      // Navigation or feedback here
    }
  };

  return {
    task,
    expandedSections,
    toggleSection,
    handleSaveChanges,
  };
};

export default EditTaskContainer;