# **Por que este componente**

### Sliders nativos en product box dentro de sliders de productos (ej. sliders de home), se bugean de tal manera que; dentro de los productos en los sliders del selector de sku podemos encontrar otros productos.
###
&nbsp;

---

&nbsp;
#### PROPIEDADES
| nombre | tipo | descripcion | obligatorio | p/defecto |
| ------ | ---- | ----------- | ----------- | -------- |
| minOptions | num | Indica la cantidad mínima de sku necesarios para crear el slide. | **No** | 4
&nbsp;

**<span style="color:red">IMPORTANTE:</span>** El skuSelector debe llevar la clase product-box, como en el siguiente ej:

```
"product-summary-sku-selector#product-box": {
  "props": {
    "blockClass": "skuSelector-product-box",
    "disableUnavailableSelectOptions": true,
    "hideImpossibleCombinations": true,
    "sortVariationsByLabel": true,
    "initialSelection": "empty",
    "showVariationsLabels": "none",
    "visibility": "more-than-one",
    "visibleVariations": [ "Talle" ]
  }
}
```