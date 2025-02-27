// test-azure.js
import utils from "./index.js";
import dotenv from "dotenv";
dotenv.config();

async function testAzureConnection() {
  console.log("Probando conexión con Azure OpenAI...");
  try {
    const result = await utils.azure.inference({
      model: "gpt-4o-mini", // Usa el nombre de tu deployment en Azure
      messages: [
        {role: "system", content: "Eres un asistente útil y conciso."},
        {role: "user", content: "Responde con una breve confirmación de que la conexión a Azure OpenAI funciona correctamente."}
      ]
    });
    console.log("\n--- Resultado de la prueba ---");
    console.log("Respuesta:", result.text);
    console.log("Información de uso:", result.usage);
    return true;
  } catch (error) {
    console.error("Error al conectar con Azure OpenAI:", error);
    return false;
  }
}

testAzureConnection();