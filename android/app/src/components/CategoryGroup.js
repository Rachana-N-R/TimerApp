import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import TimerCard from './TimerCard';

const CategoryGroup = ({ 
  category, 
  timers, 
  expanded, 
  toggleExpanded, 
  dispatch,
  timerIntervals
}) => {
  const handleStartAll = () => {
    dispatch({ type: 'START_CATEGORY', payload: category });
  };

  const handlePauseAll = () => {
    dispatch({ type: 'PAUSE_CATEGORY', payload: category });
  };

  const handleResetAll = () => {
    dispatch({ type: 'RESET_CATEGORY', payload: category });
  };

  const getCompletedCount = () => {
    return timers.filter(timer => timer.status === 'completed').length;
  };

  const getRunningCount = () => {
    return timers.filter(timer => timer.status === 'running').length;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>{category}</Text>
          <Text style={styles.headerSubtext}>
            {timers.length} timer{timers.length !== 1 ? 's' : ''} • 
            {getCompletedCount()} completed • 
            {getRunningCount()} running
          </Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▼' : '►'}</Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={handleStartAll}
            >
              <Text style={styles.actionButtonText}>Start All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.pauseButton]}
              onPress={handlePauseAll}
            >
              <Text style={styles.actionButtonText}>Pause All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={handleResetAll}
            >
              <Text style={styles.actionButtonText}>Reset All</Text>
            </TouchableOpacity>
          </View>
          
          {timers.map(timer => (
            <TimerCard 
              key={timer.id} 
              timer={timer} 
              dispatch={dispatch}
              timerIntervals={timerIntervals}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  expandIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CategoryGroup;