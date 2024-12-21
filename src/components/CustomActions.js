// import { StyleSheet, TouchableOpacity, View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Replacement for Expo ImagePicker
// import Geolocation from '@react-native-community/geolocation'; // Replacement for Expo Location
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { AudioRecorder, AudioUtils } from 'react-native-audio'; // Replacement for Expo Audio
// import { useEffect, useState } from 'react';

// const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
//     const [recordingPath, setRecordingPath] = useState(null);

//     useEffect(() => {
//         return () => {
//             if (recordingPath) {
//                 stopRecording();
//             }
//         };
//     }, [recordingPath]);

//     const onActionPress = () => {
//         const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Record a Sound', 'Cancel'];
//         const cancelButtonIndex = options.length - 1;
//         Alert.alert(
//             'Choose an Action',
//             '',
//             options.map((option, index) => ({
//                 text: option,
//                 onPress: () => handleActionPress(index),
//                 style: index === cancelButtonIndex ? 'cancel' : 'default',
//             })),
//         );
//     };

//     const handleActionPress = async (index) => {
//         switch (index) {
//             case 0:
//                 pickImage();
//                 break;
//             case 1:
//                 takePhoto();
//                 break;
//             case 2:
//                 getLocation();
//                 break;
//             case 3:
//                 startRecording();
//                 break;
//             default:
//         }
//     };

//     const startRecording = async () => {
//         try {
//             const permissionGranted = await requestAudioPermission();
//             if (permissionGranted) {
//                 const audioPath = `${AudioUtils.DocumentDirectoryPath}/${userID}-${Date.now()}.aac`;
//                 setRecordingPath(audioPath);
//                 AudioRecorder.prepareRecordingAtPath(audioPath, {
//                     SampleRate: 22050,
//                     Channels: 1,
//                     AudioQuality: 'High',
//                     AudioEncoding: 'aac',
//                 });
//                 AudioRecorder.startRecording();
//                 Alert.alert('Recording...', undefined, [
//                     { text: 'Cancel', onPress: stopRecording },
//                     { text: 'Stop and Send', onPress: sendRecordedSound },
//                 ]);
//             }
//         } catch (err) {
//             Alert.alert('Failed to record!');
//         }
//     };

//     const stopRecording = async () => {
//         if (recordingPath) {
//             await AudioRecorder.stopRecording();
//             setRecordingPath(null);
//         }
//     };

//     const sendRecordedSound = async () => {
//         await stopRecording();
//         const uniqueRefString = generateReference(recordingPath);
//         const newUploadRef = ref(storage, uniqueRefString);
//         const response = await fetch(recordingPath);
//         const blob = await response.blob();
//         uploadBytes(newUploadRef, blob).then(async (snapshot) => {
//             const soundURL = await getDownloadURL(snapshot.ref);
//             onSend({ audio: soundURL });
//         });
//     };

//     const getLocation = async () => {
//         const permissionGranted = await requestLocationPermission();
//         if (permissionGranted) {
//             Geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     onSend({ location: { latitude, longitude } });
//                 },
//                 (error) => Alert.alert('Error', error.message),
//                 { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
//             );
//         } else {
//             Alert.alert("Permissions haven't been granted.");
//         }
//     };

//     const uploadAndSendImage = async (imageURI) => {
//         const uniqueRefString = generateReference(imageURI);
//         const newUploadRef = ref(storage, uniqueRefString);
//         const response = await fetch(imageURI);
//         const blob = await response.blob();
//         uploadBytes(newUploadRef, blob).then(async (snapshot) => {
//             const imageURL = await getDownloadURL(snapshot.ref);
//             onSend({ image: imageURL });
//         });
//     };

//     const pickImage = async () => {
//         const result = await launchImageLibrary({ mediaType: 'photo' });
//         if (!result.didCancel) {
//             uploadAndSendImage(result.assets[0].uri);
//         }
//     };

//     const takePhoto = async () => {
//         const result = await launchCamera({ mediaType: 'photo' });
//         if (!result.didCancel) {
//             uploadAndSendImage(result.assets[0].uri);
//         }
//     };

//     const generateReference = (uri) => {
//         const timeStamp = Date.now();
//         const imageName = uri.split('/').pop();
//         return `${userID}-${timeStamp}-${imageName}`;
//     };

//     const requestAudioPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//                 {
//                     title: 'Audio Recording Permission',
//                     message: 'This app needs access to your microphone to record audio.',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 },
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 {
//                     title: 'Location Permission',
//                     message: 'This app needs access to your location to share it in the chat.',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 },
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//         return true;
//     };

//     return (
//         <TouchableOpacity style={styles.container} onPress={onActionPress}>
//             <View style={[styles.wrapper, wrapperStyle]}>
//                 <Text style={[styles.iconText, iconTextStyle]}>+</Text>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         width: 26,
//         height: 26,
//         marginLeft: 10,
//         marginBottom: 10,
//     },
//     wrapper: {
//         borderRadius: 13,
//         borderColor: '#b2b2b2',
//         borderWidth: 2,
//         flex: 1,
//     },
//     iconText: {
//         color: '#b2b2b2',
//         fontWeight: 'bold',
//         fontSize: 16,
//         backgroundColor: 'transparent',
//         textAlign: 'center',
//     },
// });

// export default CustomActions;
