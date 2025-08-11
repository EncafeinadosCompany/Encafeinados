import React from 'react';
import toast from 'react-hot-toast';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    toast.error(`Error: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Algo salió mal
            </h2>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'Error desconocido'}
            </p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
