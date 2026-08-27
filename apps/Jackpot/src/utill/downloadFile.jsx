import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform, PermissionsAndroid } from 'react-native';

const { dirs } = ReactNativeBlobUtil.fs;

// Common MIME types mapped by extension
const MIME_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  csv: 'text/csv',
  txt: 'text/plain',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  zip: 'application/zip',
};

export const getFileExtension = (url) => {
  const cleanUrl = url.split('?')[0]; // strip query params
  const ext = cleanUrl.split('.').pop().toLowerCase();
  return ext;
};

export const getMimeType = (extension) => {
  return MIME_TYPES[extension] || 'application/octet-stream';
};

const requestAndroidPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version >= 29) return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'App needs access to storage to download files.',
      buttonPositive: 'OK',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

/**
 * Generic file downloader for PDF, DOCX, XLSX, images, etc.
 * @param {string} url - remote file URL
 * @param {string} fileName - desired file name including extension
 * @param {function} onProgress - callback(percent: number 0-1)
 * @returns {Promise<string>} local file path
 */
export const downloadFile = async (url, fileName, onProgress) => {
  const hasPermission = await requestAndroidPermission();
  if (!hasPermission) {
    throw new Error('Storage permission denied');
  }

  const extension = getFileExtension(url);
  const mimeType = getMimeType(extension);

  const targetDir = Platform.OS === 'android' ? dirs.DownloadDir : dirs.DocumentDir;
  const filePath = `${targetDir}/${fileName}`;

  const config = {
    fileCache: true,
    path: filePath,
    ...(Platform.OS === 'android' && {
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'Downloading file',
        mime: mimeType,
        mediaScannable: true,
      },
    }),
  };

  const res = await ReactNativeBlobUtil.config(config)
    .fetch('GET', url)
    .progress((received, total) => {
      if (onProgress) onProgress(received / total);
    });
     ReactNativeBlobUtil.ios.openDocument(res.path());

  return { path: res.path(), mimeType };
};

/**
 * Opens a downloaded file with the device's default viewer/app
 */
export const openFile = (filePath, mimeType) => {
  if (Platform.OS === 'android') {
    ReactNativeBlobUtil.android.actionViewIntent(filePath, mimeType);
  } else {
    ReactNativeBlobUtil.ios.openDocument(filePath);
  }
};

/**
 * Checks if a file already exists locally
 */
export const fileExists = async (fileName) => {
  const targetDir = Platform.OS === 'android' ? dirs.DownloadDir : dirs.DocumentDir;
  const filePath = `${targetDir}/${fileName}`;
  const exists = await ReactNativeBlobUtil.fs.exists(filePath);
  return exists ? filePath : null;
};