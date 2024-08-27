import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import Groq from "groq-sdk";

const systemPrompt = `
You are ProffyAI Friend, a friendly AI assistant named Proffy. Your purpose is to assist students and engage in conversations about professors. You should be very friendly in your interactions.

- When asked about your purpose, explain that you're here to help students find information about professors and engage in conversations about academic topics.
- Only provide professor recommendations when explicitly asked.
- For general conversation that is not even about the profesors, just re-explain your purpose and drive back users to your purpose, DO NOT answer the question or give the impression you can.
`;

const ragInstructions = `
When asked for professor recommendations:

1. Analyze the query to understand specific requirements or preferences related to professors.
2. Use the RAG approach to search through the database of professors.
3. Evaluate the retrieved information to determine the top 3 professors who best match the criteria.
4. Provide a clear and concise response with the top 3 professors in the following format:

   [Number]. [Professor Name]
    - Subject: [Subject or area of expertise]
    - Rating: [Rating in stars]
    - Review: [Brief summary or excerpt of review]

Ensure all information is up-to-date and accurate. If the query cannot be fully answered, politely inform the user and offer alternative suggestions if possible.
`;

// Initialize Groq API
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const data = await req.json();

    // Initialize Pinecone and Hugging Face Inference API
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const index = pc.index("rag").namespace("ns1");

    const lastMessage = data[data.length - 1];
    const isAskingForRecommendation = lastMessage.content.toLowerCase().includes('recommend') || 
                                      lastMessage.content.toLowerCase().includes('suggest') ||
                                      lastMessage.content.toLowerCase().includes('find professor');

    let messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...data.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    if (isAskingForRecommendation) {
      // Only perform RAG and include RAG instructions if asking for a recommendation
      const embeddingResponse = await hf.featureExtraction({
        model: "intfloat/multilingual-e5-large",
        inputs: lastMessage.content,
        encoding_format: "float",
      });

      const embeddingVector = embeddingResponse;

      if (!embeddingVector || !embeddingVector.length) {
        throw new Error("Invalid or empty embedding vector.");
      }

      const results = await index.query({
        vector: embeddingVector,
        topK: 3,
        includeMetadata: true,
      });

      let resultString = "\n\nReturned results from vector db: ";
      if (results?.matches) {
        results.matches.forEach((match) => {
          resultString += `\n
            Professor: ${match.id}, 
            Subject: ${match.metadata?.subject || "N/A"}, 
            Stars: ${match.metadata?.stars || "N/A"}, 
            Review: ${match.metadata?.review || "N/A"},
            \n\n`;
        });
      }

      messages.push({
        role: "user",
        content: ragInstructions + "\n" + lastMessage.content + resultString
      });
    } else {
      // For normal conversation, just add the user's message
      messages.push({
        role: "user",
        content: lastMessage.content
      });
    }

    // Request completion from Groq API
    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: messages,
      stream: true,
    });

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        let buffer = '';
        let professorCount = 0;

        (async () => {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || "";
              buffer += content;

              while (buffer.includes('\n')) {
                const newlineIndex = buffer.indexOf('\n');
                let line = buffer.slice(0, newlineIndex).trim();
                buffer = buffer.slice(newlineIndex + 1);

                if (line.match(/^\d+\./)) {
                  if (professorCount > 0) {
                    controller.enqueue(encoder.encode('\n'));
                  }
                  professorCount++;
                  controller.enqueue(encoder.encode(line + '\n'));
                } else if (line.includes(':')) {
                  const [key, value] = line.split(':');
                  const formattedLine = `* ${key.trim().replace(/^\*+\s*/, '')}: ${value.trim()}\n`;
                  controller.enqueue(encoder.encode(formattedLine));
                } else if (line !== '') {
                  controller.enqueue(encoder.encode(line + '\n\n'));
                }
              }
            }

            if (buffer.trim() !== '') {
              controller.enqueue(encoder.encode(buffer.trim() + '\n'));
            }
          } catch (err) {
            controller.error(err);
          } finally {
            controller.close();
          }
        })();
      },
    });

    return new NextResponse(stream);
  } catch (err) {
    console.error("Error in POST /api/chat:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}