import { Component } from 'react';
import { isChunkLoadError, redirectToOfflinePage } from '../utilis/lazyWithOfflineFallback.js';

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (typeof navigator !== 'undefined' && !navigator.onLine && isChunkLoadError(error)) {
      redirectToOfflinePage();
      return { hasError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (typeof navigator !== 'undefined' && !navigator.onLine && isChunkLoadError(error)) {
      redirectToOfflinePage();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
