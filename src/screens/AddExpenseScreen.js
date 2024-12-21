import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddExpenseScreen = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const addExpense = async () => {
    try {
      await addDoc(collection(db, 'expenses'), { name, amount: parseFloat(amount) });
      alert('Expense added!');
      setName('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <Button title="Add Expense" onPress={addExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});

export default AddExpenseScreen;
