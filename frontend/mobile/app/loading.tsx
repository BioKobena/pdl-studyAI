import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(() => {
            setIsProcessing(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const handleCancel = () => {
        router.back();
    };

    const handleContinue = () => {
        router.push('/choose');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='dark' animated />

            <View style={styles.content}>
                <Text style={styles.title}>Fichier en cours de traitement</Text>

                <Text style={styles.subtitle}>
                    Veuillez patienter quelques secondes le temps de l'analyse.
                </Text>

                <View style={styles.processingBox}>
                    {/* @fsossa @Jojo-225 @micheleAnais @marlenegohi @Hyckael si ça vous plaît  */}
                    {/* <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: progressWidth }
              ]} 
            />
          </View> */}

                    <View style={styles.contentArea}>
                        {isProcessing ? (
                            <LottieView
                                source={require('@/assets/animations/pdf-loading.json')}
                                autoPlay
                                loop
                                style={styles.lottieAnimation}
                            />
                        ) : (
                            <View style={styles.pdfIconContainer}>
                                <Image
                                    source={require('@/assets/images/pdf.png')}
                                    style={styles.pdfImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    </View>
                </View>

                {isProcessing ? (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.continueButtonText}>Continuer</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Kufam-SemiBold',
        color: '#2C94CB',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Kufam-Regular',
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 50,
    },
    processingBox: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#2C94CB',
        borderStyle: 'dashed',
        borderRadius: 15,
        backgroundColor: '#E3F2FD',
        overflow: 'hidden',
        marginBottom: 40,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'transparent',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#F9690E',
    },
    contentArea: {
        paddingVertical: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },

    pdfText: {
        fontSize: 32,
        fontFamily: 'Kufam-Bold',
        color: '#F9690E',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#F9690E',
        borderRadius: 3,
        paddingVertical: 3,
        paddingHorizontal: 50,
        shadowColor: '#F9690E',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cancelButtonText: {
        fontSize: 18,
        fontFamily: 'Kufam-Bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 50,
        shadowColor: '#4CAF50',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        fontSize: 18,
        fontFamily: 'Kufam-Bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    // pdfIconContainer: {
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     marginVertical: 20,
    // },
    documentWrapper: {
        position: 'relative',
    },
    documentPage: {
        width: 120,
        height: 140,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    documentFold: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTopWidth: 25,
        borderTopColor: '#2C94CB',
        borderLeftWidth: 25,
        borderLeftColor: 'transparent',
        borderTopRightRadius: 8,
    },
    documentLines: {
        marginTop: 35,
        gap: 12,
    },
    line: {
        width: '100%',
        height: 3,
        backgroundColor: '#D0D0D0',
        borderRadius: 2,
    },
    pdfIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    pdfImage: {
        width: 150,
        height: 150,
    },
});

export default HomeScreen;