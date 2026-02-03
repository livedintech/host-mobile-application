import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { PAGE_SIZE } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import { getAutomationTemplateApi } from '@/services/automationTemplate';

interface AutomationTemplate {
    id: string;
    title: string;
    listingAccess: string;
    isActive: boolean;
}

export default function useAutomationTemplateContainer() {
    const queryClient = useQueryClient();
    
    const [templates, setTemplates] = useState<AutomationTemplate[]>([
        { id: '1', title: 'Check-in Reminder', listingAccess: 'Multiple Listings', isActive: true },
        { id: '2', title: 'Payment Details', listingAccess: 'All Listings', isActive: true },
        { id: '3', title: 'Address', listingAccess: 'Al Hammd Villa', isActive: true },
        { id: '4', title: 'Wifi Password', listingAccess: 'Al Hammd Villa', isActive: false },
    ]);

    const toggleSwitch = (id: string) => {
        setTemplates(prev => prev.map(item => 
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    const deleteTemplate = (id: string) => {
        console.log("Delete ID:", id);
        // Mutation logic here
    };

    const editTemplate = (item: AutomationTemplate) => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE, { editData: item });
    };

    const createNewTemplate = () => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE);
    };

    // Get All Chat List
    // const dataQuery = useInfiniteQuery({
    //     queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE],
    //     queryFn: ({ pageParam = 1 }) =>
    //         getAutomationTemplateApi({
    //             page: pageParam as number,
    //             limit: PAGE_SIZE,
    //         }),
    //     initialPageParam: 1,
    //     getNextPageParam: lastPage =>
    //         lastPage.current_page < lastPage.total_pages
    //             ? lastPage.current_page + 1
    //             : undefined,
    // });


    // const { data: raiseIssueData, isLoading, isFetching } = dataQuery;
    // const data = useInfiniteListData(raiseIssueData?.pages);

    return {
        data: [],
        isLoading: false,
        isFetching: false,
        dataQuery:{},
        templates,
        toggleSwitch,
        deleteTemplate,
        editTemplate,
        createNewTemplate
    };
}