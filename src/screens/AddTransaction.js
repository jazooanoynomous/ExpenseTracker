import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  Alert,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';

const AddTransaction = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 26.4579966,
    longitude: 50.0171982,
  }); // Default location
  const categories = [
    'Shopping',
    'Food',
    'Transportation',
    'Entertainment',
    'Bills',
    'Salary',
    'Investment',
    'Other',
  ];

  useEffect(() => {
    requestLocationPermission();
  }, []);
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setMarkerLocation({ latitude, longitude }); // Update marker location
      },
      error => {
        console.error(error);
        // Alert.alert('Error', 'Unable to get location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to tag transactions.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openMapModal = () => {
    getCurrentLocation(); // Fetch the user's current location
    setShowMapModal(true); // Show the map modal
  }

  const handleMapConfirm = async () => {
    setLocation(markerLocation);
    setShowMapModal(false);

    // Fetch the address for the selected location
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerLocation.latitude}&lon=${markerLocation.longitude}`,
      );
      const data = await response.json();
      setLocationAddress(data.display_name || 'Location found');
    } catch (error) {
      console.error('Error getting address:', error);
      setLocationAddress('Location found (address unavailable)');
    }
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message:
              'This app needs access to your camera to take photos of receipts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handleImageFromCamera();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      handleImageFromCamera();
    }
  };

  const handleImageFromCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: true,
    };

    ImagePicker.launchCamera(options, response => {
      setShowImageSourceModal(false);
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Error', 'Failed to take photo');
        return;
      }
      if (response.assets && response.assets[0]) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleImageFromLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, response => {
      setShowImageSourceModal(false);
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Error', 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        setImage(response.assets[0]);
      }
    });
  };

  const uploadImage = async () => {
    if (!image) return null;

    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    try {
      const reference = storage().ref(`receipts/${filename}`);
      await reference.putFile(uploadUri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!amount || !category || !type || !date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

      const userId = firebase.auth().currentUser.uid;
      const db = firebase.firestore();

      await db.collection('transactions').add({
        userId,
        amount: parseFloat(amount),
        category,
        description,
        type,
        date: firebase.firestore.Timestamp.fromDate(date),
        imageUrl,
        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              address: locationAddress,
            }
          : null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      navigation.goBack();
    } catch (error) {
      console.error('Transaction creation error:', error);
      Alert.alert('Error', 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Icon name="arrow-left" size={24} color="#000" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>How much?</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="$ 0"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCategories(!showCategories)}>
          <Text style={!category ? styles.placeholder : styles.inputText}>
            {category || 'Select Category'}
          </Text>
          {/* <Icon name="chevron-down" size={20} color="#666" /> */}
        </TouchableOpacity>

        {showCategories && (
          <View style={styles.categoryList}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategories(false);
                }}>
                <Text>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#999"
        />

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && styles.selectedTypeButton,
            ]}
            onPress={() => setType('income')}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'income' && styles.selectedTypeButtonText,
              ]}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && styles.selectedTypeButton,
              type === 'expense' && styles.expenseButton,
            ]}
            onPress={() => setType('expense')}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'expense' && styles.selectedTypeButtonText,
              ]}>
              Expense
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setShowImageSourceModal(true)}>
          {/* <Icon name="camera" size={24} color="#666" /> */}
          <Text style={styles.imageButtonText}>
            {image ? 'Change Receipt Image' : 'Add Receipt Image'}
          </Text>
        </TouchableOpacity>

        {image && (
          <Text style={styles.imageSelected}>
            Image selected: {image.fileName || 'receipt image'}
          </Text>
        )}

        <TouchableOpacity
          style={styles.input}
          onPress={openMapModal}>
          <Text style={styles.inputText}>
            {locationAddress || 'Pick Location'}
          </Text>
          {/* <Icon name="map-marker" size={20} color="#666" /> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showImageSourceModal}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={requestCameraPermission}>
              {/* <Icon name="camera" size={24} color="#666" /> */}
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleImageFromLibrary}>
              {/* <Icon name="image" size={24} color="#666" /> */}
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowImageSourceModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
 <Modal visible={showMapModal} transparent={false} animationType="slide">
   <View style={styles.modalContainer}>
     <MapView
      style={styles.map}
      initialRegion={{
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onPress={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
    >
      <Marker
        coordinate={markerLocation}
        draggable
        onDragEnd={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
      />
    </MapView>
    <View style={styles.mapActions}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setShowMapModal(false)}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleMapConfirm}
      >
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  
  mapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color:'blue'
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    padding: 8,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  categoryList: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  expenseButton: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTypeButtonText: {
    color: '#FFF',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#666',
  },
  imageSelected: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#6C5CE7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    width: '100%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
});

export default AddTransaction;