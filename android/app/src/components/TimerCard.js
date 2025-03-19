import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';

const TimerCard = ({ timer, dispatch, timerIntervals }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStart = () => {
    dispatch({ type: 'START_TIMER', payload: timer.id });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER', payload: timer.id });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER', payload: timer.id });
  };

  const getStatusColor = () => {
    switch (timer.status) {
      case 'running':
        return '#4CAF50'; // Green
      case 'paused':
        return '#FFC107'; // Yellow
      case 'completed':
        return '#9E9E9E'; // Gray
      default:
        return '#2196F3'; // Blue
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={styles.status}>{timer.status}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${timer.progress * 100}%`, backgroundColor: getStatusColor() }
          ]} 
        />
      </View>
      
      <View style={styles.actions}>
        {timer.status !== 'completed' && timer.status !== 'running' && (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStart}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        
        {timer.status === 'running' && (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={handlePause}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        
        {timer.status !== 'completed' && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  time: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  status: {
    fontSize: 12,
    textTransform: 'capitalize',
    color: '#757575',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TimerCard;