import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionList = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('Month');

  useEffect(() => {
    fetchTransactions();
  }, [filterPeriod]);

  const fetchTransactions = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
  
      const dateRange = getDateRange(filterPeriod);
  
      const transactionsRef = db
        .collection('transactions')
        .where('userId', '==', userId)
        .where('date', '>=', dateRange.start)
        .where('date', '<=', dateRange.end)
        .orderBy('date', 'desc');
  
      const snapshot = await transactionsRef.get();
      const transactionsList = [];
  
      snapshot.forEach(doc => {
        const data = doc.data();
        const transaction = {
          id: doc.id,
          ...data,
          date: data.date?.toDate(), // Convert Firebase Timestamp to JS Date
        };
        transactionsList.push(transaction);
      });
  
      setTransactions(transactionsList);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  
  const getDateRange = (period) => {
    const now = new Date();
    const start = new Date();
    
    if (period === 'Month') {
      start.setMonth(now.getMonth() - 1);
    }
    return { start, end: now };
  };

  const getTransactionIcon = (category) => {
    const icons = {
      Shopping: 'shopping',
      Food: 'food',
      Salary: 'cash',
      Subscription: 'youtube-subscription',
      Fuel: 'gas-station',
      Cinema: 'movie',
      default: 'currency-usd'
    };
    return icons[category] || icons.default;
  };

  const formatTime = (date) => {
    if (!date) return 'N/A'; // Fallback for missing dates
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  

  const formatAmount = (amount, type) => {
    const prefix = type === 'expense' ? '-$' : '+$';
    return `${prefix}${amount}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Icon name="arrow-left" size={24} color="#000" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filterPeriod === 'Month' && styles.activeFilter]}
          onPress={() => setFilterPeriod('Month')}
        >
          <Text style={[styles.filterText, filterPeriod === 'Month' && styles.activeFilterText]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filterPeriod === 'All' && styles.activeFilter]}
          onPress={() => setFilterPeriod('All')}
        >
          <Text style={[styles.filterText, filterPeriod === 'All' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.transactionsList}>
        {transactions.map(transaction => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              {/* <Icon 
                name={getTransactionIcon(transaction.category)} 
                size={24} 
                color="#666"
              /> */}
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionCategory}>
                {transaction.category}
              </Text>
              <Text style={styles.transactionDescription}>
                {transaction.description}
              </Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'expense' ? styles.expenseAmount : styles.incomeAmount
              ]}>
                {formatAmount(transaction.amount, transaction.type)}
              </Text>
              <Text style={styles.transactionTime}>
                {formatTime(transaction.date)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color:"blue"

  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  activeFilter: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    color: '#666',
    color:"black"

  },
  activeFilterText: {
    color: '#FFF',
  },
  transactionsList: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color:"black"

  },
  transactionDescription: {
    fontSize: 14,
    color:"black"

  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  expenseAmount: {
    color: '#FF4444',
  },
  incomeAmount: {
    color: '#4CAF50',
  },
  transactionTime: {
    fontSize: 12,
    color:"black"
  },
});

export default TransactionList;