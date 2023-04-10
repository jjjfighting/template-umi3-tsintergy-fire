import DefaultFallbackComponent from '@/pages/common/Exception/DefaultFallbackComponent';
import { Component } from 'react';

interface Error {
  componentStack?: string;
  error?: string;
  [key: string]: any;
}

interface IState {
  hasError?: boolean;
  error?: string;
  info?: {
    componentStack?: string;
  };
}

export interface IProps {
  /** 发生错误后的回调（可做一些错误日志上报，打点等） */
  onError?: (error: Error, info: any) => void;
}

class ErrorBoundary extends Component<IProps, IState> {
  static defaultProps = {
    onError: null,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
    };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({
      error,
      info,
    });
    const { onError } = this.props;
    if (onError && typeof onError === 'function') {
      onError(error, info);
    }
  }

  render() {
    const { children, ...restProps } = this.props;
    const { hasError, error, info } = this.state;
    if (hasError) {
      return (
        <DefaultFallbackComponent
          {...restProps}
          componentStack={info ? info.componentStack : ''}
          error={error}
        />
      );
    }
    return children;
  }
}

export default ErrorBoundary;
