'use client'

import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { AIResponseData } from "../types";
import Statistics from '../statistics/page';

export default function Analysis() {
    const [foodInput, setFoodInput] = useState("");
    const [image, setImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState<AIResponseData | null>(null);

    const HUGGING_FACE_API_KEY = "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";
    const MODEL_NAME = "meta-llama/Llama-3.2-11B-Vision-Instruct";

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setImage(file);

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                    },
                    body: formData,
                });

                const data: AIResponseData = await response.json();
                setAnalysisResult(data);
            } catch (error) {
                console.error("Error analyzing image:", error);
            }
        }
    };

    const handleTextSubmit = async () => {
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: foodInput }),
            });

            const data: AIResponseData = await response.json();
            setAnalysisResult(data);
        } catch (error) {
            console.error("Error analyzing text:", error);
        }
    };

    return (
        <>
        <section className={styles.main}>
            <h1 className={styles.heading}>Food Analysis</h1>

            <section className={styles.inputSection}>
                <h2>Upload an Image of Your Food</h2>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className={styles.imageInput} 
                />

                <h2>Or Enter a Text Description</h2>
                <textarea 
                    value={foodInput} 
                    onChange={(e) => setFoodInput(e.target.value)} 
                    placeholder="Describe your food (e.g., 'grilled chicken with vegetables')"
                    className={styles.textInput}
                ></textarea>
                <button 
                    onClick={handleTextSubmit} 
                    className={styles.submitButton}
                >
                    Analyze
                </button>
            </section>

            {analysisResult && (
                <section className={styles.resultSection}>
                    <h2>Analysis Results</h2>
                    <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
                    {/* Display the analysis data in a readable format */}
                </section>
            )}
        </section>
        { analysisResult !== null && <Statistics response={analysisResult!} /> }
        </>
    );
}
