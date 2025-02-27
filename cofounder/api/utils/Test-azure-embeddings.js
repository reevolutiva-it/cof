import dotenv from "dotenv";
import { AzureOpenAI } from "openai";
dotenv.config();

// Inicializar cliente para Azure
const client = new AzureOpenAI({
  azure: {
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "https://ReevCL.openai.azure.com/",
    apiVersion: "2024-05-01-preview"
  }
});

async function testAzureEmbeddings() {
  console.log("Probando servicio de embeddings con Azure OpenAI...");
  
  try {
    // Textos de ejemplo para vectorizar
    const testTexts = [
      "Este es un texto de ejemplo para probar embeddings",
      "Los embeddings son representaciones numéricas de texto"
    ];
    
    // Nombre del modelo desplegado en Azure
    const deploymentName = "text-embedding-3-small";
    
    console.log(`Enviando ${testTexts.length} textos al modelo ${deploymentName}...`);
    
    const response = await client.embeddings.create({
      model: deploymentName,
      input: testTexts,
      encoding_format: "float"
    });
    
    // Verificar respuesta
    const embeddings = response.data.map(item => item.embedding);
    
    console.log("\n--- Resultado de la prueba ---");
    console.log(`✅ Éxito: Se obtuvieron ${embeddings.length} vectores`);
    console.log(`📊 Dimensiones: ${embeddings[0].length}`);
    console.log(`📈 Primeros 5 valores del primer vector: [${embeddings[0].slice(0, 5).join(', ')}]`);
    console.log(`🔢 Tokens utilizados: ${response.usage.total_tokens}`);
    
    return {
      success: true,
      embeddings: embeddings,
      usage: response.usage
    };
  } catch (error) {
    console.error("❌ Error al conectar con servicio de embeddings de Azure OpenAI:", error);
    console.log("Detalles del error:");
    if (error.response) {
      console.log("- Estado HTTP:", error.response.status);
      console.log("- Mensaje:", error.response.statusText);
      if (error.response.data) console.log("- Datos:", error.response.data);
    } else {
      console.log("- Mensaje:", error.message);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Ejecutar la prueba
testAzureEmbeddings().then(result => {
  if (result.success) {
    console.log("\n✅ La integración de embeddings con Azure OpenAI funciona correctamente");
  } else {
    console.log("\n❌ La integración de embeddings con Azure OpenAI falló");
  }
});