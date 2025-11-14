import React from 'react'
import './pagos-promociones.global.css'

interface LogoCardProps {
  imageUrl: string
  text1: string
  text2: string
  alt: string
}

const LogoCard: React.FC<LogoCardProps> = ({ imageUrl, text1, text2, alt }) => {
  return (
    <div className="logo-card">
      <img src={imageUrl} alt={alt} className="logo-image" />
      <p className="logo-text-bold">{text1}</p>
      <p className="logo-text-green">{text2}</p>
    </div>
  )
}

const PagosPromociones: React.FC = () => {
  return (
    <div className="pagos-promociones-container">
      <h1 className="main-title">Pagos y promociones</h1>

      {/* Promociones Bancarias */}
      <section className="section">
        <h2 className="section-title">Promociones Bancarias</h2>
        <p className="section-subtitle">
          Hacé clic en cada logo para conocer los detalles y vigencia de cada promoción
        </p>
        <div className="logos-row">
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-51.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Banco Provincia"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-52.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Credicoop"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-53.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="BBVA Modo"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-54.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Naranja X"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-55.png"
            text1="Todos los días"
            text2="3 cuotas sin interés"
            alt="Coopeplus"
          />
        </div>
      </section>

      {/* Tarjeta de crédito */}
      <section className="section">
        <h2 className="section-title">Tarjeta de crédito</h2>
        <div className="logos-row">
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-56.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Visa"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-57.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Mastercard"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-58.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="American Express"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-60.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Cabal"
          />
        </div>
      </section>

      {/* Tarjeta de débito */}
      <section className="section">
        <h2 className="section-title">Tarjeta de débito</h2>
        <div className="logos-row">
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-61.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Visa Débito"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-62.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Maestro"
          />
          <LogoCard
            imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-60.png"
            text1="Todos los días"
            text2="6 cuotas sin interés"
            alt="Cabal Débito"
          />
        </div>
      </section>

      {/* Sección inferior con dos columnas */}
      <div className="bottom-sections">
        {/* Promociones Habituales */}
        <section className="section half-section">
          <h2 className="section-title">Promociones Habituales</h2>
          <div className="logos-row">
            <LogoCard
              imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-65.png"
              text1="Todos los días"
              text2="3 cuotas sin interés"
              alt="3 cuotas"
            />
            <LogoCard
              imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-66.png"
              text1="Todos los días"
              text2="6 cuotas sin interés"
              alt="6 cuotas"
            />
          </div>
        </section>

        {/* Otros medios de pago */}
        <section className="section half-section">
          <h2 className="section-title">Otros medios de pago</h2>
          <div className="logos-row">
            <LogoCard
              imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-63.png"
              text1="Todos los días"
              text2=""
              alt="Mercado Pago"
            />
            <LogoCard
              imageUrl="https://mundooutdoorar.vtexassets.com/arquivos/tarjetas-64.png"
              text1="Todos los días"
              text2=""
              alt="Modo"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default PagosPromociones
