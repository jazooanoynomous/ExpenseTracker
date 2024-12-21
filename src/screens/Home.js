import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      
      // Get date range based on selected period
      const dateRange = getDateRange(selectedPeriod);
      
      // Fetch transactions
      const transactionsRef = db
        .collection('transactions')
        .where('userId', '==', userId)
        .where('date', '>=', dateRange.start)
        .where('date', '<=', dateRange.end)
        .orderBy('date', 'desc');

      const snapshot = await transactionsRef.get();
      
      let totalIncome = 0;
      let totalExpenses = 0;
      const transactionsList = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.type === 'income') {
          totalIncome += data.amount;
        } else {
          totalExpenses += data.amount;
        }
        transactionsList.push({ id: doc.id, ...data });
      });

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setBalance(totalIncome - totalExpenses);
      setTransactions(transactionsList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDateRange = (period) => {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'Today':
        start.setHours(0, 0, 0, 0);
        return { start, end: now };
      case 'Week':
        start.setDate(now.getDate() - 7);
        return { start, end: now };
      case 'Month':
        start.setMonth(now.getMonth() - 1);
        return { start, end: now };
      case 'Year':
        start.setFullYear(now.getFullYear() - 1);
        return { start, end: now };
      default:
        return { start: now, end: now };
    }
  };

  const PeriodButton = ({ title }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === title && styles.selectedPeriod,
      ]}
      onPress={() => setSelectedPeriod(title)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === title && styles.selectedPeriodText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.balanceText}>Account Balance</Text>
        <Text style={styles.balanceAmount}>$ {balance.toFixed(1)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          {/* <Icon name="arrow-up-circle" size={24} color="#4CAF50" /> */}
          <Text style={styles.statTitle}>Income</Text>
          <Text style={styles.statAmount}>${income}</Text>
        </View>
        
        <View style={styles.statBox}>
          {/* <Icon name="arrow-down-circle" size={24} color="#F44336" /> */}
          <Text style={styles.statTitle}>Expenses</Text>
          <Text style={styles.statAmount}>${expenses}</Text>
        </View>
      </View>

      <View style={styles.periodContainer}>
        <PeriodButton title="Today" />
        <PeriodButton title="Week" />
        <PeriodButton title="Month" />
        <PeriodButton title="Year" />
      </View>

      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {/* <Icon
                  name={transaction.type === 'income' ? 'arrow-up' : 'arrow-down'}
                  size={20}
                  color={transaction.type === 'income' ? '#4CAF50' : '#F44336'}
                /> */}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionAmount}>
                  $ {transaction.amount}
                </Text>
                <Text style={styles.transactionType}>
                  {transaction.type}
                </Text>
              </View>
              <View style={styles.transactionCategory}>
        <Text style={styles.categoryText}>{transaction.category}</Text>
      </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="plus-circle" size={32} color="#6200EE" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="account" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#FFF',
  },
  balanceText: {
    fontSize: 16,
    color:"blue",
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  periodContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  selectedPeriod: {
    backgroundColor: '#6200EE',
  },
  periodButtonText: {
    color: '#666',
  },
  selectedPeriodText: {
    color: '#FFF',
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#6200EE',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  navItem: {
    alignItems: 'center',
  },
});

export default Home;