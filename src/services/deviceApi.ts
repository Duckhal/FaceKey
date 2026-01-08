import api from './api';

// Definition for creating a new device
export interface CreateDeviceData {
  device_uid: string;
  device_name: string;
  device_type: 'CAM' | 'LOCK';
}

// 1. Get list of devices
export const getDevices = async () => {
  const response = await api.get('/devices');
  return response.data;
};

// 2. Add new device
export const addDevice = async (data: CreateDeviceData) => {
  const response = await api.post('/devices', data);
  return response.data;
};

// 3. Delete device
export const deleteDevice = async (id: number) => {
  const response = await api.delete(`/devices/${id}`);
  return response.data;
};

// 4. Update device (if you need to change the name later)
export const updateDevice = async (
  id: number,
  data: { device_name: string },
) => {
  const response = await api.patch(`/devices/${id}`, data);
  return response.data;
};

// 5. Send open-door command to device
export const sendOpenDoorCommand = async (deviceUid: string) => {
  const response = await api.post(`/recognition/open`, {
    device_uid: deviceUid,
  });
  return response.data;
};
