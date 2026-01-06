import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-red-500/20 rounded-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-2xl font-bold text-red-500">Bir Hata Oluştu</h1>
            </div>

            <p className="text-gray-300 mb-4">
              Üzgünüz, uygulama beklenmeyen bir hatayla karşılaştı.
              Lütfen sayfayı yenileyin veya aşağıdaki düğmeye tıklayarak tekrar deneyin.
            </p>

            {this.state.error && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm font-mono text-red-400 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      Teknik Detaylar
                    </summary>
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Tekrar Dene
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Sorun devam ederse, lütfen tarayıcınızın önbelleğini temizleyin veya
                destek ekibiyle iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
