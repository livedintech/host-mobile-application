import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useGetHostTaskList } from '@/hooks/useGetHostTaskList';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import { Task } from '@/types/api/taskManagentType';

const TaskListContainer = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

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

  const taskQuery = useGetHostTaskList();

  // ✅ Normalize paginated data
  const tasks = useInfiniteListData<Task>(taskQuery.data?.pages);

  const handleCreateTask = () => {
    navigate(NavigationRoutes.APP_STACK.CREATE_TASK);
  };

  const handleEditTask = (task: Task) => {
    console.log("taskkkhshhs",task)
    navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
      taskId: task?.id,
      taskStatus: task?.status,
      taskType: task?.task_type
    });
  };

  const onApplyFilter = (data: any) => {
    console.log('Filters applied:', data);
    toggleFilterModal(); // close modal after apply
  };

  const onResetFilter = () => reset();

  const toggleFilterModal = () => setFilterVisible(prev => !prev);

  return {
    tasks,
    taskQuery,
    handleCreateTask,
    handleEditTask,
    control,
    errors,
    onApplyFilter,
    onResetFilter,
    handleSubmit,
    isFilterVisible,
    toggleFilterModal,
  };
};

export default TaskListContainer;
