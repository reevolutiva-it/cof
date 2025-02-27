import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

let openai;
try {
	openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});
} catch (e) {
	console.error("utils:openai : " + e);
}

/**
 * Performs inference using the OpenAI API with streaming support.
 *
 * @param {Object} options - The options for the inference function.
 * @param {string} [options.model='gpt-4o-mini'] - The model to use for inference.
 * @param {Array} options.messages - The messages to send to the model.
 * @param {WritableStream} [options.stream=process.stdout] - The stream to write the output to.
 * @returns {Promise<Object>} The result of the inference, including the generated text and usage information.
 */
async function inference({
	model = `gpt-4o-mini`,
	messages,
	stream = process.stdout,
}) {
	const streaming = await openai.chat.completions.create({
		model,
		messages,
		stream: true,
		stream_options: { include_usage: true },
	});

	let text = "";
	let usage = {};
	let cutoff_reached = false;
	let chunks_buffer = "";
	let chunks_iterator = 0;
	const chunks_every = 5;
	for await (const chunk of streaming) {
		const content = chunk.choices[0]?.delta?.content || "";
		if (content) {
			text += content;
			chunks_buffer += content;
			chunks_iterator++;
			if (stream?.cutoff) {
				if (!cutoff_reached && text.includes(stream.cutoff)) {
					cutoff_reached = true;
				}
			}
			if (!(chunks_iterator % chunks_every)) {
				stream.write(!cutoff_reached ? chunks_buffer : " ...");
				chunks_buffer = "";
			}
		}
		if (chunk.usage) usage = { ...chunk.usage };
	}
	stream.write(`\n`);

	return {
		text,
		usage: { model, ...usage },
	};
}
/**
 * Vectorizes the given texts using the specified embedding model.
 *
 * @param {Object} params - The parameters for the vectorization.
 * @param {string[]} params.texts - The texts to be vectorized.
 * @param {string} [params.model=process.env.EMBEDDING_MODEL || 'text-embedding-3-small'] - The embedding model to use.
 * @returns {Promise<Object>} An object containing the vectors and usage information.
 * @returns {number[][]} returns.vectors - The vectorized representations of the input texts.
 * @returns {Object} returns.usage - The usage information including the model used.
 */
async function vectorize({
	texts,
	model = process.env.EMBEDDING_MODEL || `text-embedding-3-small`,
}) {
	const response = await openai.embeddings.create({
		model,
		input: texts,
		encoding_format: "float",
	});
	return {
		vectors: response.data
			.sort((a, b) => a.index - b.index)
			.map((e) => e.embedding),
		usage: { model, ...response.usage },
	};
}

/**
 * Transcribes audio from a given file path using the OpenAI Whisper model.
 *
 * @param {Object} params - The parameters for the transcription.
 * @param {string} params.path - The file path of the audio to be transcribed.
 * @returns {Promise<Object>} A promise that resolves to an object containing the transcript.
 * @returns {Promise<string>} returns.transcript - The transcribed text from the audio file.
 */
async function transcribe({ path }) {
	console.dir({ "debug:utils:openai:transcribe:received": { path } });
	const response = await openai.audio.transcriptions.create({
		file: fs.createReadStream(path),
		model: "whisper-1",
	});
	console.dir({ "debug:utils:openai:transcribe": { path, response } });
	return {
		transcript: response.text,
	};
}

export default {
	inference,
	vectorize,
	transcribe,
};
