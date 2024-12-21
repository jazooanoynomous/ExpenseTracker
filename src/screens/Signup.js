import React, { useState, useRef } from 'react';  
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const animationRef = useRef(null);

  const handleSignUp = () => {
    // Validation
    const errors = {
      fullName: fullName === '',
      email: email === '',
      password: password === '',
    };
    setInputErrors(errors);

    if (errors.fullName || errors.email || errors.password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill out all fields before signing up',
        position: 'bottom',
      });
      return;
    }

    // Proceed with Firebase auth signup
    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        setIsLoading(false);
        setIsSuccess(true);
        animationRef.current.bounceIn(800).then(() => {
          // Navigate to MainApp's Notification screen
          navigation.navigate('MainApp', { screen: 'Notification' });
        });
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.loadingText}>
          Creating account...
        </Animatable.Text>
      </View>
    );
  }

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <Animatable.View ref={animationRef}>
          <Animatable.Text animation="bounceIn" style={styles.successText}>
            Account created successfully!
          </Animatable.Text>
        </Animatable.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, inputErrors.fullName && styles.errorInput]}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={[styles.input, inputErrors.email && styles.errorInput]}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, inputErrors.password && styles.errorInput]}
        placeholder="Minimum 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>    
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>

      {/* Toast Message */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#6A5ACD',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  link: {
    color: '#FFF',
    marginTop: 10,
  },
  successText: {
    color: '#00FF00',
    fontSize: 18,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
  },
});
