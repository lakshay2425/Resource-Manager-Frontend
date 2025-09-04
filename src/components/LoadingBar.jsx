import { Globe } from "lucide-react"


const LoadingBar = ({message}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">{message}</h3>
        </div>
      </div>
  )
}

export default LoadingBar