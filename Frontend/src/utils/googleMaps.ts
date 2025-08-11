// Google Maps API utility functions
// Note: In a real implementation, you would need to:
// 1. Get a Google Maps API key from Google Cloud Console
// 2. Enable Places API and Maps JavaScript API
// 3. Add the API key to your environment variables

interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// Get API key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Real implementation using Google Places Autocomplete API
export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Using mock data.');
    // Fallback to mock data if API key is not available
    return mockSearchLocations(query);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&types=establishment|geocode&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK') {
      return data.predictions.map((prediction: any) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        structured_formatting: prediction.structured_formatting
      }));
    } else {
      console.warn('Google Places API error:', data.status);
      return mockSearchLocations(query);
    }
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return mockSearchLocations(query);
  }
};

// Mock implementation for development (fallback)
const mockSearchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockSuggestions: LocationSuggestion[] = [
    {
      place_id: '1',
      description: `${query} - Tourist Attraction`,
      structured_formatting: {
        main_text: query,
        secondary_text: 'Tourist Attraction'
      }
    },
    {
      place_id: '2',
      description: `${query} - Restaurant`,
      structured_formatting: {
        main_text: query,
        secondary_text: 'Restaurant'
      }
    },
    {
      place_id: '3',
      description: `${query} - Hotel`,
      structured_formatting: {
        main_text: query,
        secondary_text: 'Hotel'
      }
    },
    {
      place_id: '4',
      description: `${query} - Shopping Mall`,
      structured_formatting: {
        main_text: query,
        secondary_text: 'Shopping Mall'
      }
    }
  ];

  return mockSuggestions.filter(suggestion => 
    suggestion.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const getPlaceDetails = async (placeId: string): Promise<any> => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Using mock place details.');
    return {
      formatted_address: 'Mock Address',
      geometry: {
        location: {
          lat: 0,
          lng: 0
        }
      }
    };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK') {
      return data.result;
    } else {
      console.warn('Google Places Details API error:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};
