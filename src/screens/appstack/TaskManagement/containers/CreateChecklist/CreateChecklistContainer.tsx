// containers/CreateChecklist/CreateChecklistContainer.ts
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTaskStore } from '@/store/taskStore';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  getTaskChecklistDetail,
  taskManagementAddChecklist,
  taskManagementInsertChecklist,
  getTaskChecklist,
} from '@/services/TaskManagementApi';
import {
  ChecklistSection,
  ChecklistApiSection,
} from '@/types/api/taskManagentType';

interface FormValues {
  sectionName: string;
  items: { value: string }[];
}

const CreateChecklistContainer = () => {
  const addTask = useTaskStore(s => s.addTask);
  const { draft, clearDraft, isCleaningCategory } = useTaskDraftStore();
  console.log('draftbb', draft);

  const [data, setData] = useState<ChecklistSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSections, setLoadingSections] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { sectionName: '', items: [{ value: '' }] },
  });

  const { fields, append } = useFieldArray({ control, name: 'items' });

  // Populate sections from draft API data
  useEffect(() => {
    if (!draft?.checklistApiData?.data?.tasks) return;

    const sections: ChecklistSection[] = draft.checklistApiData.data.tasks.map(
      (task: ChecklistApiSection) => ({
        id: String(task.id),
        title: task.name,
        icon: task.icon || 'bedroom',
        items: [], // items will be loaded when expanded
      }),
    );

    setData(sections);
  }, [draft?.checklistApiData]);

  const toggleModal = (sectionId?: string) => {
    if (isModalVisible) {
      setModalVisible(false);
      setActiveSectionId(null);
      reset();
    } else {
      if (sectionId) setActiveSectionId(sectionId);
      setModalVisible(true);
    }
  };

  // -----------------------------
  // ADD SECTION
  // -----------------------------
  const addNewSection = async (formData: FormValues) => {
    const checklistNames = formData.items
      .filter(i => i.value.trim())
      .map(i => i.value.trim());

    if (!formData.sectionName.trim()) {
      return Toast.show({ type: 'error', text1: 'Section name required' });
    }
    if (!checklistNames.length) {
      return Toast.show({
        type: 'error',
        text1: 'Add at least one checklist item',
      });
    }

    try {
      setIsLoading(true);

      const taskId = draft?.checklistApiData?.data?.tasks?.[0].task_id;

      if (!taskId) throw new Error('Task ID not found');

      // Add section API call
      await taskManagementAddChecklist({
        task_id: taskId,
        section_name: formData.sectionName,
        checklist_names: checklistNames,
      });

      // Fetch updated checklist
      const checklistRes = await getTaskChecklist(taskId, draft?.taskType!);

      if (!checklistRes?.data?.tasks?.length)
        throw new Error('No checklist data');

      const sections: ChecklistSection[] = checklistRes.data.tasks.map(
        (task: ChecklistApiSection) => ({
          id: String(task.id),
          title: task.name,
          icon: task.icon || 'bedroom',
          items: [], // load items on expand
        }),
      );

      setData(sections);
      toggleModal();
      Toast.show({ type: 'success', text1: 'Section added successfully' });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.message || 'Failed to add section',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // ADD ITEM TO EXISTING SECTION
  // -----------------------------
  const addItemToSection = async (formData: FormValues) => {
    if (!activeSectionId) return;

    const checklistNames = formData.items
      .filter(i => i.value.trim())
      .map(i => i.value.trim());
    if (!checklistNames.length) {
      return Toast.show({
        type: 'error',
        text1: 'Add at least one checklist item',
      });
    }

    try {
      setIsLoading(true);

      const taskId = draft?.checklistApiData?.data?.tasks?.[0].task_id;
      if (!taskId) throw new Error('Task ID not found');

      const res = await taskManagementInsertChecklist({
        task_id: taskId,
        task_checklist_detail_id: parseInt(activeSectionId, 10),
        checklist_names: checklistNames,
      });

      // Merge items uniquely
      setData(prev =>
        prev.map(section => {
          if (section.id !== activeSectionId) return section;

          const existingIds = new Set(section.items.map(i => i.id));
          const newItems = res.data
            .map(i => ({ id: String(i.id), label: i.name }))
            .filter(i => !existingIds.has(i.id));

          return { ...section, items: [...section.items, ...newItems] };
        }),
      );

      toggleModal();
      Toast.show({ type: 'success', text1: 'Items added successfully' });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.message || 'Failed to add items',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirm = handleSubmit((formData: FormValues) => {
    if (activeSectionId) addItemToSection(formData);
    else addNewSection(formData);
  });

  // -----------------------------
  // TOGGLE SECTION & LOAD ITEMS
  // -----------------------------
  const toggleSection = async (sectionId: string) => {
    const isExpanding = !expandedSections.includes(sectionId);
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId],
    );

    if (!isExpanding) return;
    const section = data.find(s => s.id === sectionId);
    if (!section || section.items.length > 0) return;

    setLoadingSections(prev => [...prev, sectionId]);
    try {
      const res = await getTaskChecklistDetail(
        sectionId,
        draft?.taskType as string,
      );
      console.log('resdatattad', res);
      const items = res.data.map((i: any) => ({
        id: String(i.id),
        label: i.name,
      }));
      console.log('itemsitemstets', items);
      setData(prev =>
        prev.map(s => (s.id === sectionId ? { ...s, items } : s)),
      );
    } catch (e: any) {
      Toast.show({ type: 'error', text1: e.message || 'Failed to load items' });
    } finally {
      setLoadingSections(prev => prev.filter(id => id !== sectionId));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const onCreateTask = () => {
    console.log("draftselecteditem",draft,selectedItems)
    if (!draft || !selectedItems.length) {
      return Toast.show({ type: 'error', text1: 'Select at least one item' });
    }

    setIsLoading(true);

    addTask({
      taskName: draft.taskName,
      description: draft.taskDescription,
      category: draft.category,
      property: draft.listingSelection,
      assignedTask: draft.assignTask || 'Unassigned',
      selectDate: draft.selectDate,
      selectStartTime: draft.selectStartTime,
      selectEndTime: draft.selectEndTime,
      isCleaningCategory,
    });

    clearDraft();
    Toast.show({ type: 'success', text1: 'Task Created' });
    setTimeout(() => {
      setIsLoading(false);
      navigate(NavigationRoutes.APP_STACK.TASK);
    }, 300);
  };

  return {
    data,
    expandedSections,
    selectedItems,
    toggleSection,
    toggleItem,
    onCreateTask,
    isLoading,
    isModalVisible,
    activeSectionId,
    toggleModal,
    control,
    errors,
    fields,
    addChecklistField: () => append({ value: '' }),
    onConfirmAddSection: onConfirm,
    loadingSections,
  };
};

export default CreateChecklistContainer;
