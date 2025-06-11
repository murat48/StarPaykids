import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getAddress } from '@stellar/freighter-api'
import { allowanceContract } from '../utils/contract'

export default function MainPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [childAddress, setChildAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalSent, setTotalSent] = useState(0)
  const [lastChild, setLastChild] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check wallet connection on page load
    checkWalletConnection()
    // Load contract data
    loadContractData()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const savedAddress = localStorage.getItem('walletAddress')
      if (savedAddress) {
        setWalletAddress(savedAddress)
      } else {
        // Try to get address from Freighter
        const { address } = await getAddress()
        if (address) {
          setWalletAddress(address)
          localStorage.setItem('walletAddress', address)
        } else {
          // Redirect to home if not connected
          router.push('/')
        }
      }
    } catch (err) {
      console.error('Wallet check failed:', err)
      router.push('/')
    }
  }

  const loadContractData = async () => {
    try {
      // Load total sent amount
      const totalResult = await allowanceContract.getTotalSent()
      if (totalResult.success && totalResult.data !== undefined) {
        setTotalSent(totalResult.data)
      }

      // Load last child address
      const lastChildResult = await allowanceContract.getLastChild()
      if (lastChildResult.success && lastChildResult.data) {
        setLastChild(lastChildResult.data)
      }
    } catch (error) {
      console.error('Failed to load contract data:', error)
      // Use mock data as fallback
      setTotalSent(0)
      setLastChild('')
    }
  }

  const disconnectWallet = () => {
    localStorage.removeItem('walletAddress')
    setWalletAddress(null)
    router.push('/')
  }

  const sendAllowance = async () => {
    if (!childAddress.trim()) {
      setError('Lütfen çocuk cüzdan adresini girin')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Lütfen geçerli bir harçlık miktarı girin')
      return
    }

    if (!walletAddress) {
      setError('Cüzdan bağlantısı bulunamadı')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('Sending allowance:', { childAddress, amount, walletAddress })
      
      // Call contract function send_allowance
      const result = await allowanceContract.sendAllowance(
        walletAddress,
        childAddress.trim(),
        parseFloat(amount)
      )
      
      if (result.success) {
        setSuccess(`${amount} XLM harçlık başarıyla gönderildi!`)
        
        // Update UI immediately
        setTotalSent(prev => prev + parseFloat(amount))
        setLastChild(childAddress.trim())
        
        // Clear form
        setChildAddress('')
        setAmount('')
        
        // Reload contract data to ensure consistency
        setTimeout(() => {
          loadContractData()
        }, 2000)
        
        console.log('Transaction hash:', result.txHash)
      } else {
        setError(result.error || 'Harçlık gönderimi başarısız')
      }
      
    } catch (err) {
      console.error('Send allowance error:', err)
      setError('Harçlık gönderimi başarısız. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StarPayKids</h1>
              <p className="text-gray-600">Harçlık Gönderme Paneli</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Bağlı Cüzdan:</p>
              <p className="text-sm font-mono text-gray-700">
                {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}` : 'Yükleniyor...'}
              </p>
              <button
                onClick={disconnectWallet}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Bağlantıyı Kes
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Toplam Gönderilen</p>
                <p className="text-2xl font-bold text-green-600">{totalSent.toFixed(1)} XLM</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👶</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Son Gönderilen Çocuk</p>
                <p className="text-sm font-mono text-gray-700">
                  {lastChild ? `${lastChild.slice(0, 12)}...` : 'Henüz yok'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Allowance Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Harçlık Gönder</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Child Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çocuk Cüzdan Adresi
              </label>
              <input
                type="text"
                value={childAddress}
                onChange={(e) => setChildAddress(e.target.value)}
                placeholder="Örn: GCKFBEIYTKP42K6WTOGJQVQZU..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harçlık Miktarı (XLM)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Örn: 10.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendAllowance}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold 
                       hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : (
                'Harçlık Gönder'
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Stellar Testnet üzerinde çalışmaktadır</p>
        </div>
      </div>
    </div>
  )
}
