import { TOKEN_NAME, PREFERRED_RETURN, MIN_INVESTMENT_USDC } from "@f2k/shared";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {TOKEN_NAME}
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Tokenised National Housing Fund
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Invest in Australian residential property through regulated security
            tokens. Backed by real assets, distributed on Ethereum.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            <div>
              <p className="text-3xl font-bold text-gold">$600M</p>
              <p className="text-sm text-gray-400">Target Fund</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">10,800</p>
              <p className="text-sm text-gray-400">Homes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">
                {(PREFERRED_RETURN * 100).toFixed(0)}-12%
              </p>
              <p className="text-sm text-gray-400">Target Yield</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">24/7</p>
              <p className="text-sm text-gray-400">Liquidity</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <a
              href="/register"
              className="bg-f2k-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Apply to Invest
            </a>
            <a
              href="/login"
              className="border border-gray-500 hover:border-gold text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-navy mb-2">
                Security Tokens
              </h3>
              <p className="text-gray-600">
                ERC-3643 compliant tokens on Ethereum. Fully regulated, with
                on-chain compliance and identity verification.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-navy mb-2">
                Real Asset Backed
              </h3>
              <p className="text-gray-600">
                Every token represents a unit in a Managed Investment Scheme
                backed by Australian residential property.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-navy mb-2">
                Quarterly Distributions
              </h3>
              <p className="text-gray-600">
                Receive USDC distributions directly to your wallet every quarter,
                calculated pro-rata from fund income.
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Minimum investment: ${MIN_INVESTMENT_USDC.toLocaleString()} USDC.
            Wholesale investors only (s708 Corporations Act).
          </p>
        </div>
      </section>
    </div>
  );
}
