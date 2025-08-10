import { Home, ArrowLeft, RefreshCw } from "lucide-react";

export default function NotFound() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div>
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, it happens to the best of us!
          </p>
        </div>

        {/* Action Buttons */}
        <div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-indigo-800 via-violet-800 to-purple-800 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home size={20} />
              Go Home
            </button>

            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
