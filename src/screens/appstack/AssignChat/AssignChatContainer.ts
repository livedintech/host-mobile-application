import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { goBack, navigate } from '@/services/navigationService';
import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { assignUserToChatApi, GetAssignChatToUserApi } from '@/services/chatApi';
import STORAGE_CONST from '@/constants/storage';
import { assignUserToChatPayloadType, createChatSnoozeByConversationIdResponseType } from '@/types/api/chatTypes';
import { useRoute } from '@react-navigation/native';

interface ChatUser {
    id: string;
    name: string;
    role: 'Owner' | 'Manager' | 'Supervisor';
}

export default function useAssignChatContainer() {
    const removeSheetRef = useRef<ConfirmActionRef>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isLoadingRemoved, setIsLoadingRemoved] = useState(false);
    const queryClient = useQueryClient();

     const route = useRoute();
      const params = route?.params as { conversation_id?: number } | undefined;
      const conversation_id = params?.conversation_id;

    // User Management List
    const { data: userManagement = [], refetch, isLoading } = useQuery({
        queryKey: [STORAGE_CONST.GET_ASSIGN_CHAT_TO_USER],
        queryFn: GetAssignChatToUserApi,
    });

    // Assign User
    const {
        mutate: assignUserToChatPayload,
        isPending,
        isIdle,
    } = useMutation<createChatSnoozeByConversationIdResponseType, Error, assignUserToChatPayloadType>({
        mutationFn: assignUserToChatApi,
        onSuccess: ({ message }) => {
            Toast.show({ type: 'success', text1: message });
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_LIST] });
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_CHAT_DETAIL] });
            // navigate(NavigationRoutes.APP_STACK.CHAT);
            goBack(2);
        },
        onError: error => {
            Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
        },
    });

    const handleAssignUser = (user: ChatUser) => {
        console.log('user',user);
        

        setSelectedUser(user);
        removeSheetRef.current?.open();
    };

    const confirm = () => {
        if (!selectedUser) return;

        setIsLoadingRemoved(true);

        // Call the mutation
        const payload = {
                 conversation_id,
                 user_id: selectedUser.id,
        }
        
        assignUserToChatPayload(
            {
                conversation_id,
                user_id: selectedUser.id,
            }
        );
    };



    return {
        handleAssignUser,
        removeSheetRef,
        selectedUser,
        confirm,
        isLoadingRemoved,
        userManagement,
        refetch,
        isLoading
    };
}