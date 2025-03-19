import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
  Share,
  ScrollView
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';

const HistoryScreen = () => {
  const { state } = useTimerContext();
  const { history } = state;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredHistory = selectedCategory === 'All' 
    ? history 
    : history.filter(item => item.category === selectedCategory);

  const getUniqueCategories = () => {
    const categories = new Set(history.map(item => item.category));
    return ['All', ...Array.from(categories)];
  };

  const exportHistoryData = async () => {
    try {
      const jsonData = JSON.stringify(history, null, 2);
      await Share.share({
        message: jsonData,
        title: 'Timer History Data'  
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export history data');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTime}>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</Text>
        <Text style={styles.itemDate}>Completed: {formatDate(item.completedAt)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer History</Text>
        
        <ScrollableCategories
          categories={getUniqueCategories()}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={exportHistoryData}
        >
          <Text style={styles.exportButtonText}>Export Data</Text>
        </TouchableOpacity>
      </View>
      
      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No history records found.</Text>
          <Text>Complete some timers to see them here!</Text>
        </View>
      )}
    </View>
  );
};

const ScrollableCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryFilters}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryFilter,
            selectedCategory === category && styles.selectedCategoryFilter
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[
            styles.categoryFilterText,
            selectedCategory === category && styles.selectedCategoryFilterText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
  categoryFilters: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  selectedCategoryFilter: {
    backgroundColor: '#2196F3',
  },
  categoryFilterText: {
    color: '#000',
  },
  selectedCategoryFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 8,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
  },
  itemDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  itemTime: {
    fontSize: 14,
    color: '#757575',
  },
  itemDate: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default HistoryScreen;