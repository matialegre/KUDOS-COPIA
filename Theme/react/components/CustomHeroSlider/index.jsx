import React, { useEffect, useState, useRef } from 'react'
import styles from './index.css'

const MAX_VIDEO_LOOPS = 1

const CustomHeroSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef(null)
  const videoLoopCountRef = useRef({})
  const sliderWrapperRef = useRef(null)
  const iframeViewCountRef = useRef({})
  const iframeMountKeyRef = useRef({})
  const didInitIframeViewRef = useRef(false)

  const currentSlide = slides[currentIndex] || {}
  const { duration = 8000 } = currentSlide

  const sanitizeIframeUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl
    try {
      const url = new URL(rawUrl)
      url.searchParams.set('loop', 'false')
      url.searchParams.set('autoplay', 'true')
      url.searchParams.set('muted', 'true')
      return url.toString()
    } catch (e) {
      return rawUrl
    }
  }

  const getIframePosterUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return null
    try {
      const url = new URL(rawUrl)
      const poster = url.searchParams.get('poster')
      if (!poster) return null
      try {
        return decodeURIComponent(poster)
      } catch (e) {
        return poster
      }
    } catch (e) {
      return null
    }
  }

  const markIframeView = (index) => {
    const slide = slides[index] || {}
    const hasIframe = slide.desktopIframeUrl || slide.mobileIframeUrl
    if (!hasIframe) return

    const current = iframeViewCountRef.current[index] || 0
    if (current >= MAX_VIDEO_LOOPS + 1) return

    const next = current + 1
    iframeViewCountRef.current[index] = next
    iframeMountKeyRef.current[index] = next
  }

  const goTo = (index) => {
    if (!slides.length) return
    if (index < 0 || index >= slides.length) return
    markIframeView(index)
    setCurrentIndex(index)
  }

  const goNext = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => {
      const next = (prev + 1) % slides.length
      markIframeView(next)
      return next
    })
  }

  const goPrev = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => {
      const next = (prev - 1 + slides.length) % slides.length
      markIframeView(next)
      return next
    })
  }

  useEffect(() => {
    if (!slides.length) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 8000

    timeoutRef.current = setTimeout(() => {
      goNext()
    }, safeDuration)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, slides.length, duration])

  useEffect(() => {
    const root = sliderWrapperRef.current
    if (!root) return

    const videos = root.querySelectorAll('video')
    videos.forEach((video) => {
      try {
        video.pause()
      } catch (e) {
        // noop
      }
    })

    const currentSlideNode = root.querySelector(`[data-slide-index="${currentIndex}"]`)
    if (!currentSlideNode) return

    const currentVideos = currentSlideNode.querySelectorAll('video')
    currentVideos.forEach((video) => {
      try {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {})
        }
      } catch (e) {
        // noop
      }
    })
  }, [currentIndex])

  useEffect(() => {
    if (didInitIframeViewRef.current) return
    didInitIframeViewRef.current = true
    markIframeView(currentIndex)
  }, [currentIndex])

  if (!slides.length) {
    return null
  }

  return (
    <div className={styles.sliderWrapper} ref={sliderWrapperRef}>
      <button className={styles.arrowLeft} onClick={goPrev} aria-label="Anterior">
        &#10094;
      </button>

      <div className={styles.slideContainer}>
        <div
          className={styles.slideTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const {
              type: slideType = 'image',
              desktopImage: slideDesktopImage,
              mobileImage: slideMobileImage,
              videoUrl: slideDesktopVideoUrl,
              mobileVideoUrl: slideMobileVideoUrl,
              desktopIframeUrl: slideDesktopIframeUrl,
              mobileIframeUrl: slideMobileIframeUrl,
              link: slideLink,
              alt: slideAlt,
            } = slide

            const hasAnyVideo =
              slideDesktopVideoUrl ||
              slideMobileVideoUrl ||
              slideDesktopIframeUrl ||
              slideMobileIframeUrl
            const isVideoSlide = slideType === 'video' && hasAnyVideo

            let slideContent

            if (isVideoSlide) {
              const desktopVideo = slideDesktopVideoUrl || null
              const mobileVideo = slideMobileVideoUrl || null
              const desktopIframe = slideDesktopIframeUrl || null
              const mobileIframe = slideMobileIframeUrl || null

              const hasIframe = desktopIframe || mobileIframe

              const iframeViews = iframeViewCountRef.current[index] || 0
              const iframeKey = iframeMountKeyRef.current[index] || 0
              const allowIframe = iframeViews <= MAX_VIDEO_LOOPS
              const isActive = index === currentIndex

              let desktopMedia
              let mobileMedia

              if (hasIframe) {
                const effectiveDesktopIframe = desktopIframe || mobileIframe
                const effectiveMobileIframe = mobileIframe || desktopIframe

                const desktopPoster = getIframePosterUrl(effectiveDesktopIframe)
                const mobilePoster = getIframePosterUrl(effectiveMobileIframe)

                const desktopSrc = sanitizeIframeUrl(effectiveDesktopIframe)
                const mobileSrc = sanitizeIframeUrl(effectiveMobileIframe)

                desktopMedia = effectiveDesktopIframe ? (
                  isActive ? (
                    allowIframe ? (
                      <iframe
                        key={`iframe-desktop-${index}-${iframeKey}`}
                        className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                        src={desktopSrc}
                        loading="eager"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                      />
                    ) : (
                      desktopPoster ? (
                        <img
                          src={desktopPoster}
                          alt={slideAlt || ''}
                          className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                        />
                      ) : null
                    )
                  ) : null
                ) : null

                mobileMedia = effectiveMobileIframe ? (
                  isActive ? (
                    allowIframe ? (
                      <iframe
                        key={`iframe-mobile-${index}-${iframeKey}`}
                        className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                        src={mobileSrc}
                        loading="eager"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                      />
                    ) : (
                      mobilePoster ? (
                        <img
                          src={mobilePoster}
                          alt={slideAlt || ''}
                          className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                        />
                      ) : null
                    )
                  ) : null
                ) : null
              } else {
                const handleVideoEnded = (e, videoKey) => {
                  const count = (videoLoopCountRef.current[videoKey] || 0) + 1
                  videoLoopCountRef.current[videoKey] = count
                  if (count < MAX_VIDEO_LOOPS) {
                    try {
                      e.target.currentTime = 0
                    } catch (err) {
                      // noop
                    }

                    try {
                      const playPromise = e.target.play()
                      if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(() => {})
                      }
                    } catch (err) {
                      // noop
                    }
                  } else {
                    try {
                      e.target.pause()
                    } catch (err) {
                      // noop
                    }
                  }
                }

                desktopMedia = desktopVideo ? (
                  <video
                    className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                    src={desktopVideo}
                    autoPlay={index === currentIndex}
                    muted
                    playsInline
                    onEnded={(e) => handleVideoEnded(e, `desktop-${index}`)}
                  />
                ) :
                  slideDesktopImage ? (
                    <img
                      src={slideDesktopImage}
                      alt={slideAlt || ''}
                      className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                    />
                  ) :
                    mobileVideo ? (
                      <video
                        className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                        src={mobileVideo}
                        autoPlay={index === currentIndex}
                        muted
                        playsInline
                        onEnded={(e) => handleVideoEnded(e, `desktop-fallback-${index}`)}
                      />
                    ) : null

                mobileMedia = mobileVideo ? (
                  <video
                    className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                    src={mobileVideo}
                    autoPlay={index === currentIndex}
                    muted
                    playsInline
                    onEnded={(e) => handleVideoEnded(e, `mobile-${index}`)}
                  />
                ) :
                  slideMobileImage ? (
                    <img
                      src={slideMobileImage}
                      alt={slideAlt || ''}
                      className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                    />
                  ) :
                    desktopVideo ? (
                      <video
                        className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                        src={desktopVideo}
                        autoPlay={index === currentIndex}
                        muted
                        playsInline
                        onEnded={(e) => handleVideoEnded(e, `mobile-fallback-${index}`)}
                      />
                    ) : null
              }

              slideContent = (
                <>
                  {desktopMedia}
                  {mobileMedia}
                </>
              )
            } else {
              slideContent = (
                <>
                  {slideDesktopImage && (
                    <img
                      src={slideDesktopImage}
                      alt={slideAlt || ''}
                      className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                    />
                  )}
                  {slideMobileImage && (
                    <img
                      src={slideMobileImage}
                      alt={slideAlt || ''}
                      className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                    />
                  )}
                </>
              )
            }

            const wrappedSlideContent = slideLink ? (
              <a href={slideLink} className={styles.slideLink}>
                {slideContent}
              </a>
            ) : (
              <div className={styles.slideInner}>{slideContent}</div>
            )

            return (
              <div key={index} className={styles.slide} data-slide-index={index}>
                {wrappedSlideContent}
              </div>
            )
          })}
        </div>
      </div>

      <button className={styles.arrowRight} onClick={goNext} aria-label="Siguiente">
        &#10095;
      </button>

      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={styles.dot}
            style={{
              backgroundColor: index === currentIndex ? '#FF4B4B' : '#D3D3D3',
            }}
            onClick={() => goTo(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

CustomHeroSlider.schema = {
  title: 'Custom hero slider',
  description:
    'Slider custom con imágenes y videos, cada slide con su propia duración (milisegundos).',
  type: 'object',
  properties: {
    slides: {
      title: 'Slides',
      type: 'array',
      items: {
        title: 'Slide',
        type: 'object',
        properties: {
          type: {
            title: 'Tipo',
            type: 'string',
            enum: ['image', 'video'],
            default: 'image',
          },
          desktopImage: {
            title: 'Imagen desktop',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          mobileImage: {
            title: 'Imagen mobile',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          desktopIframeUrl: {
            title: 'URL iframe video (escritorio)',
            description:
              'Pegá aquí la URL completa del iframe de Cloudflare para escritorio (valor de src).',
            type: 'string',
          },
          mobileIframeUrl: {
            title: 'URL iframe video (celular)',
            description:
              'Pegá aquí la URL completa del iframe de Cloudflare para celular (valor de src).',
            type: 'string',
          },
          link: {
            title: 'Link (opcional)',
            type: 'string',
          },
          alt: {
            title: 'Alt / descripción',
            type: 'string',
          },
          duration: {
            title: 'Duración del slide (ms)',
            description: 'Tiempo que permanece este slide antes de pasar al siguiente.',
            type: 'number',
            default: 8000,
          },
        },
      },
    },
  },
}

export default CustomHeroSlider
