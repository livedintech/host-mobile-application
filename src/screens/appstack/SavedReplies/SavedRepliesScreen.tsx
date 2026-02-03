import React from 'react';
import { StyleSheet, View, Switch, Pressable, FlatList } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useSavedRepliesContainer } from './SavedRepliesContainer';
import AppButton from '@/components/molecules/AppButton/AppButton';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import FlatListHandler from '@/components/molecules/FlatListHandler/FlatListHandler';

const SavedRepliesScreen = () => {
    const { replies, toggleSwitch, deleteReply, editReply, createNewReply,data,dataQuery,isFetching,isLoading } = useSavedRepliesContainer();

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <Switch
                        trackColor={{ false: '#D1D1D1', true: Colors.BRUNSWICK_GREEN }}
                        thumbColor={'#FFF'}
                        ios_backgroundColor="#D1D1D1"
                        onValueChange={() => toggleSwitch(item.id)}
                        value={item.isActive}
                        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                    <AppText text={item.title} fontSize={18} type="Medium" color={Colors.BRUNSWICK_GREEN} ml={10} />
                </View>

                <View style={styles.rightSection}>
                    <Pressable onPress={() => deleteReply(item.id)} style={styles.iconBtn}>
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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleWrapper}>
                    <AppText text="Saved Replies" fontSize={24} type="Bold" color={Colors.BRUNSWICK_GREEN} />
                    <Svgicons path="expandIcon" size={20} color={Colors.BRUNSWICK_GREEN} ml={8} />
                </View>
            </View>

            {/* List */}
            {/* <FlatListHandler
                    isLoading={isLoading || isFetching}
                    data={data}
                    meta={dataQuery}
                    listEmptyText="No Chat found"
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ flexGrow: 1 }}
                  /> */}
            <FlatListSimpleHandler
                data={replies}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                isLoading={false}
            />
            {/* Footer Button */}
            <View style={styles.footer}>
                <AppButton onPress={createNewReply} title='Create New Saved Reply' />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
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