import { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Animated,
    TextInput,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import TopBar from '../../../component/TopBar';
import useTagSettings from './hook/useTagSettings';
import AppCommonModal from '../../../../common_component/AppCommonModel';


export default function TagManagement() {
    const navigation = useNavigation();
    const {
        tagloading,
        filteredTags,
        searchTerm,
        setSearchTerm,
        handleFetchTags,
        handleAddTag,
        handleUpdateTag,
        handleDeleteTag,
        control: addControl,
        handleSubmit: handleAddSubmit,
        errors: addErrors,
        tagUpdateLoading
    } = useTagSettings();

    const [editingTagId, setEditingTagId] = useState(null);
    const [showAddTagField, setShowAddTagField] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    // Form for editing tags
    const {
        control: editControl,
        handleSubmit: handleEditSubmit,
        reset: resetEdit,
        formState: { errors: editErrors }
    } = useForm({
        defaultValues: {
            tagName: ''
        }
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        handleFetchTags();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [handleFetchTags]);

    const startEditingTag = (tag) => {
        setEditingTagId(tag._id);
        resetEdit({ tagName: tag.tagname });
    };

    const onEditSubmit = async (data) => {
        try {
            await handleUpdateTag(editingTagId, data);
            setEditingTagId(null);
            resetEdit({ tagName: '' });
        } catch (error) {
            // Error handled in hook
        }
    };

    const onAddSubmit = async (data) => {
        try {
            await handleAddTag(data);
            setShowAddTagField(false);
        } catch (error) {
            // Error handled in hook
        }
    };

    const deleteTagAction = (tagId) => {
        setTagToDelete(tagId);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (tagToDelete) {
            try {
                await handleDeleteTag(tagToDelete);
                setIsDeleteModalVisible(false);
                setTagToDelete(null);
            } catch (error) {
                // Error handled in hook
            }
        }
    };

    const renderTagItem = ({ item: tag }) => {
        const isEditing = editingTagId === tag._id;
        if (!tag?.tagname) return null;
        if (isEditing) {
            return (
                <View style={styles.manageTagItem}>
                    <View style={styles.editTagContainer}>
                        <Controller
                            control={editControl}
                            name="tagName"
                            rules={{
                                required: 'Tag name is required',
                                maxLength: { value: 30, message: 'Max 30 characters' }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.editTagInput, editErrors.tagName && styles.inputError]}
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    autoFocus
                                    maxLength={30}
                                    placeholder="Enter tag name..."
                                />
                            )}
                        />
                        {editErrors.tagName && <Text style={styles.errorText}>{editErrors.tagName.message}</Text>}
                        {
                            tagUpdateLoading ? (
                                <View style={styles.editTagActions}>
                                    <TouchableOpacity
                                        style={styles.editTagCancel}
                                        onPress={() => {

                                        }}
                                    >
                                        <Text style={styles.editTagCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.editTagSave}

                                    >
                                        <LinearGradient
                                            colors={['#3F2B96', '#2633a7']}
                                            style={styles.editTagSaveGradient}
                                        >
                                            <Text style={styles.editTagSaveText}>Loading...</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ) : (<View style={styles.editTagActions}>
                                <TouchableOpacity
                                    style={styles.editTagCancel}
                                    onPress={() => {
                                        setEditingTagId(null);
                                        resetEdit({ tagName: '' });
                                    }}
                                >
                                    <Text style={styles.editTagCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.editTagSave}
                                    onPress={handleEditSubmit(onEditSubmit)}
                                >
                                    <LinearGradient
                                        colors={['#3F2B96', '#2633a7']}
                                        style={styles.editTagSaveGradient}
                                    >
                                        <Text style={styles.editTagSaveText}>Save</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>)
                        }

                    </View>
                </View>
            );
        }

        return (
            <View style={styles.manageTagItem}>
                <View style={styles.manageTagLeft}>
                    <View style={[styles.manageTagColor, { backgroundColor: '#8B5CF6' }]} />
                    <View>
                        <Text style={styles.manageTagLabel}>{tag.tagname}</Text>
                        <Text style={styles.manageTagId}>Type: {tag.tag_type}</Text>
                    </View>
                </View>

                {
                    !tag?.createdBy ? (
                        <View>
                            <View style={styles.manageTagActions}>
                                <TouchableOpacity
                                    style={styles.manageTagEdit}
                                    onPress={() => startEditingTag(tag)}
                                >
                                    <Feather name="edit-2" size={16} color="#3F2B96" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.manageTagDelete}
                                    onPress={() => deleteTagAction(tag._id)}
                                >
                                    <Feather name="trash-2" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) :
                        <View>
                            <View style={styles.manageTagActions}>
                                <TouchableOpacity

                                    style={[styles.manageTagEdit, { opacity: 0.5 }]}

                                >
                                    <Feather name="edit-2" size={16} color="#3F2B96" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.manageTagDelete, { opacity: 0.5 }]}

                                >
                                    <Feather name="trash-2" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                }

            </View>
        );
    };

    const ListHeader = () => (
        <View>
            {/* Search Bar */}
            <View style={[styles.searchContainer,{marginTop:10}]}>
                <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#94A3B8"
                />
                {searchTerm.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchTerm('')}>
                        <Feather name="x" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>

            {showAddTagField && (
                <View style={styles.addTagFieldContainer}>
                    <Controller
                        control={addControl}
                        name="tag"
                        rules={{
                            required: 'Tag name is required',
                            maxLength: { value: 10, message: 'Max 10 characters' }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.addTagInput, addErrors?.tag && styles.inputError]}
                                placeholder="Enter new tag name..."
                                placeholderTextColor="#94A3B8"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                autoFocus
                                maxLength={30}
                            />
                        )}
                    />
                    {addErrors?.tag && <Text style={styles.errorText}>{addErrors?.tag.message}</Text>}
                    <View style={styles.addTagActions}>
                        <TouchableOpacity
                            style={styles.addTagCancel}
                            onPress={() => {
                                setShowAddTagField(false);
                            }}
                        >
                            <Text style={styles.addTagCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.addTagConfirm}
                            onPress={handleAddSubmit(onAddSubmit)}
                        >
                            <LinearGradient
                                colors={['#3F2B96', '#2633a7']}
                                style={styles.addTagConfirmGradient}
                            >
                                <Text style={styles.addTagConfirmText}>Add Tag</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}>
            {tagloading ? (
                <ActivityIndicator size="large" color="#3F2B96" />
            ) : (
                <>
                    <Feather name="tag" size={48} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>No Tags Found</Text>
                    <Text style={styles.emptySubtitle}>
                        {searchTerm ? 'Try searching for something else' : 'Start by adding your first tag'}
                    </Text>
                </>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']} >
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            <TopBar
                title="Manage Tags"
                showBack={true}
                onBackPress={() => navigation.goBack()}
            />

            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                {ListHeader()

                }
                <FlatList
                    data={filteredTags}
                    renderItem={renderTagItem}
                    keyExtractor={(tag) => tag._id}

                    ListEmptyComponent={EmptyComponent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </Animated.View>

            <AppCommonModal
                visible={isDeleteModalVisible}
                icon='trash-2'
                title="Delete Tag"
                message="Are you sure you want to delete this tag? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                loading={tagUpdateLoading}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                    setTagToDelete(null);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        marginTop: 10
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 14,
        color: '#0F172A',
    },
    addTagButton: {
        padding: 4,
    },
    addTagFieldContainer: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    addTagInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#0F172A',
        backgroundColor: '#F8FAFC',
        marginBottom: 10,
    },
    addTagActions: {
        flexDirection: 'row',
        gap: 10,
    },
    addTagCancel: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    addTagCancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    addTagConfirm: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    addTagConfirmGradient: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addTagConfirmText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    listContent: {
        paddingBottom: 40,
    },
    manageTagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    manageTagLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    manageTagColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    manageTagLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    manageTagId: {
        fontSize: 12,
        color: '#94A3B8',
    },
    manageTagActions: {
        flexDirection: 'row',
        gap: 10,
    },
    manageTagEdit: {
        padding: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 8,
    },
    manageTagDelete: {
        padding: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
    },
    editTagContainer: {
        flex: 1,
    },
    editTagInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#0F172A',
        backgroundColor: '#F8FAFC',
        marginBottom: 8,
    },
    editTagActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editTagCancel: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    editTagCancelText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    editTagSave: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    editTagSaveGradient: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editTagSaveText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 8,
        textAlign: 'center',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginBottom: 8,
        marginLeft: 4,
    }
});
