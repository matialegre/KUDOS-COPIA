# Pricing Service

Service app for Mundo Outdoor that provides pricing calculations and tax-related operations.

## Features

- **Sum endpoint**: Simple test endpoint for `1+1` calculations
- **Future**: Net price calculation (price without taxes)
- **Future**: Checkout simulation integration
- **Future**: Dynamic shipping costs
- **Future**: Stock-based store pickup

## Installation

1. Link the app in your development workspace:
   ```bash
   cd PricingService
   vtex link
   ```

2. Install in your workspace:
   ```bash
   vtex install mundooutdoorar.pricing-service
   ```

## Endpoints

### Sum (Test)
- **Path**: `/_v/mundo/sum`
- **Method**: GET
- **Query params**:
  - `x` (optional, default: 1)
  - `y` (optional, default: 1)
- **Example**: `https://pandemoniumdev--mundooutdoorar.myvtex.com/_v/mundo/sum?x=5&y=7`
- **Response**:
  ```json
  {
    "x": 5,
    "y": 7,
    "result": 12
  }
  ```

## Configuration

Settings can be configured in the VTEX Admin under Apps > My Apps > Pricing Service:

- **Default VAT Rate**: Default VAT rate for Argentina (default: 0.21)
- **Default Postal Code**: Default postal code for simulation (default: "8000")
- **Seller ID**: Default seller ID (default: "1")

## Development

This service uses:
- Node builder 7.x
- @vtex/api 6.50.1
- TypeScript 3.9.7

## License

Proprietary - Mundo Outdoor
