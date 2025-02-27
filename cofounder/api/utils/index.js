import parsers from "./parsers.js";
import openai from "./openai.js";
import vectra from "./vectra.js";
import render from "./render.js";
import firebase from "./firebase.js";
import storage from "./storage.js";
import load from "./load.js";
import anthropic from "./anthropic.js";
import azure from "./azure.js";

export default {
    parsers,
    openai,
    anthropic,
    azure,  // Añadimos el nuevo proveedor
    vectra,
    render,
    firebase,
    storage,
    load,
};
