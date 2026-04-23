import { useState, useEffect } from 'react';
import { locationService, LocationData } from '@services/locationService';

export interface UseLocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const useLocation = (): UseLocationState => {
  const [state, setState] = useState<UseLocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        setState({ location: null, loading: true, error: null });

        const location = await locationService.getCurrentLocation();

        if (location) {
          setState({
            location,
            loading: false,
            error: null,
          });
        } else {
          setState({
            location: null,
            loading: false,
            error: 'Unable to get location. Please enable location permissions.',
          });
        }
      } catch (err) {
        setState({
          location: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    };

    getLocation();
  }, []);

  return state;
};
