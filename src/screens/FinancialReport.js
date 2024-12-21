import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import firebase from "@react-native-firebase/app";

const screenWidth = Dimensions.get("window").width;

const FinancialReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState("Month");

  useEffect(() => {
    fetchTransactions();
  }, [filterPeriod]);

  const fetchTransactions = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();

      // Example filter logic
      const dateRange = getDateRange(filterPeriod);

      const transactionsRef = db
        .collection("transactions")
        .where("userId", "==", userId)
        .where("date", ">=", dateRange.start)
        .where("date", "<=", dateRange.end);

      const snapshot = await transactionsRef.get();
      const transactionsList = [];
      snapshot.forEach((doc) => {
        transactionsList.push({ id: doc.id, ...doc.data() });
      });

      setTransactions(transactionsList);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getDateRange = (period) => {
    const now = new Date();
    const start = new Date();

    if (period === "Month") {
      start.setMonth(now.getMonth() - 1);
    }
    return { start, end: now };
  };

  const calculateCategoryTotals = () => {
    const totals = {};
    transactions.forEach((transaction) => {
      if (!totals[transaction.category]) {
        totals[transaction.category] = 0;
      }
      totals[transaction.category] += transaction.amount;
    });
    return totals;
  };

  const calculateTotalAmount = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const categoryTotals = calculateCategoryTotals();
  const totalAmount = calculateTotalAmount();
  const getCategoryColor = (category) => {
    const colors = {
      Shopping: "#FF6384",
      Subscription: "#36A2EB",
      Food: "#FFCE56",
      Transportation: "#4BC0C0",
      Other: "#9966FF",
    };
    return colors[category] || "#ccc";
  };


  const pieChartData = Object.keys(categoryTotals).map((category) => ({
    name: category,
    amount: categoryTotals[category],
    color: getCategoryColor(category),
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Report</Text>
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterPeriod === "Month" && styles.activeFilter]}
          onPress={() => setFilterPeriod("Month")}
        >
          <Text style={styles.filterText}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterPeriod === "All" && styles.activeFilter]}
          onPress={() => setFilterPeriod("All")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieChartData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Expense and Income Categories */}
      <View style={styles.categoryList}>
        {Object.keys(categoryTotals).map((category) => (
          <View key={category} style={styles.categoryItem}>
            <View style={[styles.categoryColor, { backgroundColor: getCategoryColor(category) }]} />
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryAmount}>${categoryTotals[category].toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color:"blue"
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  activeFilter: {
    backgroundColor: "#f00",
    borderColor: "#f00",
  },
  filterText: {
    color: "#000",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color:"black"
  },
  categoryList: {
    marginHorizontal: 15,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color:"black"
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color:"black"
  },
});

export default FinancialReport;
