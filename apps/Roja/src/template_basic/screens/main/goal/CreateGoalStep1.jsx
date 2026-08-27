import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, } from "react-native";
import Icon from 'react-native-vector-icons/Feather'; // Changed for CLI
import { useNavigation } from "@react-navigation/native";
import TopBar from "../../../component/TopBar";
import SubmitBtn from "../../../component/SubmitBtn";
import styles from "../../../styles/goalStyles";
import { useSelector } from "react-redux";
import { goalColor } from "../../../../constants/content";
import CloudImage from "../../../../utill/CloudImage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGoalStep1() {
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const { goaltragets } = useSelector((state) => state.menuicons)


  const handleContinue = () => {
    if (!selectedGoal) return;
    navigation.navigate("CreateGoalStep2", {
      selectedGoal: selectedGoal
    });
  };
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left','right','top']}>

      <TopBar title="Create Goal" showBack={true} onBackPress={handleBackPress} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What's Your Savings Target?</Text>
        </View>

        {/* Goal Categories Grid */}
        <View style={styles.categoriesGrid}>
          {goaltragets.map((category, key) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedGoal?.id === category.id && styles.categoryCardSelected,
              ]}
              onPress={() => setSelectedGoal(category)}
            >
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: `${goalColor[key]}20` },
                ]}
              >
                <CloudImage
                  style={styles.categoryImage}
                  page='goal'
                  cloudSource={category?.image} />

              </View>
              <Text style={styles.categoryTitle}>{category.name}</Text>

              {selectedGoal?.id === category.id && (
                <View style={styles.selectedCheck}>
                  <Icon name="check-circle" size={20} color="#4A90E2" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>


        <View style={{ marginStart: 20, marginEnd: 20 }}>

          <SubmitBtn
            disabled = {!selectedGoal ? true :false}
            disableGradient = {!selectedGoal ? true :false}
            text={'Continue'}
            submit={handleContinue}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

