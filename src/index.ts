import { Elysia, t, ws } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import sanitizeHtml from 'sanitize-html';
import { marked } from "marked";
import OpenAI from 'openai';

interface ChatBody {
    conversation: string;
    message: string;
}

const context = "You are a kind, happy, and smart assistant. Being wrong is against your nature.";
const maxTokens = 2048;
const model = "gpt-4-1106-preview";
const permittedTags = sanitizeHtml.defaults.allowedTags.concat(['a', 'br']);
const temperature = 0.2;

const aiIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-robot">
    <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z"></path>
    <path d="M10 16h4"></path>
    <circle cx="8.5" cy="11.5" r=".5" fill="currentColor"></circle>
    <circle cx="15.5" cy="11.5" r=".5" fill="currentColor"></circle>
    <path d="M9 7l-1 -4"></path>
    <path d="M15 7l1 -4"></path>
</svg>
`;

const userIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-user">
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
</svg>
`;

const openai = new OpenAI(); // Initialize OpenAI

const conversationItem = (history: string, id?: string): string => `
  <input 
    type="hidden"
    name="conversation"
    id="${id ?? 'conversation'}"
    value="${history}"
    hidden
    hx-swap-oob="true">
  `;

const messageSection = (...contents: string[]): string => `
  <section id="messages" hx-swap-oob="beforeend">
    ${contents.join('')}
  </section
`

const messageItem = (
    author: string,
    message: string,
    backgroundClasses?: string,
    id?: string,
    attrs?: string): string => {
    // tidy the message as appropriate
    message = message.replace(/\\n/g, '<br>')
    let parsedResult = marked.parse(message)
    const sanitized = sanitizeHtml(parsedResult, {
        allowedTags: permittedTags
    })

    // Determine the author content
    let authorContent;
    if (author === "AI") {
        authorContent = aiIconSVG;
    } else if (author === "You") {
        authorContent = userIconSVG;
    } else {
        authorContent = author;
    }

    return `
    <article
      class="p-2 flex gap-1 ${backgroundClasses ?? ''}"
      id="${id ?? ''}" 
      ${attrs ?? ''}>
      <header class="font-bold min-w-[3em]">${authorContent}</header>
      <section>${sanitized}</section>
    </article>`
}

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .use(ws())
    .get("/", () => Bun.file("src/pages/index.html").text())
    .ws("/chatbot", {
        async message(ws, input) {
            const { conversation, message } = input as ChatBody;

            let parsedConversation: Array<{ role: string, content: string }> = [];
            if (conversation && conversation !== "") {
                try {
                    parsedConversation = JSON.parse(conversation).map(msg => {
                        return {
                            role: msg.author === "User:" ? "user" : "assistant",
                            content: msg.content
                        };
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            // Add the new user message to the conversation
            parsedConversation.push({
                role: "user",
                content: message
            });

            // configure the 🤖 request
            const req = {
                model,
                messages: parsedConversation,
                stream: true,
            }

            // Create an ID we can use to replace the message as it is built out over the websocket
            const aiMessageId = `m-id-${Date.now()}`;

            // Send the basic structure. One element should have the ai message ID to be replaced.
            ws.send(
                messageSection(
                    messageItem("You", message),
                    messageItem("AI", "...", "bg-blue-100", aiMessageId)  // Initial message is '...'
                )
            );

            let aiResult = "";
            try {
                const stream = await openai.chat.completions.create(req);
                for await (const part of stream) {
                    const chunk = part.choices[0]?.delta?.content || '';
                    aiResult += chunk;
                    ws.send(messageItem("AI", aiResult, "bg-blue-100", aiMessageId, "hx-swap-oob='true'")); // Send incremental updates
                }
            } catch (e) {
                // Log the error, and return a red error result
                console.error("Error from server: ", e);
                const errMsg = messageItem("Error", "Encountered an issue with your request, please try again.", "bg-red-100");
                ws.send(`
                    ${messageSection(errMsg)}
                    ${conversationItem(conversation)}
                `);
                return;
            }

            // Push the new message into the conversation for the next request to use
            parsedConversation.push({
                role: "assistant",
                content: aiResult
            });
            const history = JSON.stringify(parsedConversation.map(msg => {
                return {
                    author: msg.role === "user" ? "User:" : "AI:",
                    content: msg.content
                };
            })).replace(/"/g, '&quot;');
            ws.send(conversationItem(history))
            return;
        },
    }).listen(3000);

console.log("Ready to chat!");
