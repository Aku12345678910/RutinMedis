import { useState } from "react";
import {
    View, Text, StyleSheet, 
    TextInput, TouchableOpacity, ScrollView, 
    Switch, Dimensions, Platform, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const FREQUENCIES = [
    {
        id: "1",
        label: "One daily",
        icon: "sunny-outline" as const,
        times: ["09:00"],
    },
    {
        id: "2",
        label: "Twice daily",
        icon: "sync-outline" as const,
        times: ["09:00", "21:00"], 
    },
    {
        id: "3",
        label: "Three times daily",
        icon: "time-outline" as const,
        times: ["09:00", "15:00", "21:00"], 
    },
    {
        id: "4",
        label: "Four times daily",
        icon: "repeat-outline" as const,
        times: ["09:00", "13:00", "17:00", "21:00"], 
    },
    {id: "5", label: "As needed", icon: "caledar-outline" as const, times:[]}
];

export default function addMedicationScreen() {
    const renderFrequencyOptions = () => {
        return (
            <View>

            </View>
        )
    }
    return (
        <View>
            {}
            <LinearGradient
                colors={['#1a8e2d', '#146922']}
                start={{x:0, y:0}}
                end={{x:1, y:1}}
            />
            <View>
                <View>
                    <TouchableOpacity>
                        <Ionicons name="chevron-black" size={28} color={'#1a8e2d'}/>
                    </TouchableOpacity>
                    <Text>Jadwal Obat Baru</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>{}
                        <View>
                            <Text>How Often ?</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}