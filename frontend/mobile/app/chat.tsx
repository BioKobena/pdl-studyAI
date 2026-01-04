import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { storage } from '@/api/storage/token';
import { sendChatMessageMobile } from '@/api/chat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen = () => {
  const {subjectId} = useLocalSearchParams<{subjectId:string}>();
  const [sending, setSending]=useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async() => {
    const text = inputText.trim();
    if(!text || sending) return;

    if(!subjectId){
      Alert.alert("Erreur","subjectid Manquant. Reviens à l'étape précédante.");
      return
    }
    //ajoute le message de l'utilisateur 
    const userMsg:Message={
      id: Date.now().toString(),
      text,
      isUser:true,
      timestamp:new Date(),
    };    
   //ajoute le message en cours
   const botId = (Date.now()+1).toString();
   const pendingBot:Message={
      id:botId,
      text:"...",
      isUser:false,
      timestamp:new Date(),
    
   };
    setMessages(prev => [...prev, userMsg, pendingBot]);
    setInputText("");
    try{
      setSending(true);
      //recupère l'id du user

      const user = await storage.getUser<{id:string}>();
      if(!user?.id) throw new Error ("Utilisateur non trouvé");
      //On appelle maintenant l'API 
      const res = await sendChatMessageMobile({
        userId:user.id,
        subjectId,
        message:text,

      });

      //On remplace maintenant le bot par la vraie reponse 

      setMessages(prev =>
          prev.map(m => (m.id === botId ? { ...m, text: res.message ?? "Réponse vide" } : m))
      );   

    }catch(e:any){
      const msg = e?.message ?? "Erreur IA";
            setMessages(prev=>
              prev.map(m=>
                (m.id ===botId? {...m, text:"Erreur: ${String(msg)}"}
              :m)
            ));
 
    }finally{
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[styles.messageText, item.isUser && styles.userMessageText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.circle,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>studyAI chat</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={22} color="#2C94CB" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  circle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2C94CB',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#4A5568',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    color: '#fff',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 15,
    fontFamily: 'Kufam-Regular',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});

export default ChatScreen;