import { MoveEnvio } from "./src/js/Cart/MoveEnvio.js";
import { RemoveEnvioProductBox } from "./src/js/Cart/RemoveEnvioProductBox.js";
import './app.css';

window.addEventListener("load", function (event) {

    console.log("Recursos cargados");
    // Cart
    RemoveEnvioProductBox();

});