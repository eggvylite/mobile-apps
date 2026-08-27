// src/screens/MyProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, TextInput, Alert, Image, ActivityIndicator, Modal, Platform, PermissionsAndroid, StatusBar, Dimensions, Animated, } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../../../component/TopBar';
import { useSelector } from 'react-redux';
import CommonFunction from '../../../../utill/CommonFunction';
import { getFontSize } from '../../../../constants/Font';
import { fontsFamily } from '../../../../constants/fontsFamily';
import moment from 'moment';
import { content } from '../../../../constants/content';
import { themeColors } from '../../../Common';
import { useForm } from 'react-hook-form';
import SubmitBtn from '../../../component/SubmitBtn';
import { getCitylist, getStatelist, getZiplist, imgUpdate, profileUpdate } from '../../../../constants/Loginapi';
import { Dropdown } from "react-native-element-dropdown";
import CloudImage from '../../../../utill/CloudImage';
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch } from 'react-redux';


const { width } = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { cusDetails, loading, error } = useSelector((state) => state.customer);
  const [profile, setProfile] = useState('');
  const [tempProfile, setTempProfile] = useState(profile);
  const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur', });
  const [state, setState] = useState([])
  const [city, setCity] = useState([])
  const [zip, setzip] = useState([])
  const dispatch = useDispatch()
  const imgOption = {
    width: 300,
    height: 300,
    cropping: true,
    compressImageQuality: 1,
    compressImageMaxHeight: 1500,
    compressImageMaxWidth: 1000,

  }



  useEffect(() => {

    requestPermissions();
  }, []);


  useEffect(() => {
    if (cusDetails) {
      getDetails()

    }

  }, [cusDetails])

  const getDetails = async () => {
    const info = {
      ...cusDetails,
      state: cusDetails.state?._id ? cusDetails.state?._id : cusDetails.state,
      city: cusDetails.city?._id ? cusDetails.city?._id : cusDetails.city,
      zip: cusDetails.zip?._id ? cusDetails.zip?._id : cusDetails.zip,
      platform: CommonFunction.getOS(),
      device_name: await CommonFunction.getdevicename(),
      ipaddress: await CommonFunction.getipaddress()
    }


    getState()
    info.state && getCity(info.state)
    info.city && getZip(info.city)
    cusDetails.photo && setProfileImage(cusDetails.photo)

    setProfile(info)
  }

  useEffect(() => {
    reset(profile)
  }, [profile])

  const getState = async () => {
    try {
      const states_list = await getStatelist()
      setState(states_list)

    } catch (err) {
      console.log(err)

    }
  }

  const getCity = async (stateid) => {
    try {
      const city_list = await getCitylist(stateid)
      setCity(city_list)

    } catch (err) {
      console.log(err)

    }

  }

  const getZip = async (cityid) => {
    try {
      const zip_list = await getZiplist(cityid)
      setzip(zip_list)

    } catch (err) {
      console.log(err)

    }
  }


  useEffect(() => {
    if (isEditing) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 100,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isEditing]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera access to take profile photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: "Gallery Permission",
              message: "App needs gallery access to select profile photos",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
        } else {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: "Storage Permission",
              message: "App needs storage access to select profile photos",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };


  const submit = async () => {
    setIsLoading(true)
    try {
      const updateProfile = await profileUpdate(storedata?.id, profile, dispatch)
    } catch (error) {
      console.log(error)
    } finally {
      setIsEditing(false)
      setIsLoading(false)
    }

  }

  const handleInputChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  }


  const saveProfileData = async (imageUri) => {
    try {
      const profileData = await imgUpdate(storedata, imageUri, dispatch)
      setProfileImage(profileData.photo)

    } catch (error) {
      console.log(error)
    } finally {
      setShowImageOptions(false);
    }

  };

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 350,
        animated: true,
      });
    }, 100);
  };

  const camera = async () => {
    try {
      const uploadImg = await ImagePicker.openCamera(imgOption)
      saveProfileData(uploadImg?.path)
    } catch (error) {
      setShowImageOptions(false);
    }


  }

  const gallery = async () => {
    try {
      const uploadImg = await ImagePicker.openPicker(imgOption)
      saveProfileData(uploadImg?.path)
    } catch (error) {
      setShowImageOptions(false);
    }

  }



  // Image picker functions
  const handleImagePick = (type) => {
    console.log(type)

    try {
      if (type === 'camera') {
        camera();
      } else {
        gallery()
      }

    } catch (error) {
      console.error('Error launching image picker:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
    }



  };



  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setProfileImage(null);
            // await AsyncStorage.removeItem('profileImage');
            // await AsyncStorage.removeItem('userProfileData');
            // setShowImageOptions(false);
            // Alert.alert('Success', 'Profile photo removed');
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    var dt = moment(date).format(storedata?.format)
    return dt
  }

  const ProfileField = ({ label, value, field, editable, keyboardType = 'default', icon }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldLabelContainer}>
        {icon && <Feather name={icon} size={14} color="#94A3B8" style={styles.fieldIcon} />}
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {editable ? (
        <View style={[styles.fieldInputWrapper, { borderBottomColor: '#5A21F1' }]}>
          <TextInput
            style={styles.fieldInput}
            value={tempProfile[field]}
            onChangeText={(text) => setTempProfile({ ...tempProfile, [field]: text })}
            placeholderTextColor="#94A3B8"
            keyboardType={keyboardType}
          />
          <View style={styles.editIndicator}>
            <Feather name="edit-2" size={12} color="#5A21F1" />
          </View>
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );






  return (
    <SafeAreaView style={styles.container} edges={['left','right','top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <TopBar
        title="My Profile"
        showBack={true}
        onBackPress={() => navigation.navigate('Dashboard')}
      />

      {
        isEditing ? <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <Animated.View style={[styles.container, { opacity: fadeAnim, }]}>
              <View style={styles.formSection}>
                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    First Name <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'First Name'}
                    placeholderTextColor="#94A3B8"
                    value={profile?.firstname}
                    onChangeText={text =>
                      handleInputChange('firstname', text)
                    }
                    {...register("firstname", {
                      required: content.fieldrequire,
                      validate: {
                        noLongSpaces: (value) =>
                          !/\s{2,}/.test(value) || "Multiple spaces are not allowed",

                        noSpecialChars: (value) =>
                          /^[a-zA-Z\s]*$/.test(value) || "Invalid characters in name",

                        minTwoChars: (value) =>
                          value.trim().length >= 2 || "Must contain at least 2 characters",
                      },

                    })}
                  />
                  {errors.firstname && (
                    <Text style={styles.errortext}>{errors.firstname.message}</Text>
                  )}
                </View>

                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Last Name <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'Last Name'}
                    placeholderTextColor="#94A3B8"
                    value={profile?.lastname}
                    onChangeText={text =>
                      handleInputChange('lastname', text)
                    }
                    {...register("lastname", {
                      required: content.fieldrequire,
                      validate: {
                        noLongSpaces: (value) =>
                          !/\s{2,}/.test(value) || "Multiple spaces are not allowed",

                        noSpecialChars: (value) =>
                          /^[a-zA-Z\s]*$/.test(value) || "Invalid characters in name",

                        minTwoChars: (value) =>
                          value.trim().length >= 2 || "Must contain at least 2 characters",
                      },

                    })}
                  />
                  {errors.lastname && (
                    <Text style={styles.errortext}>{errors.lastname.message}</Text>
                  )}
                </View>



                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Email <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      color: '#8493a7',
                    }]}
                    placeholder={'Email'}
                    editable={false}
                    placeholderTextColor="#94A3B8"
                    value={CommonFunction.decryptString(profile?.email)}
                    onChangeText={text =>
                      handleInputChange('email', text)
                    }
                    {...register("email", {
                      required: content.fieldrequire,
                    })}
                  />
                  {errors.email && (
                    <Text style={styles.errortext}>{errors.email.message}</Text>
                  )}
                </View>

                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Cell Phone Number <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      color: '#8493a7',
                    }]}
                    placeholder={'Phone'}
                    editable={false}
                    placeholderTextColor="#94A3B8"
                    value={CommonFunction.decryptString(profile?.phone)}
                    onChangeText={text =>
                      handleInputChange('phone', text)
                    }
                    {...register("phone", {
                      required: content.fieldrequire,
                    })}
                  />
                  {errors.phone && (
                    <Text style={styles.errortext}>{errors.phone.message}</Text>
                  )}
                </View>

                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Customer ID <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      color: '#8493a7',
                    }]}
                    placeholder={'Customer ID'}
                    editable={false}
                    placeholderTextColor="#94A3B8"
                    value={profile?.cust_id}
                  />

                </View>

                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Date Of Birth <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.textInput, {
                      color: '#8493a7',
                    }]}
                    placeholder={'Customer ID'}
                    editable={false}
                    placeholderTextColor="#94A3B8"
                    value={formatDate(profile?.dob)}
                  />

                </View>

                <View style={[styles.formField]}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Address <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={'Address'}
                    placeholderTextColor="#94A3B8"
                    value={profile?.address}
                    onChangeText={text =>
                      handleInputChange('address', text)
                    }
                    {...register("address", {
                      required: content.fieldrequire,
                      validate: (value) => value.trim() !== "" || "Address cannot be only spaces",
                    })}
                  />
                  {errors.address && (
                    <Text style={styles.errortext}>{errors.address.message}</Text>
                  )}
                </View>



                <View style={styles.formField}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    State <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <Dropdown
                    mode='auto'
                    style={styles.selectField}
                    placeholderStyle={{ color: 'gray' }}
                    placeholderTextColor={"#000"}
                    selectedTextStyle={styles.selectFieldText}
                    search={true}
                    itemTextStyle={styles.selectFieldText}
                    itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                    containerStyle={{
                      height: 300, borderRadius: 10, bottom: 60, borderRadius: 12,
                      backgroundColor: '#FFFFFF', zIndex: 1000
                    }}
                    data={0 < state?.length ? state : []}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Select State"
                    searchPlaceholder="Search..."
                    {...register("state", { required: content.fieldrequire })}
                    searchPlaceholder="Search..."
                    value={profile?.state}
                    onChange={item => {
                      if (item.value != 10) {
                        setProfile({ ...profile, state: item.value, city: '', zip: '' })
                        setCity([])
                        getCity(item.value)

                      }
                    }}
                  />
                  {errors.state && (
                    <Text style={styles.errortext}>{errors.state.message}</Text>
                  )}
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    City <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <Dropdown
                    mode='auto'
                    style={styles.selectField}
                    placeholderStyle={{ color: 'gray' }}
                    placeholderTextColor={"#000"}
                    selectedTextStyle={styles.selectFieldText}
                    search={true}
                    itemTextStyle={styles.selectFieldText}
                    itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                    containerStyle={{
                      height: 300, borderRadius: 10, bottom: 60, borderRadius: 12,
                      backgroundColor: '#FFFFFF', zIndex: 1000
                    }}
                    data={0 < city?.length ? city : []}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Select City"
                    searchPlaceholder="Search..."
                    {...register("city", { required: content.fieldrequire })}
                    searchPlaceholder="Search..."
                    value={profile?.city}
                    onChange={item => {
                      if (item.value != 10) {
                        setProfile({ ...profile, city: item.value, zip: '' })
                        setzip([])
                        getZip(item.value)

                      }
                    }}
                  />
                  {errors.city && (
                    <Text style={styles.errortext}>{errors.city.message}</Text>
                  )}
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>
                    Zipcode <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <Dropdown
                    mode='auto'
                    style={styles.selectField}
                    placeholderStyle={{ color: 'gray' }}
                    placeholderTextColor={"#000"}
                    selectedTextStyle={styles.selectFieldText}
                    search={true}
                    itemTextStyle={styles.selectFieldText}
                    itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                    containerStyle={{
                      height: 300, borderRadius: 10, bottom: 60, borderRadius: 12,
                      backgroundColor: '#FFFFFF', zIndex: 1000
                    }}
                    data={0 < zip.length ? zip : []}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Zipcode"
                    searchPlaceholder="Search..."
                    {...register("zip", { required: content.fieldrequire })}
                    searchPlaceholder="Search..."
                    value={profile?.zip}
                    onChange={item => {
                      if (item.value != 10) {
                        setProfile({ ...profile, zip: item.value })
                      }
                    }}
                  />
                  {errors.zip && (
                    <Text style={styles.errortext}>{errors.zip.message}</Text>
                  )}
                </View>



              </View>


              <View style={{ margin: 15 }}>
                <SubmitBtn
                  text="Update Profile"
                  submit={handleSubmit(submit)}
                  disabled={isLoading}
                  disableGradient={isLoading}
                />

              </View>



            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView> :
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>

            <LinearGradient
              colors={['#5A21F1', '#3e16ac']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCard}>

              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />

              <View style={styles.editButtonContainer}>
                <TouchableOpacity style={styles.editIconButton} onPress={handleEdit} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                    style={styles.editIconButtonGradient}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Feather name="edit-2" size={18} color="#FFFFFF" />
                        <Text style={styles.editIconText}>Edit</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={() => !isEditing && setShowImageOptions(true)}
                activeOpacity={0.8}>
                <View style={styles.profileImageRing}>
                  {profileImage ? (
                    <CloudImage
                      style={styles.profileImage}
                      page='main'
                      cloudSource={profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Text style={styles.profileInitials}>
                        {cusDetails?.firstname?.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                  )}
                </View>
                {!isEditing && (
                  <View style={styles.changePhotoButton}>
                    <Feather name="camera" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.userName}>{cusDetails.firstname} {cusDetails.lastname}</Text>
              <View style={styles.userEmailContainer}>
                <Feather name="mail" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userEmail}>{CommonFunction.decryptString(cusDetails.email)}</Text>
              </View>
              <View style={styles.userPhoneContainer}>
                <Feather name="phone" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userPhone}>{CommonFunction.decryptString(cusDetails.phone)}</Text>
              </View>


              <View style={styles.accountBadge}>
                <Feather name="credit-card" size={14} color="#FFFFFF" />
                <Text style={styles.accountNumber}>{cusDetails.cust_id}</Text>
                <View style={styles.accountBadgeDot} />
              </View>


            </LinearGradient>

{
  console.log(cusDetails)
}

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FEF3F2' }]}>
                  <Feather name="calendar" size={20} color="#5A21F1" />
                </View>
                <Text style={styles.statValue}>Member Since</Text>
                <Text style={styles.statLabel}>{formatDate(cusDetails?.createdAt)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#ECFDF5' }]}>
                  <Feather name="shield" size={20} color="#10B981" />
                </View>
                <Text style={styles.statValue}>Account</Text>
                <Text style={styles.statLabel}>Verified</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FEFCE8' }]}>
                  <Feather name="star" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.statValue}>Status</Text>
                <Text style={styles.statLabel}>{cusDetails?.subscription === 'Yes' ? 'Subscribed': 'Unsubscribed'}</Text>
              </View>
            </View>

            <View style={[styles.infoSection, isEditing && styles.infoSectionEditing]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Feather name="user" size={18} color="#5A21F1" />
                </View>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {isEditing && (
                  <View style={styles.editingBadge}>
                    <Text style={styles.editingBadgeText}>Editing</Text>
                  </View>
                )}
              </View>

              <ProfileField
                label="Full Name"
                value={`${cusDetails.firstname} ${cusDetails.lastname}`}
                field="name"
                editable={isEditing}
                icon="user"
              />

              <ProfileField
                label="Email Address"
                value={CommonFunction.decryptString(cusDetails.email)}
                field="email"
                editable={isEditing}
                keyboardType="email-address"
                icon="mail"
              />

              <ProfileField
                label="Cell Phone Number"
                value={CommonFunction.decryptString(cusDetails.phone)}
                field="phone"
                editable={isEditing}
                keyboardType="phone-pad"
                icon="phone"
              />


              <ProfileField
                label="Address"
                value={`${cusDetails?.address}, \n${cusDetails?.city?.name},\n${cusDetails?.state?.name} - ${cusDetails?.zip?.zip}`}
                icon="map-pin"
              />



            </View>


          </ScrollView>
      }




      <Modal
        visible={showImageOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}>
          <View style={styles.imageOptionsContainer}>
            <View style={styles.imageOptionsHeader}>
              <Text style={styles.imageOptionsTitle}>Profile Photo</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => handleImagePick('camera')}>
              <View style={[styles.imageOptionIcon, { backgroundColor: '#EEF2FF' }]}>
                <Feather name="camera" size={22} color="#4F46E5" />
              </View>
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageOption}
              onPress={() => handleImagePick('gallery')}>
              <View style={[styles.imageOptionIcon, { backgroundColor: '#FEF3F2' }]}>
                <Feather name="image" size={22} color="#5A21F1" />
              </View>
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {/* {profileImage && (
              <TouchableOpacity
                style={[styles.imageOption, styles.removeOption]}
                onPress={handleRemoveImage}>
                <View style={[styles.imageOptionIcon, { backgroundColor: '#FEF2F2' }]}>
                  <Feather name="trash-2" size={22} color="#DC2626" />
                </View>
                <Text style={styles.removeOptionText}>Remove Photo</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formField: {
    marginBottom: 20,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  selectFieldText: {
    fontSize: 15,
    color: '#0F172A',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    paddingTop: 10,
    marginStart: 10, marginEnd: 10,
    marginTop: 20
  },
  requiredStar: {
    color: '#DC2626',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  errortext: {
    margin: 5,
    color: themeColors?.negativeColor,
    fontFamily: fontsFamily.boldFont,
    fontSize: getFontSize(12),
    marginStart: 10
  },
  // Profile Card
  profileCard: {
    borderRadius: 24,
    height: 300,
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center'
  },
  // Edit Button Container - Top Right
  editButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  editIconButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editIconButtonGradient: {
    height: 40,
    width: 100,
    justifyContent: 'center'
  },
  editIconText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editActionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  cancelIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIconButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveIconButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    borderRadius: 20,
  },
  saveIconText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A21F1',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5A21F1',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#5A21F1',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  userPhoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  accountBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginLeft: 4,
  },
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  statValue: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: getFontSize(11),

    color: '#64748B',
  },
  // Info Sections
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoSectionEditing: {
    borderColor: '#5A21F1',
    borderWidth: 2,
    shadowColor: '#5A21F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#FEF3F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5A21F1',
    textTransform: 'uppercase',
  },
  editingBadge: {
    backgroundColor: '#5A21F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  fieldIcon: {
    marginRight: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 8,
    paddingLeft: 4,
  },
  fieldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5A21F1',
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 8,
  },
  editIndicator: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  // Menu Section
  menuSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  // Image Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  imageOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  imageOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  imageOptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  imageOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOptionText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  removeOption: {
    borderBottomWidth: 0,
  },
  removeOptionText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '500',
  },
  // Sticky Save Button
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  stickyButtonWrapper: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stickyCancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  stickySaveButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  stickySaveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 8,
  },
  stickySaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});