import React, { useEffect } from "react";
import { useProduct } from "vtex.product-context";
import style from "./style.css";

const CustomSkuSlider = ({ minOptions = 4 }) => {
  const productContext = useProduct();
  
  const productUrl = `/${productContext.product.linkText}/p`;

  useEffect(() => {
    const int = setInterval(() => {
      const productTalles = productContext.product.skuSpecifications?.find(
        (i) => i.field.name === "Talle"
      );

      if (!!productTalles && typeof productTalles !== "undefined") {
        clearInterval(int);
        initSlide(productTalles);
      }
    });

    setTimeout(() => {
      clearInterval(int);
    }, 10000);
  });

  const initSlide = (productTalles) => {
    const values = productTalles.values;

    if (values.length > minOptions) {
      let productBox = document.querySelectorAll(
        `.vtex-product-summary-2-x-clearLink[href="${productUrl}"]`
      );

      if (!!productBox.length) {
        productBox.forEach((el) => {
          if (!el.classList.contains(`${style.custom_slide}`)) {
            if (
              !!el.querySelector(
                ".vtex-store-components-3-x-skuSelectorNameContainer"
              )
            ) {
              // dataset
              const pboxOptions = el.querySelectorAll(
                  ".vtex-product-summary-2-x-skuSelectorItem"
                ),
                MAX_STEPS = Math.ceil(pboxOptions.length / minOptions);

              el.querySelector(
                ".vtex-store-components-3-x-skuSelectorOptionsList"
              ).setAttribute("data-steps", MAX_STEPS);
              el.querySelector(
                ".vtex-store-components-3-x-skuSelectorOptionsList"
              ).setAttribute("data-slide", "0");

              // arrows
              let arrowsContainer = document.createElement("div");
              arrowsContainer.classList.add(
                `${style.custom_slider__arrows_container}`
              );

              let arrowRight = document.createElement("div");
              arrowRight.classList.add(`${style.custom_slider__arrow_right}`);
              arrowRight.addEventListener("click", () => moveSlide(el, +1));

              let arrowLeft = document.createElement("div");
              arrowLeft.classList.add(`${style.custom_slider__arrow_left}`);
              arrowLeft.addEventListener("click", () => moveSlide(el, -1));

              arrowsContainer.append(arrowLeft);
              arrowsContainer.append(arrowRight);

              el.querySelector(
                ".vtex-store-components-3-x-skuSelectorSubcontainer"
              ).prepend(arrowsContainer);

              // css
              el.querySelectorAll(
                ".vtex-product-summary-2-x-skuSelectorItem"
              ).forEach((item) => {
                item.style.maxWidth = `calc(${100 / minOptions}% - 8px)`;
                item.style.minWidth = `calc(${100 / minOptions}% - 8px)`;
              });

              el.querySelector(
                ".vtex-store-components-3-x-skuSelectorNameContainer"
              ).style.margin = ".2rem 1rem 1rem";
              el.classList.add(`${style.custom_slide}`);
            }
          }
        });
      }
    }
  };

  const moveSlide = (el, direction) => {

    const slide = el.querySelector(
        ".vtex-store-components-3-x-skuSelectorOptionsList"
    ), maxStep = parseFloat(slide.getAttribute("data-steps"));

    const containerWidth = el.querySelector(
        ".vtex-store-components-3-x-skuSelectorNameContainer"
    ).offsetWidth,

    listWidth = el.querySelector(".vtex-store-components-3-x-skuSelectorOptionsList").scrollWidth;

    let activeStep = parseFloat(slide.getAttribute("data-slide")),
      maxTranslate = listWidth - containerWidth,
      css;

    if (direction === 1) {
      activeStep = activeStep + 1 >= maxStep ? activeStep : activeStep + 1;

      slide.setAttribute("data-slide", activeStep);
      css =
        activeStep * containerWidth > maxTranslate
          ? maxTranslate
          : activeStep * containerWidth;
    } else {
      activeStep = activeStep === 0 ? 0 : activeStep - 1;

      slide.setAttribute("data-slide", activeStep);
      css = activeStep * containerWidth;
    }

    slide.style.left = `${-css}px`;
  };

  return <></>;

};

export default CustomSkuSlider;
