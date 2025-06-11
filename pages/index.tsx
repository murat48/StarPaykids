import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { requestAccess, isConnected } from '@stellar/freighter-api'

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already connected on page load
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const { isConnected: connected } = await isConnected()
      if (connected) {
        // If already connected, redirect to main page
        const savedAddress = localStorage.getItem('walletAddress')
        if (savedAddress) {
          router.push('/main')
        }
      }
    } catch (err) {
      console.error('Connection check failed:', err)
    }
  }

  const connectWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if Freighter is installed
      const { isConnected: freighterInstalled } = await isConnected()
      
      if (!freighterInstalled) {
        setError('Freighter wallet not found. Please install Freighter extension.')
        setLoading(false)
        return
      }

      // Request access to wallet
      const { address, error: accessError } = await requestAccess()
      
      if (accessError) {
        setError(accessError)
        setLoading(false)
        return
      }

      if (address) {
        // Save address to localStorage
        localStorage.setItem('walletAddress', address)
        console.log('Connected wallet address:', address)
        
        // Redirect to main page
        router.push('/main')
      }
    } catch (err) {
      console.error('Wallet connection error:', err)
      setError('Failed to connect wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">💰</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            StarPayKids
          </h1>
          <p className="text-gray-600 mb-8">
            Çocuklarınıza harçlık gönderin ve harcamalarını takip edin
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold 
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Bağlanıyor...
              </div>
            ) : (
              'Freighter Wallet ile Bağlan'
            )}
          </button>

          {/* Info */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Freighter wallet extension gereklidir</p>
            <p className="mt-1">
              <a 
                href="https://freighter.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline"
              >
                Freighter'ı buradan indirebilirsiniz
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
