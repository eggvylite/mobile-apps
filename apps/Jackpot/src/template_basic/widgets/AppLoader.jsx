import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoaderKitView from 'react-native-loader-kit';

const AppLoader = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name="LineScale"
          color="blue"
        />

        {title ? (
          <Text style={styles.text}>{title}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});