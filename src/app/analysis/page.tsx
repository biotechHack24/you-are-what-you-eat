'use client'

import { useState } from 'react';
import styles from "./page.module.css";
import { AIResponseData } from "../types";
import Statistics from '../statistics/page';

export default function Analysis() {
    const [foodInput, setFoodInput] = useState("");
    const [image, setImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState<AIResponseData | null>(null);
    const [loading, setLoading] = useState(false);

    const HUGGING_FACE_API_KEY = "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";
    const MODEL_NAME = "meta-llama/Llama-3.2-11B-Vision-Instruct";

    const handleImageUpload = async (event: any) => {
        const file = event.target.files[0];
        setImage(file);

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            setLoading(true);

            try {
                const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                const relevantData: AIResponseData = {
                    nutrients: {
                        carbohydrates: data.nutrients?.carbohydrates ?? 0,
                        protein: data.nutrients?.protein ?? 0,
                        minerals: data.nutrients?.minerals ?? 0,
                        dairy: data.nutrients?.dairy ?? 0
                    },
                    environment: {
                        co2_score: data.environment?.co2_score ?? 0,
                        water_score: data.environment?.water_score ?? 0,
                        land_score: data.environment?.land_score ?? 0
                    },
                    nutrient_score: data.nutrient_score ?? 0,
                    environment_score: data.environment_score ?? 0
                };
                setAnalysisResult(relevantData);
            } catch (error) {
                console.error("Error analyzing image:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTextSubmit = async () => {
        setLoading(true);

        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_NAME}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `Analyze the following food description and return a JSON object with fields for 'nutrients' (carbohydrates, protein, minerals, dairy), 'environment' (co2_score, water_score, land_score), 'nutrient_score', and 'environment_score'. Ensure that all values sum up to 100. Here is the description: '${foodInput}'`
                }),
            });

            const data = await response.json();

            const relevantData: AIResponseData = {
                nutrients: {
                    carbohydrates: data.nutrients?.carbohydrates ?? 0,
                    protein: data.nutrients?.protein ?? 0,
                    minerals: data.nutrients?.minerals ?? 0,
                    dairy: data.nutrients?.dairy ?? 0
                },
                environment: {
                    co2_score: data.environment?.co2_score ?? 0,
                    water_score: data.environment?.water_score ?? 0,
                    land_score: data.environment?.land_score ?? 0
                },
                nutrient_score: data.nutrient_score ?? 0,
                environment_score: data.environment_score ?? 0
            };
            setAnalysisResult(relevantData);
        } catch (error) {
            console.error("Error analyzing text:", error);
        } finally {
            setLoading(false);
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
                    disabled={loading}
                >
                    {loading ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        "Analyze"
                    )}
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

        {analysisResult !== null && <Statistics response={analysisResult} />}
        </>
    );
}