import { useState } from 'react';
// import { MOCK_DATA, ChecklistSection } from './checklist.data';
import { useTaskStore } from '@/store/taskStore';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

export interface ChecklistItem {
  id: string;
  label: string;
}

export type SvgIconName = 'bedroom' | 'bathroom';

export interface ChecklistSection {
  id: string;
  title: string;
  icon: SvgIconName;
  items: ChecklistItem[];
}

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
  const addTask = useTaskStore((s) => s.addTask);
  const draft = useTaskDraftStore((s) => s.draft);
  const clearDraft = useTaskDraftStore((s) => s.clearDraft);

  const [data] = useState<ChecklistSection[]>(MOCK_DATA);
  const [expandedSections, setExpandedSections] = useState<string[]>(['1']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onCreateTask = () => {
    if (!draft) return;

    setIsLoading(true);

    addTask({
      taskName: draft.taskName,
      description: draft.taskDescription,
      category: draft.category,
      property: draft.listingSelection,
      assignedTask: draft.assignTask || 'Unassigned',
      checklistItems: selectedItems,
      selectDate: draft.selectDate,
      selectStartTime : draft.selectStartTime,
      selectEndTime : draft.selectEndTime,
    });

    clearDraft();

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
  };
};

export default CreateChecklistContainer;
