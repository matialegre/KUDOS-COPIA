import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useProduct } from 'vtex.product-context'

import styles from './index.css'

const getInstallmentsList = offer => {
  if (!offer) {
    return []
  }

  return offer.Installments ?? offer.installments ?? []
}

const getInterestRate = installment => {
  if (!installment) {
    return null
  }

  return installment.InterestRate ?? installment.interestRate ?? null
}

const getNumberOfInstallments = installment =>
  installment?.NumberOfInstallments ?? installment?.numberOfInstallments ?? 0

const getInstallmentValue = installment =>
  installment?.Value ?? installment?.value ?? 0

const ProductInstallments = ({
  onlyInterestFree = true,
  pickStrategy = 'max', // max | min
  targetInstallments = null,
}) => {
  const productContext = useProduct()
  const intl = useIntl()

  const offer = productContext?.selectedItem?.sellers?.[0]?.commertialOffer
  const currency = offer?.Currency ?? offer?.currency ?? 'ARS'

  const selectedInstallment = useMemo(() => {
    const installments = getInstallmentsList(offer)

    if (!installments.length) {
      return null
    }

    const filtered = onlyInterestFree
      ? installments.filter(item => (getInterestRate(item) ?? 0) === 0)
      : installments

    if (!filtered.length) {
      return null
    }

    if (targetInstallments) {
      const exact = filtered.find(
        item => getNumberOfInstallments(item) === targetInstallments
      )

      if (exact) {
        return exact
      }
    }

    const sorted = [...filtered].sort((a, b) => {
      const aNumber = getNumberOfInstallments(a)
      const bNumber = getNumberOfInstallments(b)

      return pickStrategy === 'min' ? aNumber - bNumber : bNumber - aNumber
    })

    return sorted[0] ?? null
  }, [offer, onlyInterestFree, pickStrategy, targetInstallments])

  if (!selectedInstallment) {
    return null
  }

  const installmentsNumber = getNumberOfInstallments(selectedInstallment)
  const installmentValue = getInstallmentValue(selectedInstallment)

  if (!installmentsNumber || !installmentValue) {
    return null
  }

  const formattedValue = intl.formatNumber(installmentValue, {
    style: 'currency',
    currency,
  })

  return (
    <div className={styles.productInstallmentsContainer}>
      <span className={styles.productInstallmentsText}>
        {intl.formatMessage(
          {
            id: 'store/product-installments.custom-message',
            defaultMessage: '{installmentsNumber} cuotas sin interés de {installmentValue}',
          },
          {
            installmentsNumber,
            installmentValue: formattedValue,
          }
        )}
      </span>
    </div>
  )
}

export default ProductInstallments
