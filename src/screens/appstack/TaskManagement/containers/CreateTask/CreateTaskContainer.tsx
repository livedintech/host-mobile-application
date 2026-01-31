import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate } from '@/services/navigationService';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface CreateTaskFormData {
  taskName: string;
  taskDescription: string;
  category: string;
  listingSelection: string;
  assignTask?: string;
  selectDate?: string;
  selectStartTime?: string;
  selectEndTime?: string;
}

export const CATEGORY_OPTIONS = [
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Fumigation', value: 'fumigation' },
];

export const LISTING_OPTIONS = [
  { label: 'Alpha House', value: 'alpha_house' },
  { label: 'Beta House', value: 'beta_house' },
  { label: 'Gamma House', value: 'gamma_house' },
];

export const USER_OPTIONS = [
  { label: 'User 1', value: 'user_1' },
  { label: 'User 2', value: 'user_2' },
  { label: 'User 3', value: 'user_3' },
];

const CreateTaskContainer = () => {
  const setDraft = useTaskDraftStore(s => s.setDraft);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateTaskFormData>({
    defaultValues: {
      taskName: '',
      taskDescription: '',
      category: '',
      listingSelection: '',
      assignTask: '',
      selectDate: '',
      selectStartTime: '',
      selectEndTime: '',
    },
    mode: 'onBlur',
  });

  const [wordCount, setWordCount] = useState(0);

  const selectedCategory = watch('category');
  const taskDescription = watch('taskDescription');

  useEffect(() => {
    const words = taskDescription
      ? taskDescription.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
  }, [taskDescription]);

  const isCleaningCategory = selectedCategory === 'cleaning';

  const onSubmit = (data: CreateTaskFormData) => {
    setDraft({
      taskName: data.taskName,
      taskDescription: data.taskDescription,
      category: data.category,
      listingSelection: data.listingSelection,
      assignTask: data.assignTask,
      selectDate: data.selectDate || '',
      selectStartTime: data.selectStartTime || '',
      selectEndTime: data.selectEndTime || '',
    });

    setValue('selectDate', '');
    setValue('selectStartTime', '');
    setValue('selectEndTime', '');

    navigate(NavigationRoutes.APP_STACK.CREATE_CHECKLIST);
  };

  //
  const proceedToChecklist = () => {
    navigate(NavigationRoutes.APP_STACK.CREATE_CHECKLIST);
  };

  return {
    control,
    errors,
    onSubmitForm: handleSubmit(onSubmit),
    categoryOptions: CATEGORY_OPTIONS,
    listingOptions: LISTING_OPTIONS,
    userOptions: USER_OPTIONS,
    selectedCategory,
    isCleaningCategory,
    wordCount,
    setValue,
    proceedToChecklist,
  };
};

export default CreateTaskContainer;
