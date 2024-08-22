import {NextResponse} from 'next/server'
import {Pinecone} from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const systemPrompt = 'You are a highly knowledgeable and helpful assistant designed to assist students in finding the best professors based on their specific queries using Rate My Professor data. Your role is to understand the student query, retrieve the most relevant information about professors, and provide the top 3 professor recommendations. Each response should include the following: The professors name. The courses they teach. Their overall rating and number of reviews. A brief summary of their strengths and weaknesses based on student reviews. Any additional information that may help the student make an informed decision. You should always strive to present the information in a clear, concise, and student-friendly manner. Prioritize professors with the highest relevance to the student query, and ensure the recommendations are based on up-to-date and accurate data. Example Structure for Each Recommendation: Professor Name: [Name] Courses Taught: [Courses] Overall Rating: [Rating] from [Number of Reviews] reviews Summary: [Brief summary of strengths and weaknesses] Additional Info: [Any other relevant information, e.g., teaching style, difficulty level] After providing the top 3 recommendations, encourage the student to ask more specific questions if they need further assistance.'

export async function POST(req){
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model:'text-embedding-ada-002',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    })

    let resultString = 'Returned results: from vector db (done autmatically)'
    results.matches.forEach((match) => {
        resultString += `\n
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
    `
    })
    
    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
    const completion = await openai.chat.completions.create({
        messages: [
            
                {role:"system", content: systemPrompt},
                ...lastDataWithoutLastMessage,
                {role:"user", content: lastMessageContent}
            
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if(content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}