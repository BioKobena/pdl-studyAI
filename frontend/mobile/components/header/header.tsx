import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { logoHeader } from '@/styles/logo'

const Header = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={25} color="#000" />
            </TouchableOpacity>
            <Text style={[logoHeader, styles.logoAlign]}>StudyAI</Text>
            <View style={{ flex: 1 }} />
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: "-3%", 
        
    },
    backButton: {
        flex: 1, alignItems: "flex-start", padding: 10
    },
    logoAlign: {
        flex: 2, textAlign: "center"
    }
})