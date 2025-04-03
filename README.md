# PDF Reading Mentor

An interactive Next.js application that allows users to upload PDF documents and interact with an AI mentor. The AI can read the content aloud, answer questions about the document, and provide navigation controls.

## Features

- **PDF Upload & Processing**: Upload and process PDF files directly in the browser
- **Text-to-Speech**: Listen to the PDF content with customizable playback options
- **AI Question Answering**: Ask questions about the document and get intelligent responses
- **Interactive PDF Viewer**: View PDF content with synchronized highlighting during reading
- **Accessibility Features**: Keyboard navigation and screen reader compatibility

## Technology Stack

- **Frontend**: Next.js, React.js, Tailwind CSS
- **PDF Processing**: pdf.js, react-pdf
- **AI Integration**: OpenAI GPT-3.5
- **Text-to-Speech**: Web Speech API (browser native)
- **State Management**: React Hooks

## Setup & Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- OpenAI API key

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pdf-reading-mentor.git
cd pdf-reading-mentor
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your API keys:

```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage Guide

### Uploading a PDF

1. Click on the upload area or drag and drop a PDF file
2. Wait for the PDF to be processed (text extraction)
3. The PDF will be displayed in the viewer once processing is complete

### Reading the Document

1. Use the play button to start reading the document
2. Control the reading with the playback controls:
   - Play/Pause: Start or pause reading
   - Skip forward/backward: Navigate through paragraphs
   - Volume control: Adjust the reading volume
   - Speed control: Adjust the reading speed

### Asking Questions

1. Type your question in the input field
2. Click the send button or press Enter
3. The AI will analyze the document and provide an answer
4. You can ask follow-up questions to continue the conversation

## Project Structure

```
pdf-reading-mentor/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages
│   │   ├── api/        # API routes
│   ├── styles/         # CSS styles
│   └── utils/          # Utility functions
├── .env.local          # Environment variables
├── next.config.js      # Next.js configuration
└── package.json        # Project dependencies
```

## Accessibility Features

- Keyboard navigation support
- ARIA attributes for screen readers
- Focus management for interactive elements
- High contrast text and controls
- Text resizing support

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## Deployment

This application can be deployed to any platform that supports Next.js:

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the application first:

```bash
npm run build
# or
yarn build
```

Then deploy the resulting `.next` folder according to your hosting provider's instructions.

## Troubleshooting

- **PDF not loading**: Check if the PDF file is valid and not corrupted
- **Text-to-Speech not working**: Ensure your browser supports the Web Speech API
- **AI not responding**: Verify your OpenAI API key and network connectivity

## License

MIT License