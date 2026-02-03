import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

interface AIReply {
    id: string;
    title: string;
    listingAccess: string;
    isActive: boolean;
}

export default function useAIAutoReplyContainer() {
    const queryClient = useQueryClient();
    
    // Dummy Data based on image
    const [replies, setReplies] = useState<AIReply[]>([
        { id: '1', title: 'Check-in Reminder', listingAccess: 'Multiple Listings', isActive: true },
        { id: '2', title: 'Payment Details', listingAccess: 'All Listings', isActive: true },
        { id: '3', title: 'Address', listingAccess: 'Al Hammd Villa', isActive: true },
        { id: '4', title: 'Wifi Password', listingAccess: 'Al Hammd Villa', isActive: true },
    ]);

    const toggleSwitch = (id: string) => {
        setReplies(prev => prev.map(item => 
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    const handleCreateNew = () => navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY);
    const handleEdit = (item: AIReply) => navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY, { editData: item });
    const handleKnowledgeBase = () => navigate(NavigationRoutes.APP_STACK.WHAT_AI_KNOWS);

    return {
        replies,
        toggleSwitch,
        handleCreateNew,
        handleEdit,
        handleKnowledgeBase
    };
}