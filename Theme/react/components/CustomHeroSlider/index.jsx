import React, { useEffect, useState, useRef } from 'react'
import styles from './index.css'

const CustomHeroSlider = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const timeoutRef = useRef(null)

  const currentSlide = slides[currentIndex] || {}
  const { duration = 8000 } = currentSlide

  const goTo = (index) => {
    if (!slides.length) return
    if (index < 0 || index >= slides.length) return
    setCurrentIndex(index)
  }

  const goNext = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    if (!slides.length) return
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
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
  if (!slides.length) {
    return null
  }

  return (
    <div className={styles.sliderWrapper}>
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
              link: slideLink,
              alt: slideAlt,
            } = slide

            const hasAnyVideo = slideDesktopVideoUrl || slideMobileVideoUrl
            const isVideoSlide = slideType === 'video' && hasAnyVideo

            let slideContent

            if (isVideoSlide) {
              const desktopVideo = slideDesktopVideoUrl || null
              const mobileVideo = slideMobileVideoUrl || null

              const desktopMedia = desktopVideo ? (
                <video
                  className={`${styles.sliderMedia} ${styles.sliderMediaDesktop}`}
                  src={desktopVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
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
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : null

              const mobileMedia = mobileVideo ? (
                <video
                  className={`${styles.sliderMedia} ${styles.sliderMediaMobile}`}
                  src={mobileVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
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
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : null

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
              <div key={index} className={styles.slide}>
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
          videoUrl: {
            title: 'URL del video desktop (mp4)',
            type: 'string',
          },
          mobileVideoUrl: {
            title: 'URL del video mobile (mp4)',
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
