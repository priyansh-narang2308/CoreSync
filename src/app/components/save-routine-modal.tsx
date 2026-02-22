import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SaveRoutineModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => Promise<void>;
    isSaving: boolean;
}

const SaveRoutineModal = ({ visible, onClose, onSave, isSaving }: SaveRoutineModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Please enter a name for your routine.');
            return;
        }
        await onSave(name, description);
        setName('');
        setDescription('');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.container}
                        >
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>Save as Template</Text>
                                    <TouchableOpacity onPress={onClose} disabled={isSaving}>
                                        <Ionicons name="close" size={24} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.body}>
                                    <Text style={styles.label}>Routine Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g., Upper Body Power"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#9CA3AF"
                                        autoFocus
                                        editable={!isSaving}
                                    />

                                    <Text style={styles.label}>Description (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Brief details about this workout..."
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={3}
                                        placeholderTextColor="#9CA3AF"
                                        textAlignVertical="top"
                                        editable={!isSaving}
                                    />
                                </View>

                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={onClose}
                                        disabled={isSaving}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.saveButton, !name.trim() && styles.disabledButton]}
                                        onPress={handleSave}
                                        disabled={isSaving || !name.trim()}
                                    >
                                        {isSaving ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text style={styles.saveButtonText}>Save Routine</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    body: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#111827',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    textArea: {
        height: 80,
        paddingTop: 12,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4F46E5',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#A5B4FC',
    },
});

export default SaveRoutineModal;
