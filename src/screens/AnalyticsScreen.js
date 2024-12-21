import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const AnalyticsScreen = () => {
  const { width } = Dimensions.get('window');
  
  const data = [
    { name: 'Food', amount: 50, color: '#FF6384' },
    { name: 'Transport', amount: 30, color: '#36A2EB' },
    { name: 'Other', amount: 20, color: '#FFCE56' },
  ];

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          return (
            <View 
              key={index} 
              style={[
                styles.pieSlice, 
                { 
                  backgroundColor: item.color,
                  width: width * 0.6,
                  height: width * 0.6,
                  borderRadius: width * 0.3,
                  transform: [{ 
                    rotate: `${(index * 360) / data.length}deg` 
                  }]
                }
              ]}
            />
          );
        })}
      </View>
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: item.color }
              ]} 
            />
            <Text style={styles.legendText}>
              {item.name}: {item.amount} ({((item.amount / total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pieSlice: {
    position: 'absolute',
    opacity: 0.7,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});

export default AnalyticsScreen;