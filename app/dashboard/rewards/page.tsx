import Link from 'next/link'

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards Tracker</h1>
        <p className="text-gray-600 mt-1">Track your crypto rewards across all your cards</p>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Soon you&apos;ll be able to log and track all your crypto rewards in one place.
          Get insights on your earnings and optimize your spending.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard/my-cards"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/25"
          >
            View My Cards
          </Link>
          <Link
            href="/cards"
            className="px-6 py-3 border border-gray-300 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Browse Cards
          </Link>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 className="text-gray-900 font-medium mb-2">Log Rewards</h4>
          <p className="text-sm text-gray-500">
            Manually log your crypto rewards from each card purchase
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h4 className="text-gray-900 font-medium mb-2">Track Value</h4>
          <p className="text-sm text-gray-500">
            See real-time value of your rewards in USD
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-gray-900 font-medium mb-2">Get Insights</h4>
          <p className="text-sm text-gray-500">
            Discover which cards earn you the most rewards
          </p>
        </div>
      </div>
    </div>
  )
}
