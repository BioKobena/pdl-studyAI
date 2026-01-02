import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ResumeScreen = () => {
  const router = useRouter();
  const [hasResume, setHasResume] = useState(false);

  const handleGenerateResume = () => {
    setHasResume(true);
  };

  const handleStartChat = () => {
    router.push('/(tabs)/chat');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Résumé de votre cours</Text>

        {!hasResume ? (
          <View style={styles.pdfContainer}>
            <View style={styles.pdfBox}>
              <Image
                source={require('@/assets/images/pdf.png')}
                style={styles.pdfImage}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleGenerateResume}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Générer mon résumé</Text>
              <Ionicons name="sparkles" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectLabel}>Sujet :</Text>
                <Text style={styles.subjectText}>Application des graphes</Text>
              </View>

              <ScrollView
                style={styles.summaryContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.summaryText}>
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours
                  Révisions de cours Révisions de cours Révisions de cours Révisions de cours.
                </Text>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleStartChat}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Commencer un chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Kufam-Bold',
    color: '#2C94CB',
    marginBottom: 30,
    textAlign: 'center',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  pdfBox: {
    width: 280,
    height: 360,
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2C94CB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pdfImage: {
    width: 150,
    height: 150,
  },
  contentContainer: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    maxHeight: 550,
  },
  subjectHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subjectLabel: {
    fontSize: 16,
    fontFamily: 'Kufam-Bold',
    color: '#000',
    marginRight: 8,
  },
  subjectText: {
    fontSize: 16,
    fontFamily: 'Kufam-Regular',
    color: '#333',
    flex: 1,
  },
  summaryContent: {
    maxHeight: 450,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Kufam-Regular',
    color: '#797575ff',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#F9690E',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F9690E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: 'Kufam-Bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
});

export default ResumeScreen;