import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { useBudget, categories } from '@/context/BudgetContext';
import { Toast } from '@/components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import {
  DollarSign,
  Tag,
  FileText,
  CircleArrowUp as ArrowUpCircle,
  CircleArrowDown as ArrowDownCircle,
  Calendar,
  CircleCheck as CheckCircle2,
  Circle as XCircle,
  Clock,
  X,
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Kayıt ekleme (gelir/gider) ekranı ana bileşeni
export default function AddEntry() {
  const { addEntry } = useBudget();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Kullanıcıdan alınan verilerle formun ilerleme yüzdesini hesaplar
  const progress = Math.min(
    (amount ? 30 : 0) + (description ? 35 : 0) + (category ? 35 : 0),
    100
  );

  // Tutar girişini kontrol eden ve sadece geçerli değerleri kabul eden fonksiyon
  const handleAmountChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleanedText);
  };

  // Kullanıcıya toast mesajı göstermek için yardımcı fonksiyon
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleDateSelect = () => {
    try {
      const [year, month, day] = dateInput.split('-').map(Number);
      const [hours, minutes] = timeInput.split(':').map(Number);
      
      const newDate = new Date(year, month - 1, day, hours, minutes);
      setSelectedDate(newDate);
      setShowDateModal(false);
    } catch (error) {
      showToast('Invalid date or time format', 'error');
    }
  };

  // Formu gönderme, validasyon ve kayıt ekleme işlemini yapan fonksiyon
  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please enter a description', 'error');
      return;
    }

    if (!category) {
      showToast('Please select a category', 'error');
      return;
    }

    try {
      await addEntry({
        amount: Number(parseFloat(amount).toFixed(2)),
        description: description.trim(),
        category,
        type,
        date: selectedDate.toISOString(),
      });

      showToast(
        `${type === 'income' ? 'Income' : 'Expense'} added successfully!`,
        'success'
      );

      setAmount('');
      setDescription('');
      setCategory('');
    } catch (error) {
      showToast('Failed to add entry', 'error');
    }
  };

  // Butonun üstünde gösterilecek metni belirler
  const getButtonText = () => {
    if (!amount || !description || !category) {
      return type === 'income' ? 'Add Income' : 'Add Expense';
    }
    return `Add ${type === 'income' ? 'Income' : 'Expense'}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Üst başlık ve ilerleme çubuğu */}
      <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Add Transaction</Text>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={progress}
            tintColor="#ffffff"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            rotation={0}
          >
            {(fill) => (
              <Text style={styles.progressText}>{Math.round(fill)}%</Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </LinearGradient>

      {/* Form ve giriş alanları */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
          <View style={styles.card}>
            {/* Gelir/gider tipi seçici */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.typeButtonActive,
                ]}
                onPress={() => setType('expense')}
              >
                <ArrowDownCircle
                  size={24}
                  color={type === 'expense' ? '#b91c1c' : '#64748b'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'expense' && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.typeButtonActive,
                ]}
                onPress={() => setType('income')}
              >
                <ArrowUpCircle
                  size={24}
                  color={type === 'income' ? '#15803d' : '#64748b'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'income' && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Açıklama giriş alanı */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <FileText size={20} color="#64748b" />
              </View>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                maxLength={100}
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Tutar giriş alanı */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <DollarSign size={20} color="#64748b" />
              </View>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0.00"
                maxLength={10}
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Kategori seçici */}
            <View style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Tag size={20} color="#64748b" />
                <Text style={styles.categoryTitle}>Category</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
                contentContainerStyle={styles.categoryContent}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tarih ve saat bilgisi */}
            <View style={styles.infoSection}>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => {
                  setDateInput(format(selectedDate, 'yyyy-MM-dd'));
                  setTimeInput(format(selectedDate, 'HH:mm'));
                  setShowDateModal(true);
                }}
              >
                <View style={styles.infoRow}>
                  <Calendar size={20} color="#64748b" />
                  <Text style={styles.infoText}>
                    {format(selectedDate, 'MMMM dd, yyyy HH:mm')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Modal
              visible={showDateModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDateModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Date and Time</Text>
                    <TouchableOpacity onPress={() => setShowDateModal(false)}>
                      <X size={24} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={dateInput}
                      onChangeText={setDateInput}
                      placeholder="2024-03-20"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Time (HH:mm)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={timeInput}
                      onChangeText={setTimeInput}
                      placeholder="14:30"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleDateSelect}
                  >
                    <Text style={styles.modalButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Kayıt ekle butonu */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!amount || !description || !category) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!amount || !description || !category}
            >
              {amount && description && category ? (
                <CheckCircle2 size={24} color="#ffffff" />
              ) : (
                <XCircle size={24} color="#ffffff" />
              )}
              <Text style={styles.submitButtonText}>{getButtonText()}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Toast mesajı bileşeni */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#ffffff',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // Add padding to account for tab bar
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 4,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#64748b',
  },
  typeButtonTextActive: {
    color: '#0f172a',
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputIcon: {
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#0f172a',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#64748b',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#7c3aed',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748b',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  datePickerButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#0f172a',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748b',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#0f172a',
  },
  modalButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
