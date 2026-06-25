import useBoolean from './use-boolean'

export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading, setBool: setLoading } = useBoolean(initValue)

  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    startLoading()
    try {
      return await fn()
    } finally {
      endLoading()
    }
  }

  return {
    loading,
    startLoading,
    endLoading,
    setLoading,
    withLoading,
  }
}
