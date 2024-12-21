// import { useEffect, useState } from 'react';
// import { StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, Platform, Text, Alert } from 'react-native';
// import { GiftedChat, Bubble, SystemMessage, Day, InputToolbar } from "react-native-gifted-chat";
// import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";
// import CustomActions from './CustomActions';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import MapView from 'react-native-maps';
// import { AudioRecorder, AudioUtils } from 'react-native-audio';

// const Chat = ({ route, navigation, db, isConnected, storage }) => {

//     const { name, color, userID } = route.params;
//     const [messages, setMessages] = useState([]);
//     let soundObject = null;

//     const loadCache = async () => {
//         try {
//             const cachedList = await AsyncStorage.getItem('user_messages') || [];
//             setMessages(JSON.parse(cachedList));
//         } catch (error) {
//             console.error("Error loading cache: ", error);
//         }
//     };

//     const cacheMessages = async (messagesToCache) => {
//         try {
//             await AsyncStorage.setItem('user_messages', JSON.stringify(messagesToCache));
//         } catch (error) {
//             console.error("Error caching messages: ", error);
//         }
//     };

//     const onSend = (newMessages) => {
//         addDoc(collection(db, "messages"), newMessages[0]);
//     };

//     useEffect(() => {
//         let unsubMessages;
//         if (isConnected) {
//             if (unsubMessages) unsubMessages();
//             unsubMessages = null;

//             const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
//             unsubMessages = onSnapshot(q, (documentsSnapshot) => {
//                 let newMessages = [];
//                 documentsSnapshot.forEach(doc => {
//                     newMessages.push({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis()) });
//                 });
//                 cacheMessages(newMessages);
//                 setMessages(newMessages);
//             });
//         } else {
//             loadCache();
//         }

//         return () => {
//             if (unsubMessages) unsubMessages();
//         };
//     }, [isConnected]);

//     useEffect(() => {
//         navigation.setOptions({ title: name });
//     }, []);

//     const renderDay = (props) => (
//         <Day
//             {...props}
//             textStyle={{
//                 color: 'black',
//                 backgroundColor: 'rgba(248,248,248,0.6)',
//                 paddingHorizontal: 15,
//                 paddingVertical: 5,
//                 fontWeight: '500',
//                 borderRadius: 10,
//             }}
//         />
//     );

//     const renderSystemMessage = (props) => (
//         <SystemMessage
//             {...props}
//             textStyle={{
//                 color: 'black',
//                 backgroundColor: 'rgba(248,248,248,0.6)',
//                 paddingHorizontal: 15,
//                 paddingVertical: 5,
//                 fontWeight: '500',
//                 borderRadius: 10,
//                 margin: 3
//             }}
//         />
//     );

//     const renderBubble = (props) => (
//         <Bubble
//             {...props}
//             timeTextStyle={{
//                 right: { color: 'black' },
//             }}
//             textStyle={{
//                 right: { color: 'black' },
//             }}
//             wrapperStyle={{
//                 right: { backgroundColor: '#d3edf8' },
//                 left: { backgroundColor: '#FFF' },
//             }}
//         />
//     );

//     const renderInputToolbar = (props) => {
//         if (isConnected) {
//             return <InputToolbar {...props} />;
//         } else {
//             return null;
//         }
//     };

//     const renderCustomActions = (props) => (
//         <CustomActions storage={storage} userID={userID} {...props} />
//     );

//     const renderCustomView = (props) => {
//         const { currentMessage } = props;
//         if (currentMessage.location) {
//             return (
//                 <MapView
//                     style={{
//                         width: 150,
//                         height: 100,
//                         borderRadius: 13,
//                         margin: 3
//                     }}
//                     region={{
//                         latitude: currentMessage.location.latitude,
//                         longitude: currentMessage.location.longitude,
//                         latitudeDelta: 0.0922,
//                         longitudeDelta: 0.0421,
//                     }}
//                 />
//             );
//         }
//         return null;
//     };

//     const playSound = async (audioUri) => {
//         try {
//             if (soundObject) {
//                 soundObject.stop();
//                 soundObject.release();
//             }

//             const path = audioUri.startsWith('file://') ? audioUri : `file://${audioUri}`;

//             AudioRecorder.playRecording(path, {
//                 success: () => console.log('Playback success'),
//                 error: (err) => console.error('Playback error', err),
//             });
//         } catch (error) {
//             console.error('Error playing sound', error);
//             Alert.alert("Error", "Failed to play the sound.");
//         }
//     };

//     const renderMessageAudio = (props) => (
//         <View {...props}>
//             <TouchableOpacity
//                 style={{
//                     backgroundColor: "#cce7ff", borderRadius: 10, margin: 5
//                 }}
//                 onPress={() => playSound(props.currentMessage.audio)}
//             >
//                 <Text style={{
//                     textAlign: "center", color: 'black', padding: 5
//                 }}>Play Sound</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <View style={[styles.container, { backgroundColor: color }]}>            
//             <GiftedChat
//                 messages={messages}
//                 renderSystemMessage={renderSystemMessage}
//                 renderBubble={renderBubble}
//                 renderDay={renderDay}
//                 renderActions={renderCustomActions}
//                 renderCustomView={renderCustomView}
//                 renderInputToolbar={renderInputToolbar}
//                 renderMessageAudio={renderMessageAudio}
//                 onSend={messages => onSend(messages)}
//                 user={{
//                     _id: userID,
//                     name: name
//                 }}
//             />
//             {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     }
// });

// export default Chat;
