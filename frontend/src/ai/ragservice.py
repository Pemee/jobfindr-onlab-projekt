import os
import re
from typing import List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter

CHROMA_DIR = "./chroma-store"
UPLOAD_DIR = "./uploads"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-pdf")
async def upload_pdf(id: str = Form(...), pdf: UploadFile = File(...)):
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        id = id.zfill(3)
        new_filename = f"{id}.pdf"
        pdf_path = os.path.join(UPLOAD_DIR, new_filename)

        with open(pdf_path, "wb") as f:
            content = await pdf.read()
            f.write(content)

        pdf_id = os.path.splitext(new_filename)[0]
        store_pdf_chunks(pdf_path, pdf_id)

        return {"pdfId": pdf_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/generate-questions")
def get_questions(pdfId: str):
    try:
        qa = generate_questions(pdfId)
        return JSONResponse(content=qa)  # Returns {"questions": [...], "answers": [...]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def store_pdf_chunks(pdf_path: str, pdf_id: str):
    loader = PyPDFLoader(pdf_path)
    raw_docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    split_docs = splitter.split_documents(raw_docs)
    for doc in split_docs:
        doc.metadata["_type"] = "document"
    embeddings = OllamaEmbeddings(model="nomic-embed-text")

    Chroma.from_documents(
        documents=split_docs,
        embedding=embeddings,
        collection_name=pdf_id,
        persist_directory=CHROMA_DIR
    )


def parse_questions_answers(text: str):
    questions = []
    answers = []

    # Debugging: Print the raw text before parsing
    print(f"Raw Text:\n{text}")

    # Adjusted pattern to account for more flexible spaces and potential extra line breaks
    # We now use \s* to allow for optional spaces or newlines after the "Question X:" part
    pattern = re.compile(
        r"Question \d+: (.*?)\n\s*- (.*?)\n\s*- (.*?)\n\s*- (.*?)\n\s*- (.*?)\s*(?=\n|$)",  # Non-greedy match until end of string
        re.DOTALL
    )

    matches = pattern.findall(text)

    # Debugging: print the matches found
    print(f"Matches found: {len(matches)}")
    
    for match in matches:
        question = match[0].strip()  # The question text
        a1 = match[1].strip()  # Answer 1
        a2 = match[2].strip()  # Answer 2
        a3 = match[3].strip()  # Answer 3
        a4 = match[4].strip()  # Answer 4

        # Ensure the answers are ordered correctly (assuming first answer is correct)
        final_answers = [a1, a2, a3, a4]
        questions.append(question)
        answers.append(final_answers)

    # Debugging: Print the final number of parsed questions and answers
    print(f"Total questions parsed: {len(questions)}")
    
    return questions, answers


def generate_questions(pdf_id: str) -> dict:
    try:
        embeddings = OllamaEmbeddings(model="nomic-embed-text")
        vector_store = Chroma(
            collection_name=pdf_id,
            embedding_function=embeddings,
            persist_directory=CHROMA_DIR
        )
        retriever = vector_store.as_retriever()
        llm = ChatOllama(model="mistral", temperature=0)

        prompt = PromptTemplate.from_template(
            """You are a helpful assistant. Given the following context, generate 5 multiple-choice questions with 4 possible answers. 

            - Each question should have one correct answer and three incorrect answers.
            - The correct answer should ALWAYS be placed first, followed by the 3 incorrect answers.
            - Do NOT write explicitly in the answer if it is correct just make it be the first answer.
            - Always end the question part with question mark.
            - Provide the questions and answers in the following format:

    Question 1: <Question here>
    - <correct Answer >
    - <Answer 1>
    - <Answer 2>
    - <Answer 3>

    Question 2: <Question here>
    - <correct Answer >
    - <Answer 1>
    - <Answer 2>
    - <Answer 3>

    [Continue for 5 total questions]

Context:
{context}
        """
        )

        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        chain = create_retrieval_chain(retriever, question_answer_chain)

        result = chain.invoke({
            "input": "Generate 5 questions from the context with only 4 answer options to each one question and the response must follow the given format!"
        })

        raw_text = result['answer']
        print(f"Chain result:\n{raw_text}")
        questions, answers = parse_questions_answers(raw_text)
        print("Parsed questions:", questions)
        print("Parsed answers:", answers)

        return {
            "questions": questions,
            "answers": answers
        }

    except Exception as e:
        print(f"Error in generate_questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))
