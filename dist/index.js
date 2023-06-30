import _extends from '@babel/runtime/helpers/extends';
import React, { forwardRef, memo } from 'react';
import { NativeModules, StyleSheet, requireNativeComponent, Image, View, Platform } from 'react-native';
import PropTypes from 'prop-types';

const resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center'
};
const priority = {
  low: 'low',
  normal: 'normal',
  high: 'high'
};
const cacheControl = {
  // Ignore headers, use uri as cache key, fetch only if not in cache.
  immutable: 'immutable',
  // Respect http headers, no aggressive caching.
  web: 'web',
  // Only load from cache.
  cacheOnly: 'cacheOnly'
};

const resolveDefaultSource = defaultSource => {
  if (!defaultSource) {
    return null;
  }

  if (Platform.OS === 'android') {
    // Android receives a URI string, and resolves into a Drawable using RN's methods.
    const resolved = Image.resolveAssetSource(defaultSource);

    if (resolved) {
      return resolved.uri;
    }

    return null;
  } // iOS or other number mapped assets
  // In iOS the number is passed, and bridged automatically into a UIImage


  return defaultSource;
};

function FastImageBase({
  source,
  defaultSource,
  tintColor,
  onLoadStart,
  onProgress,
  onLoad,
  onError,
  onLoadEnd,
  style,
  fallback,
  children,
  // eslint-disable-next-line no-shadow
  resizeMode = 'cover',
  forwardedRef,
  ...props
}) {
  if (fallback) {
    const cleanedSource = { ...source
    };
    delete cleanedSource.cache;
    const resolvedSource = Image.resolveAssetSource(cleanedSource);
    return /*#__PURE__*/React.createElement(View, {
      style: [styles.imageContainer, style],
      ref: forwardedRef
    }, /*#__PURE__*/React.createElement(Image, _extends({}, props, {
      style: [StyleSheet.absoluteFill, {
        tintColor
      }],
      source: resolvedSource,
      defaultSource: defaultSource,
      onLoadStart: onLoadStart,
      onProgress: onProgress,
      onLoad: onLoad,
      onError: onError,
      onLoadEnd: onLoadEnd,
      resizeMode: resizeMode
    })), children);
  }

  const resolvedSource = Image.resolveAssetSource(source);
  const resolvedDefaultSource = resolveDefaultSource(defaultSource);
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.imageContainer, style],
    ref: forwardedRef
  }, /*#__PURE__*/React.createElement(FastImageView, _extends({}, props, {
    tintColor: tintColor,
    style: StyleSheet.absoluteFill,
    source: resolvedSource,
    defaultSource: resolvedDefaultSource,
    onFastImageLoadStart: onLoadStart,
    onFastImageProgress: onProgress,
    onFastImageLoad: onLoad,
    onFastImageError: onError,
    onFastImageLoadEnd: onLoadEnd,
    resizeMode: resizeMode
  })), children);
}

const FastImageMemo = /*#__PURE__*/memo(FastImageBase);
const FastImageComponent = /*#__PURE__*/forwardRef((props, ref) => /*#__PURE__*/React.createElement(FastImageMemo, _extends({
  forwardedRef: ref
}, props)));
FastImageComponent.displayName = 'FastImage';
const FastImage = FastImageComponent;
FastImage.resizeMode = resizeMode;
FastImage.cacheControl = cacheControl;
FastImage.priority = priority;

FastImage.preload = sources => NativeModules.FastImageView.preload(sources);

FastImage.clearMemoryCache = () => NativeModules.FastImageView.clearMemoryCache();

FastImage.clearDiskCache = () => NativeModules.FastImageView.clearDiskCache();

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden'
  }
}); // Types of requireNativeComponent are not correct.

const FastImageView = requireNativeComponent('FastImageView', FastImage, {
  nativeOnly: {
    onFastImageLoadStart: true,
    onFastImageProgress: true,
    onFastImageLoad: true,
    onFastImageError: true,
    onFastImageLoadEnd: true
  }
});

const CacheeImage = props => {
  var _source;

  let {
    source,
    thumbnailSource
  } = props;
  const {
    resizeMode,
    style,
    priority,
    headers,
    defaultSource,
    onLoad,
    onError
  } = props;

  if (!((_source = source) !== null && _source !== void 0 && _source.priority) && source.uri) {
    source = { ...source,
      ...(headers && {
        headers: headers
      }),
      ...(priority && {
        priority: 'high'
      })
    };
  } // if real image ready , show real image
  // if real image not ready, show thumbnail
  // if real image not ready, thumbnailSource not ready, show placeholder
  // if real image not ready, thumbnailSource not ready, placeholder not ready, show defaultSource


  const renderSource = () => {
    var _source2, _source2$uri, _source3, _source3$uri;

    if (!((_source2 = source) !== null && _source2 !== void 0 && (_source2$uri = _source2.uri) !== null && _source2$uri !== void 0 && _source2$uri.includes('http')) && thumbnailSource) {
      return thumbnailSource;
    } else if (!((_source3 = source) !== null && _source3 !== void 0 && (_source3$uri = _source3.uri) !== null && _source3$uri !== void 0 && _source3$uri.includes('http')) && !thumbnailSource && defaultSource) {
      return defaultSource;
    } else {
      return source;
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FastImage, {
    style: { ...style
    },
    source: renderSource(),
    resizeMode: resizeMode,
    onError: onError,
    onLoad: onLoad
  }));
};
CacheeImage.propTypes = {
  source: PropTypes.any.isRequired,
  name: PropTypes.string,
  key: PropTypes.string,
  priority: PropTypes.oneOf(['low', 'normal', 'high']),
  headers: PropTypes.any,
  resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
  thumbnailSource: PropTypes.object
};
CacheeImage.defaultProps = {
  priority: 'high'
};

export { CacheeImage, FastImage };
