import React, { Component, ErrorInfo, ReactNode } from 'react';
import { emergencyReset } from '../utils/cacheUtils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    emergencyReset();
  };

  private handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto mb-4 max-h-60">
              <p className="font-mono text-sm text-gray-800">
                {this.state.error?.toString()}
              </p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">View component stack</summary>
                  <p className="font-mono text-xs mt-2 whitespace-pre-wrap text-gray-700">
                    {this.state.errorInfo.componentStack}
                  </p>
                </details>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={this.handleTryAgain}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Reset Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;