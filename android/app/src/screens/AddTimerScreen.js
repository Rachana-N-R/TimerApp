import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';

const AddTimerScreen = ({ navigation }) => {
  const { state, dispatch } = useTimerContext();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(state.categories[0]);
  const [enableHalfwayAlert, setEnableHalfwayAlert] = useState(false);
  
  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name.');
      return false;
    }
    
    const durationValue = parseInt(duration);
    if (isNaN(durationValue) || durationValue <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in seconds.');
      return false;
    }
    
    return true;
  };
  
  const handleAddTimer = () => {
    if (!validateInputs()) return;
    
    const durationValue = parseInt(duration);
    
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: durationValue,
      remainingTime: durationValue,
      category,
      status: 'paused',
      progress: 1,
      reachedHalfway: false,
      halfwayAlertShown: false,
      enableHalfwayAlert
    };
    
    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Timer Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter timer name"
        />
        
        <Text style={styles.label}>Duration (in seconds)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter duration in seconds"
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          {state.categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategory
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                category === cat && styles.selectedCategoryText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Enable Halfway Alert</Text>
          <Switch
            value={enableHalfwayAlert}
            onValueChange={setEnableHalfwayAlert}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={enableHalfwayAlert ? '#2196F3' : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTimer}
        >
          <Text style={styles.addButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
  },
  categoryButtonText: {
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTimerScreen;