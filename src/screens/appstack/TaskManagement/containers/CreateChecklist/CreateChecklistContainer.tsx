import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTaskStore } from '@/store/taskStore';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { ChecklistSection } from '@/types/api/taskManagentType';




export const MOCK_DATA: ChecklistSection[] = [
  {
    id: '1',
    title: 'Bedroom 01',
    icon: 'bedroom',
    items: [
      { id: '101', label: 'Empty the trash bins and replace the new liner' },
      { id: '102', label: 'Windows glass & channels cleaned' },
      { id: '103', label: 'Curtains Set / Unstained' },
      { id: '104', label: 'Wardrobe Check and Dust' },
    ],
  },
  {
    id: '2',
    title: 'Bedroom 02',
    icon: 'bedroom',
    items: [],
  },
  {
    id: '3',
    title: 'Bathroom',
    icon: 'bathroom',
    items: [],
  },
];

const CreateChecklistContainer = () => {
  const addTask = useTaskStore(s => s.addTask);
  const {draft, clearDraft, setDraft, isCleaningCategory} = useTaskDraftStore();

  console.log("draftChecklist",draft?.checklistData)
  

  // const [data, setData] = useState<ChecklistSection[]>(MOCK_DATA);
    const [data, setData] = useState<ChecklistSection[]>([]);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['1']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDraft({ 
        checklistData: data, 
        selectedChecklistItems: selectedItems 
    });
  }, [data, selectedItems]);


  


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sectionName: '',
      items: [{ value: '' }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'items',
  });

  const toggleModal = (sectionId?: any) => {
    if (isModalVisible) {
      setModalVisible(false);
      setActiveSectionId(null);
      reset();
    } else {
      // If sectionId is a string (from 'Add' button), set active mode
      if (typeof sectionId === 'string') {
        setActiveSectionId(sectionId);
      }
      setModalVisible(true);
    }
  };

  const onConfirmAddSection = (formData: any) => {
    const newItems = formData.items
      .filter((item: any) => item.value.trim() !== '')
      .map((item: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        label: item.value,
      }));

    if (activeSectionId) {
      // Update existing section
      setData(prev =>
        prev.map(section =>
          section.id === activeSectionId
            ? { ...section, items: [...section.items, ...newItems] }
            : section,
        ),
      );
    } else {
      // Create new section
      const newSection: ChecklistSection = {
        id: Date.now().toString(),
        title: formData.sectionName || 'Untitled Section',
        icon: 'bedroom',
        items: newItems,
      };
      setData([newSection, ...data]);
    }
    toggleModal();
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const onCreateTask = () => {
    if (!draft) return;
    // ❌ VALIDATION: no checklist selected
    if (selectedItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Checklist required',
        text2: 'Please select at least one checklist item',
        position: 'top',
        visibilityTime: 2500,
      });
      return;
    }

    const filteredChecklistData = data
    .map(section => ({
      ...section,
      items: section.items.filter(item => selectedItems.includes(item.id))
    }))
    .filter(section => section.items.length > 0);


    setIsLoading(true);

    addTask({
      taskName: draft.taskName,
      description: draft.taskDescription,
      category: draft.category,
      property: draft.listingSelection,
      assignedTask: draft.assignTask || 'Unassigned',
      // checklistItems: selectedItems,
      selectDate: draft.selectDate,
      selectStartTime: draft.selectStartTime,
      selectEndTime: draft.selectEndTime,
      checklistData: filteredChecklistData,
      isCleaningCategory: isCleaningCategory,
    });

    clearDraft();
    // ✅ Show success toast
    Toast.show({
      type: 'success',
      text1: 'Task Created',
      text2: 'Your task has been successfully created.',
      position: 'top',
      visibilityTime: 2000,
    });

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
    onConfirmAddSection: handleSubmit(onConfirmAddSection),
  };
};

export default CreateChecklistContainer;
