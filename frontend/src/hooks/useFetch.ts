// src/hooks/useFetch.ts
import { useEffect, useState } from 'react'

const useFetch = <T = unknown>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch')
        const json: T = await res.json()
        setData(json)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
