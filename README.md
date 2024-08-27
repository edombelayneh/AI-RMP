This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

bash
npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Project Setup

## 1. Prerequisites

Before you start, ensure you have the following installed:

- **Miniconda:** For environment management.
- **Python 3.8+:** The project requires Python 3.8 or higher.
- **Node.js & npm:** Required for the Next.js frontend.

## 2. Environment Setup

### Python Environment

1. **Create and activate the Conda environment:**

   ```bash
   conda create -n rag python=3.8
   conda activate rag
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the .env file for Python:**

   - Create a `.env` file in the root of the backend directory.
   - Add the following environment variables:
     ```
     PINECONE_API_KEY=your_pinecone_api_key
     ```

4. **Pinecone API Key Setup:**
   - Generate a Pinecone API key from the Pinecone dashboard or copy the default one.
   - Paste the key into the `.env` file with the name `PINECONE_API_KEY`.

### Next.js Environment

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Set up the .env.local file for Next.js:**
   - Create a `.env.local` file in the root of the Next.js project.
   - Add the following environment variables:
     ```
     # NEXT_GROQ_API_KEY=your_groq_api_key
     ```

## 3. Pinecone Setup

This project uses Pinecone for vector storage. Follow these steps:

1. Sign up for a Pinecone account if you don’t have one.
2. Generate or copy your Pinecone API key from the Pinecone dashboard.
3. Set the Pinecone API key in your `.env` file as described above.

## 4. Embedding Data with `load.ipynb`

The `load.ipynb` notebook helps you generate the Pinecone index and embed your data:

1. Run the code cells in `load.ipynb` to:
   - Initialize the database in Pinecone.
   - Embed your data using the `intfloat/multilingual-e5-large` model.
2. Ensure the notebook runs successfully, as it will handle both database creation and data embedding.

## 5. Installing Dependencies

To ensure consistent environments, use `pip-chill` to generate a list of installed Python packages:

1. **Install `pip-chill`:**

   ```bash
   pip install pip-chill
   ```

2. **Generate the `requirements.txt` file:**

   ```bash
   pip-chill > requirements.txt
   ```

3. **Install dependencies from the `requirements.txt` file:**
   ```bash
   pip install -r requirements.txt
   ```
