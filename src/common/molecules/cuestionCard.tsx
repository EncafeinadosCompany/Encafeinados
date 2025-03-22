import { Coffee, Store } from "lucide-react"
import { Link } from "react-router-dom"


export default function CuestionCard() {
  return (
    <div className=" bg-white flex flex-col items-center justify-center p-4 ">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900">Choose Registration Type</h1>
          <p className="text-gray-500 mt-2">Select how you'd like to join us</p>
        </div>

        <div className="grid gap-4">
          <Link
            to="/store-registration"
            className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
          >
            <Store className="w-5 h-5 text-gray-700 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Store</h3>
              <p className="text-gray-500 text-sm">For coffee shops and retailers</p>
            </div>
          </Link>

          <Link
            to="/coffee-lover-registration"
            className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
          >
            <Coffee className="w-5 h-5 text-gray-700 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Coffee Lover</h3>
              <p className="text-gray-500 text-sm">For coffee enthusiasts</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Join our community today</p>
        </div>
      </div>
    </div>
  )
}

