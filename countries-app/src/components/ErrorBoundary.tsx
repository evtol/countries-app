import React, { Component, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

const errorContainerStyles: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const errorHeadingStyles: React.CSSProperties = {
  textAlign: 'center',
  color: 'red',
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    // using hardcoded styles here and not sass modules to make sure
    // the error message is displayed properly event when there
    // is a stying-related error.
    if (hasError) {
      return (
        <div style={errorContainerStyles}>
          <h1 style={errorHeadingStyles}>
            Something Went Wrong
          </h1>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
