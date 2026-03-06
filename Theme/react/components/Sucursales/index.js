import React, {useState, useEffect} from 'react';
import sucursalesData from './Data/sucursalesData'
import Map from './Map/Map'
import styles from './sucursales.css';

const Sucursales = () => {

  // POSITION - centrado en Argentina
  const [ position, setPosition ] = useState({
    lat: -38.4161,
    lng: -63.6167,
    zoom: 5
  });

  const [searchValue, setSearchValue] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageTransitioning, setImageTransitioning] = useState({});
  const [cycleCount, setCycleCount] = useState({});
  const [carouselStopped, setCarouselStopped] = useState({});

  // Auto-rotate images every 3 seconds with staggered timing, stop at position 3 (index 2)
  useEffect(() => {
    const timeouts = [];
    const intervals = [];
    
    sucursalesData.forEach((sucursal, idx) => {
      const staggerDelay = idx * 600; // 600ms stagger between each branch
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          // Check if carousel should stop
          if (carouselStopped[sucursal.id]) {
            clearInterval(interval);
            return;
          }
          
          setActiveImageIndex(prev => {
            const currentIndex = prev[sucursal.id] || 0;
            const nextIndex = (currentIndex + 1) % sucursal.gallery.length;
            
            // Stop when reaching index 2 (position 3 - the exterior image)
            if (nextIndex === 2) {
              setCarouselStopped(prevStopped => ({ ...prevStopped, [sucursal.id]: true }));
              clearInterval(interval);
              return {
                ...prev,
                [sucursal.id]: 2
              };
            }
            
            return {
              ...prev,
              [sucursal.id]: nextIndex
            };
          });
        }, 3000);
        
        intervals.push(interval);
      }, staggerDelay);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((lightboxIndex + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // RETURN
  return (
    <>
      <div className={styles.sucursalesContainer}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <img src="/arquivos/ICONO-UBICACION-NEGRO.png" alt="ubicación" className={styles.titleIcon} />
            Ubicación
          </h1>
        </div>

        {/* SUCURSALES CARDS */}
        <div className={styles.cardsGrid}>
          {sucursalesData.map((sucursal) => (
            <div 
              key={sucursal.id} 
              className={styles.sucursalCard}
              onClick={() => {
                setPosition({
                  lat: sucursal.address.location.latitude,
                  lng: sucursal.address.location.longitude,
                  zoom: 15
                });
              }}
            >
              {/* Main Image with Carousel */}
              <div className={styles.cardImageContainer} onClick={() => openLightbox(sucursal.gallery, activeImageIndex[sucursal.id] || 0)}>
                <img 
                  src={`/arquivos/${sucursal.gallery[activeImageIndex[sucursal.id] || 0]}`} 
                  alt={sucursal.name}
                  className={`${styles.cardMainImage} ${imageTransitioning[sucursal.id] ? styles.fadeOut : styles.fadeIn}`}
                />
                <div className={styles.cardOverlay}>
                  <h2 className={styles.cardTitle}>{sucursal.name}</h2>
                  <p className={styles.cardSubtitle}>{sucursal.subtitle}</p>
                  {sucursal.horarios && <p className={styles.cardHorarios}>{sucursal.horarios}</p>}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className={styles.cardGallery}>
                {sucursal.gallery.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.galleryThumb} ${(activeImageIndex[sucursal.id] || 0) === idx ? styles.activeThumb : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(sucursal.gallery, idx);
                    }}
                  >
                    <img 
                      src={`/arquivos/${img}`} 
                      alt={`${sucursal.name} ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH SECTION */}
        <div className={styles.searchSection}>
          <h2 className={styles.searchTitle}>Encontrá la sucursal más cercana</h2>
          <p className={styles.searchSubtitle}>Busca por código postal</p>
          
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Ingresá tu código postal"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <img src="/arquivos/icono-lupita-39.png" alt="buscar" />
            </button>
          </div>

          <button className={styles.locationButton}>
            <img src="/arquivos/icono-ubicacion-40.png" alt="ubicación" />
            Usar mi ubicación actual
          </button>
        </div>

        {/* MAP SECTION */}
        <div className={styles.mapSection}>
          <Map latitud={position.lat} longitud={position.lng} zoomVal={position.zoom}/>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>&times;</button>
          <button className={styles.lightboxPrev} onClick={(e) => { e.stopPropagation(); prevImage(); }}>&lt;</button>
          <img 
            src={`/arquivos/${lightboxImages[lightboxIndex]}`} 
            alt="Sucursal" 
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={styles.lightboxNext} onClick={(e) => { e.stopPropagation(); nextImage(); }}>&gt;</button>
          <div className={styles.lightboxCounter}>{lightboxIndex + 1} / {lightboxImages.length}</div>
        </div>
      )}
    </>
  )

};

export default Sucursales;