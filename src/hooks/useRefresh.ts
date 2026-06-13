import { useCallback, useState } from 'react';

/**
 * Wraps a screen's data-loading function for pull-to-refresh.
 *
 *   const load = useCallback(async () => { ... }, []);
 *   const { refreshing, onRefresh } = useRefresh(load);
 *   <ScrollView refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
 *
 * `refreshing` drives the spinner; `onRefresh` runs the loader and clears the
 * spinner when it settles (success or failure).
 */
export function useRefresh(loader: () => void | Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loader();
    } finally {
      setRefreshing(false);
    }
  }, [loader]);

  return { refreshing, onRefresh };
}

export default useRefresh;
