import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useSavedRepliesContainer } from './SavedRepliesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';
import BGImage from '@/components/molecules/BGImage/BGImage';

const SavedRepliesScreen = () => {
    const { toggleSwitch, editReply, createNewReply, data, dataQuery, isFetching, isLoading, confirm, openRemoveConfirmSheet, removeSheetRef, isLoadingRemoved, Item, isLoadingStatus } = useSavedRepliesContainer();

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <CustomSwitch onToggle={() => toggleSwitch(item)} value={item.is_active} disabled={isLoadingStatus} isLoading={item?.id === Item?.id ? isLoadingStatus : false} />
                    <AppText text={item.title} fontSize={18} type="Medium" color={Colors.BRUNSWICK_GREEN} ml={10} />
                </View>
                <View style={styles.rightSection}>
                    <Pressable onPress={() => openRemoveConfirmSheet(item)} style={styles.iconBtn}>
                        <Svgicons path="TrashFull" size={20} color={Colors.BRUNSWICK_GREEN} />
                    </Pressable>
                    <Pressable onPress={() => editReply(item)} style={styles.iconBtn}>
                        <Svgicons path="editIconUserManagement" size={20} color={Colors.BRUNSWICK_GREEN} />
                    </Pressable>
                </View>
            </View>
        )
    };

    return (
         <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleWrapper}>
                    <AppText text="Saved Replies" fontSize={24} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="expandIcon" size={20} color={Colors.BRUNSWICK_GREEN} ml={8} />
                </View>
            </View>

            {/* List */}
            <FlatListHandler
                isLoading={isLoading || isFetching}
                data={data}
                meta={dataQuery}
                listEmptyText="No data found"
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.listContent}
            />
            {/* Footer Button */}
            <View style={styles.footer}>
                <AppButton onPress={createNewReply} title='Create New Saved Reply' loading={isLoadingRemoved || isLoadingStatus}/>
            </View>
            <ConfirmAction
                ref={removeSheetRef}
                title={`${Item?.title}`}
                content="Are you sure you want delete?"
                confirmText='Confirm'
                closeText='Cancel'
                onConfirm={confirm}
                isLoading={isLoadingRemoved}
            />
        </View>
       </BGImage>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center'
    },
    backBtn: { position: 'absolute', left: 20, padding: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 25 },
    titleWrapper: { flexDirection: 'row', alignItems: 'center' },
    listContent: { paddingHorizontal: 20, paddingTop: 10 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        // Shadow for iOS/Android
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    rightSection: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 5, marginLeft: 10 },
    footer: { padding: 20, paddingBottom: 40 },
    createBtn: {
        height: 55,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    }
});

export default SavedRepliesScreen;