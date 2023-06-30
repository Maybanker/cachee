'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('@babel/runtime/helpers/extends');
var React = require('react');
var reactNative = require('react-native');
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

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

  if (reactNative.Platform.OS === 'android') {
    // Android receives a URI string, and resolves into a Drawable using RN's methods.
    const resolved = reactNative.Image.resolveAssetSource(defaultSource);

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
    const resolvedSource = reactNative.Image.resolveAssetSource(cleanedSource);
    return /*#__PURE__*/React__default['default'].createElement(reactNative.View, {
      style: [styles.imageContainer, style],
      ref: forwardedRef
    }, /*#__PURE__*/React__default['default'].createElement(reactNative.Image, _extends__default['default']({}, props, {
      style: [reactNative.StyleSheet.absoluteFill, {
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

  const resolvedSource = reactNative.Image.resolveAssetSource(source);
  const resolvedDefaultSource = resolveDefaultSource(defaultSource);
  return /*#__PURE__*/React__default['default'].createElement(reactNative.View, {
    style: [styles.imageContainer, style],
    ref: forwardedRef
  }, /*#__PURE__*/React__default['default'].createElement(FastImageView, _extends__default['default']({}, props, {
    tintColor: tintColor,
    style: reactNative.StyleSheet.absoluteFill,
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

const FastImageMemo = /*#__PURE__*/React.memo(FastImageBase);
const FastImageComponent = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React__default['default'].createElement(FastImageMemo, _extends__default['default']({
  forwardedRef: ref
}, props)));
FastImageComponent.displayName = 'FastImage';
const FastImage = FastImageComponent;
FastImage.resizeMode = resizeMode;
FastImage.cacheControl = cacheControl;
FastImage.priority = priority;

FastImage.preload = sources => reactNative.NativeModules.FastImageView.preload(sources);

FastImage.clearMemoryCache = () => reactNative.NativeModules.FastImageView.clearMemoryCache();

FastImage.clearDiskCache = () => reactNative.NativeModules.FastImageView.clearDiskCache();

const styles = reactNative.StyleSheet.create({
  imageContainer: {
    overflow: 'hidden'
  }
}); // Types of requireNativeComponent are not correct.

const FastImageView = reactNative.requireNativeComponent('FastImageView', FastImage, {
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

  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(FastImage, {
    style: { ...style
    },
    source: renderSource(),
    resizeMode: resizeMode,
    onError: onError,
    onLoad: onLoad
  }));
};
CacheeImage.propTypes = {
  source: PropTypes__default['default'].any.isRequired,
  name: PropTypes__default['default'].string,
  key: PropTypes__default['default'].string,
  priority: PropTypes__default['default'].oneOf(['low', 'normal', 'high']),
  headers: PropTypes__default['default'].any,
  resizeMode: PropTypes__default['default'].oneOf(['contain', 'cover', 'stretch', 'center']),
  thumbnailSource: PropTypes__default['default'].object
};
CacheeImage.defaultProps = {
  priority: 'high'
};

exports.CacheeImage = CacheeImage;
exports.FastImage = FastImage;
