import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';
import TimerCard from '../components/TimerCard';
import CategoryGroup from '../components/CategoryGroup';

const HomeScreen = ({ navigation }) => {
  const { state, dispatch } = useTimerContext();
  const { timers, categories } = state;
  const [expandedCategories, setExpandedCategories] = useState(categories.reduce((acc, cat) => {
    acc[cat] = true;
    return acc;
  }, {}));
  const [completedTimerModal, setCompletedTimerModal] = useState({ visible: false, timer: null });
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Setup interval to tick all running timers
  const timerIntervals = useRef({});
  
  useEffect(() => {
    // Clean up any running intervals
    return () => {
      Object.values(timerIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, []);

  useEffect(() => {
    // Setup interval for each running timer
    timers.forEach(timer => {
      if (timer.status === 'running') {
        // If there's already an interval for this timer, clear it
        if (timerIntervals.current[timer.id]) {
          clearInterval(timerIntervals.current[timer.id]);
        }
        
        // Setup new interval
        timerIntervals.current[timer.id] = setInterval(() => {
          dispatch({ type: 'TICK_TIMER', payload: timer.id });
          
          // Check if timer completed
          const updatedTimer = state.timers.find(t => t.id === timer.id);
          if (updatedTimer && updatedTimer.remainingTime === 0) {
            clearInterval(timerIntervals.current[timer.id]);
            delete timerIntervals.current[timer.id];
            
            // Add to history
            dispatch({
              type: 'ADD_HISTORY',
              payload: {
                id: Date.now().toString(),
                timerId: timer.id,
                name: timer.name,
                category: timer.category,
                duration: timer.duration,
                completedAt: new Date().toISOString()
              }
            });
            
            // Show completion modal
            setCompletedTimerModal({
              visible: true,
              timer: updatedTimer
            });
          }
          
          // Check for halfway alert
          if (updatedTimer && updatedTimer.reachedHalfway && !updatedTimer.halfwayAlertShown) {
            // Update timer to mark halfway alert as shown
            dispatch({
              type: 'UPDATE_TIMER',
              payload: { ...updatedTimer, halfwayAlertShown: true }
            });
            
            // Show halfway alert
            Alert.alert(
              'Halfway Point!',
              `You're halfway through "${updatedTimer.name}" timer!`,
              [{ text: 'OK' }]
            );
          }
        }, 1000);
      } else if (timerIntervals.current[timer.id]) {
        // If timer is not running but has an interval, clear it
        clearInterval(timerIntervals.current[timer.id]);
        delete timerIntervals.current[timer.id];
      }
    });
  }, [timers, dispatch, state.timers]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAddTimer = () => {
    navigation.navigate('AddTimer');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const groupTimersByCategory = () => {
    const grouped = {};
    
    categories.forEach(category => {
      grouped[category] = [];
    });
    
    timers.forEach(timer => {
      if (grouped[timer.category]) {
        grouped[timer.category].push(timer);
      } else {
        // Handle case where a timer has a category that's not in our predefined list
        if (!grouped['Other']) {
          grouped['Other'] = [];
        }
        grouped['Other'].push(timer);
      }
    });
    
    return grouped;
  };

  const filteredTimersByCategory = () => {
    const grouped = groupTimersByCategory();
    
    if (categoryFilter === 'All') {
      return grouped;
    }
    
    // Only return the selected category
    const filtered = {};
    filtered[categoryFilter] = grouped[categoryFilter] || [];
    return filtered;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Timers</Text>
        <View style={styles.filterContainer}>
          <Text>Filter: </Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setCategoryFilter('All')}
          >
            <Text style={categoryFilter === 'All' ? styles.activeFilter : {}}>All</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity 
              key={category}
              style={styles.filterButton}
              onPress={() => setCategoryFilter(category)}
            >
              <Text style={categoryFilter === category ? styles.activeFilter : {}}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {Object.entries(filteredTimersByCategory()).map(([category, categoryTimers]) => (
          categoryTimers.length > 0 && (
            <CategoryGroup
              key={category}
              category={category}
              timers={categoryTimers}
              expanded={expandedCategories[category]}
              toggleExpanded={() => toggleCategory(category)}
              dispatch={dispatch}
              timerIntervals={timerIntervals}
            />
          )
        ))}
        
        {Object.values(filteredTimersByCategory()).flat().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No timers found.</Text>
            <Text>Tap the "+" button to create a new timer.</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTimer}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={handleViewHistory}
        >
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>
      
      {/* Completed Timer Modal */}
      <Modal
        visible={completedTimerModal.visible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Completed!</Text>
            {completedTimerModal.timer && (
              <Text style={styles.modalText}>
                Congratulations! You've completed the "{completedTimerModal.timer.name}" timer.
              </Text>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setCompletedTimerModal({ visible: false, timer: null })}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  historyButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  historyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;