import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'
import { themeColors } from '../../Common';
import { getFontSize } from '../../../constants/Font';

const LocationPicker = ({ onLoad, latitude, longitude }) => {
    const [region, setRegion] = useState(null);
    const [address, setAddress] = useState(null);


    useEffect(() => {
        getCurrentLocation();
    }, []);


    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const currentRegion = {
                    latitude: latitude || position.coords.latitude,
                    longitude: longitude || position.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };

                setRegion(currentRegion);
                reverseGeocode(currentRegion);
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
            },
        );
    };

    const reverseGeocode = async (location) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`,
            );

            const data = await response.json();

            setAddress({
                address: data.display_name,
                city:
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    '',
                state: data.address.state || '',
                zipCode: data.address.postcode || '',
                country: data.address.country || '',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onRegionChangeComplete = (newRegion) => {
        setRegion(newRegion);
        reverseGeocode(newRegion);
    };

    const confirmLocation = () => {
        // route.params?.onLocationSelected?.({
        //     ...address,
        //     latitude: region?.latitude,
        //     longitude: region?.longitude,
        // });

        const load = {
            state: address.state,
            city: address.city,
            zipCode: address.zipCode,
            address: address.address,
            latitude: region?.latitude,
            longitude: region?.longitude
        }
        onLoad(load)


        // navigation.replace('Register', { state: address.state, city: address.city, zipCode: address.zipCode, address: address.address, latitude: region?.latitude, longitude: region?.longitude });
    }


    return (
        <View style={styles.container}>

            <GooglePlacesAutocomplete
                placeholder="Search Address"
                fetchDetails={true}
                onFail={(error) => {
                    console.log('Google Places Error:', error);
                }}
                onPress={(data, details) => {

                    const currentRegion = {
                        latitude: details?.geometry.location.lat,
                        longitude: details?.geometry.location.lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    };

                    setRegion(currentRegion);


                }}
                query={{
                    key: 'AIzaSyDKxjq7hjocUmfQT_Emquj1WCLQRAdq4Jw',
                    language: 'en',
                }}
                styles={{
                    container: {
                        position: 'absolute',
                        top: 80,
                        left: 10,
                        right: 10,
                        zIndex: 1000,
                    },
                }}
            />
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={onRegionChangeComplete}
            />

            {/* Fixed Center Pin */}
            <View style={styles.pinContainer}>
                <Text style={styles.pin}>📍</Text>
            </View>

            {/* Bottom Address Card */}
            <View style={styles.bottomCard}>
                <Text style={[styles.text, { fontSize: getFontSize(12) }]}>{address?.address}</Text>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={confirmLocation}
                >
                    <Text style={styles.btnText}>
                        Confirm Location
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.backgroudColor
    },
    map: {
        flex: 1,
    },
    pinContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
    },

    bottomCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        elevation: 5,
    },
    btn: { backgroundColor: themeColors.primarColor, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    btnText: { color: themeColors.btnColor, fontSize: getFontSize(16), fontWeight: 'bold' },
})


export default LocationPicker;