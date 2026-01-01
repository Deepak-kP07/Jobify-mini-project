import { Component } from "react";

class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chart rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-lg font-medium mb-2">Unable to display chart</p>
          <p className="text-sm">Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;

