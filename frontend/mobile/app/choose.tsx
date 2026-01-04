import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ChooseScreen = () => {
    const router = useRouter();

    const { subjectId,fileName } = useLocalSearchParams <{
        subjectId : string;
        fileName? : string;

    }>();
    useEffect(()=> {
        console.log("ChooseScreen subjectId:",subjectId,"fileName",fileName);
    },[subjectId,fileName]);

    const handleGenerateQuiz = () => {
        router.replace({pathname:"/quiz",params:{subjectId}});
    };

    const handleChat = () => {
        router.push({pathname:"/chat",params:{subjectId}});
    };

    const handleGenerateSummary = () => {
        router.push({pathname:"/summary",params:{subjectId,fileName}});
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='dark' animated />

            <View style={styles.backgroundPattern}>
                {[...Array(20)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.circle,
                            {
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.3 + 0.1,
                            },
                        ]}
                    />
                ))}
            </View>

            <View style={styles.content}>
                <Text style={styles.logo}>StudyAI</Text>

                <Text style={styles.successMessage}>
                    Votre fichier a été uploadé avec succès
                </Text>

                <View style={styles.robotContainer}>
                    <LottieView
                        source={require('@/assets/animations/robot.json')}
                        autoPlay
                        loop
                        style={styles.robotAnimation}
                    />
                </View>

                <View style={styles.pdfCard}>
                    <View style={styles.pdfIconContainer}>
                        <Image
                            source={require('@/assets/images/pdf.png')}
                            style={styles.pdfImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <Text style={styles.optionsText}>Veuillez choisir une option :</Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleGenerateQuiz}
                        activeOpacity={0.8}
                    >

                        <Text style={styles.actionButtonText}>Générer un quiz</Text>
                        <MaterialCommunityIcons
                            name="file-question-outline"
                            size={24}
                            color="#fff"
                            style={styles.buttonIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleChat}
                        activeOpacity={0.8}
                    >

                        <Text style={styles.actionButtonText}>Chattez avec studyAI</Text>
                        <Ionicons
                            name="chatbubbles-outline"
                            size={24}
                            color="#fff"
                            style={styles.buttonIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleGenerateSummary}
                        activeOpacity={0.8}
                    >

                        <Text style={styles.actionButtonText}>Générer un résumé</Text>
                        <Ionicons
                            name="document-text-outline"
                            size={24}
                            color="#fff"
                            style={styles.buttonIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
        alignItems: 'center',
    },
    logo: {
        fontSize: 32,
        fontFamily: 'Kufam-Bold',
        color: '#2C94CB',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: 0.5,
    },
    successMessage: {
        fontSize: 16,
        fontFamily: 'Kufam-SemiBold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    robotContainer: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    robotAnimation: {
        width: '100%',
        height: '100%',
    },
    pdfCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 30,
        minWidth: 200,
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
    pdfBadge: {
        position: 'absolute',
        bottom: -5,
        right: -10,
        backgroundColor: '#E53935',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 5,
    },
    pdfBadgeText: {
        fontSize: 14,
        fontFamily: 'Kufam-Bold',
        color: '#fff',
    },
    pdfFileName: {
        fontSize: 13,
        fontFamily: 'Kufam-Regular',
        color: '#666',
        textAlign: 'center',
    },
    optionsText: {
        fontSize: 16,
        fontFamily: 'Kufam-SemiBold',
        color: '#333',
        marginBottom: 20,
    },
    buttonsContainer: {
        width: '100%',
        gap: 15,
    },
    actionButton: {
        backgroundColor: '#2C94CB',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2C94CB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        gap: 5
    },
    buttonIcon: {
        marginRight: 10,
    },
    actionButtonText: {
        fontSize: 17,
        fontFamily: 'Kufam-SemiBold',
        color: '#fff',
        letterSpacing: 0.3,
    },
});

export default ChooseScreen;