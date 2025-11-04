import React, { useRef, useEffect } from 'react'
import styles from './index.css'

const VideoHeroCustom = () => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.videoContainer} ref={containerRef}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.videoElement}
          src="https://res.cloudinary.com/dqeivjlr9/video/upload/v1762269622/video_para_parte_final_2_syy8vi.mp4"
          muted
          loop
          playsInline
        />
      </div>
      <a 
        href="https://www.mundooutdoor.com.ar" 
        className={styles.ctaButton}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver más
      </a>
    </div>
  )
}

export default VideoHeroCustom
