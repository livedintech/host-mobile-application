import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  getTaskChecklistDetail,
  taskManagementAddChecklist,
  taskManagementInsertChecklist,
  getTaskChecklist,
  editChecklistItem,
  taskCreateStatusUpdate,
} from '@/services/TaskManagementApi';
import { ChecklistApiSection } from '@/types/api/taskManagentType';

interface FormValues {
  sectionName: string;
  items: { value: string }[];
}

const CreateChecklistContainer = () => {
  const queryClient = useQueryClient();
  const { draft, clearDraft } = useTaskDraftStore();
  const taskId = draft?.checklistApiData?.data?.tasks?.[0]?.task_id;

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { sectionName: '', items: [{ value: '' }] },
    mode: 'onChange', // Helps validation update in real-time after first trigger
  });

  const { fields, append } = useFieldArray({ control, name: 'items' });

  // -----------------------------
  // FETCH SECTIONS
  // -----------------------------
  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ['taskChecklist', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const res = await getTaskChecklist(taskId, draft?.taskType!);
      return res.data.tasks.map((task: ChecklistApiSection) => ({
        id: String(task.id),
        title: task.name,
        icon: task.icon || 'bedroom',
        items: [],
      }));
    },
    enabled: !!taskId,
  });

  // -----------------------------
  // MUTATIONS
  // -----------------------------
  const addSectionMutation = useMutation({
    mutationFn: (vars: { sectionName: string; checklistNames: string[] }) =>
      taskManagementAddChecklist({
        task_id: taskId!,
        section_name: vars.sectionName,
        checklist_names: vars.checklistNames,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskChecklist', taskId] });
      toggleModal();
      Toast.show({ type: 'success', text1: 'Section added successfully' });
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Failed' }),
  });

  const addItemsMutation = useMutation({
    mutationFn: (vars: { sectionId: string; checklistNames: string[] }) =>
      taskManagementInsertChecklist({
        task_id: taskId!,
        task_checklist_detail_id: parseInt(vars.sectionId, 10),
        checklist_names: vars.checklistNames,
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ['checklistDetails', vars.sectionId],
      });
      toggleModal();
      Toast.show({ type: 'success', text1: 'Items added successfully' });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const checklistIds = selectedItems.map(id => Number(id));
      if (checklistIds.length > 0) {
        await editChecklistItem({
          task_id: taskId!,
          ids: checklistIds,
        });
      }
      await taskCreateStatusUpdate({ task_id: taskId!, is_draft: 0 });
    },
    onSuccess: () => {
      clearDraft();
      Toast.show({ type: 'success', text1: 'Task created successfully' });
      navigate(NavigationRoutes.APP_STACK.TASK);
    },
  });

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const toggleModal = (sectionId?: string) => {
    if (isModalVisible) {
      setModalVisible(false);
      setActiveSectionId(null);
      reset({ sectionName: '', items: [{ value: '' }] });
    } else {
      if (sectionId) setActiveSectionId(sectionId);
      setModalVisible(true);
    }
  };

  const onConfirm = async () => {
    // Explicitly trigger validation before proceeding
    const isValid = await trigger();
    if (!isValid) return;

    handleSubmit((formData: FormValues) => {
      const checklistNames = formData.items
        .map(i => i.value.trim())
        .filter(Boolean);

      if (activeSectionId) {
        addItemsMutation.mutate({ sectionId: activeSectionId, checklistNames });
      } else {
        addSectionMutation.mutate({
          sectionName: formData.sectionName,
          checklistNames,
        });
      }
    })();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  return {
    data: sections,
    expandedSections,
    selectedItems,
    toggleSection,
    toggleItem,
    onCreateTask: () => createTaskMutation.mutate(),
    isLoading:
      addSectionMutation.isPending ||
      addItemsMutation.isPending ||
      createTaskMutation.isPending,
    isModalVisible,
    activeSectionId,
    toggleModal,
    control,
    errors,
    fields,
    addChecklistField: () => append({ value: '' }),
    onConfirmAddSection: onConfirm,
    isLoadingSections,
  };
};

export default CreateChecklistContainer;
