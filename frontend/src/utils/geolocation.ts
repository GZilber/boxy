interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
  timestamp: number;
}

export async function getCurrentLocation(options?: PositionOptions): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const success = (position: Position) => {
      const { latitude: lat, longitude: lng, accuracy } = position.coords;
      resolve({
        lat,
        lng,
        accuracy,
        timestamp: position.timestamp
      });
    };

    const error = (err: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location access was denied';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }
      
      reject(new Error(errorMessage));
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    });
  });
}

export async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || 'Address not available';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Address not available';
  }
}
