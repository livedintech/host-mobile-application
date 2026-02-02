import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { Task } from '@/types/api/taskManagentType';

const TaskListContainer = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listings: [],
      assignee: [],
      status: [],
    },
  });

  const toggleFilterModal = () => setIsFilterVisible(!isFilterVisible);

  const handleCreateTask = () => {
    navigate(NavigationRoutes.APP_STACK.CREATE_TASK);
  };

  const handleEditTask = (task: Task) => {
    // console.log('Edit task:', task.id);
    console.log(NavigationRoutes.APP_STACK.EDIT_TASK, 'testtt');

    navigate(NavigationRoutes.APP_STACK.EDIT_TASK, { taskId: task.id });
  };

  const onApplyFilter = (data: any) => {
    console.log('Filtered Data:', data);
    toggleFilterModal();
  };

  const onResetFilter = () => {
    reset();
  };

  return {
    handleCreateTask,
    handleEditTask,
    isFilterVisible,
    toggleFilterModal,
    control,
    errors,
    onApplyFilter,
    onResetFilter,
    handleSubmit,
  };
};

export default TaskListContainer;
