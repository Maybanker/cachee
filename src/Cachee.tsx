import React from 'react'
import FastImage from './FastImage'
import PropTypes from 'prop-types'

export const CacheeImage = (props: any) => {
    let { source, thumbnailSource } = props
    const { resizeMode, style, priority, headers, defaultSource, onLoad, onError } = props
    if (!source?.priority && source.uri) {
        source = {
            ...source,
            ...(headers && { headers: headers }),
            ...(priority && { priority: 'high' }),
        }
    }

    // if real image ready , show real image
    // if real image not ready, show thumbnail
    // if real image not ready, thumbnailSource not ready, show placeholder
    // if real image not ready, thumbnailSource not ready, placeholder not ready, show defaultSource
    const renderSource = () => {
        if (!source?.uri?.includes('http') && thumbnailSource) {
            return thumbnailSource
        } else if (
            !source?.uri?.includes('http') &&
            !thumbnailSource &&
            defaultSource
        ) {
            return defaultSource
        } else {
            return source
        }
    }

    return (
        <>
            <FastImage
                style={{ ...style }}
                source={renderSource()}
                resizeMode={resizeMode}
                onError={onError}
                onLoad={onLoad}
            />
        </>
    )
}

CacheeImage.propTypes = {
    source: PropTypes.any.isRequired,
    name: PropTypes.string,
    key: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'normal', 'high']),
    headers: PropTypes.any,
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    thumbnailSource: PropTypes.object,
}

CacheeImage.defaultProps = {
    priority: 'high',
}
