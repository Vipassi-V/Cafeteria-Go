import axios from 'axios';

/**
 * Handles the secure signed upload to Cloudinary.
 * 1. Fetches signature from our backend.
 * 2. Uploads the image directly from the mobile app to Cloudinary.
 */
export const uploadPaymentScreenshot = async (imageUri: string, token: string) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    // 1. Get Signature from our backend
    const signResponse = await axios.get(`${apiUrl}/cloudinary/sign`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { signature, timestamp, api_key, cloud_name, folder } = signResponse.data;

    // 2. Build FormData for Cloudinary
    const formData = new FormData();
    // In React Native, the file is represent as an object with uri, type, and name
    const fileToUpload = {
      uri: imageUri,
      type: 'image/jpeg',
      name: `payment_${timestamp}.jpg`,
    } as any;

    formData.append('file', fileToUpload);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    // 3. Perform the direct upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary Signed Upload Error:', error);
    throw new Error('Failed to upload payment screenshot safely.');
  }
};
