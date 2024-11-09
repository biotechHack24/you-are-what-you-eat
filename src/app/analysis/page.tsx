'use client'

import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { AIResponseData } from "../types";

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

    useEffect(() => {
        if (analysisResult) {
            // Process the result as needed to update chart or other components
        }
    }, [analysisResult]);

    return (
        <section className={styles.main}>
            {!analysisResult ? (
                <>
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
                </>
            ) : (
                <section className={styles.data}>
                    <div className={styles.data_section}>
                        <h2 className={styles.section_heading}>Nutrients</h2>
                        <canvas id="chart" className={styles.graphic}></canvas>
                        <p className={styles.score}>Overall Health Score: {analysisResult.nutrient_score}</p>
                    </div>

                    <div className={styles.data_section}>
                        <h2 className={styles.section_heading}>Environment</h2>
                        <section className={styles.graphic}>
                            <div className={styles.progress}>
                                <label>CO2 Emission Score:</label>
                                <meter className={styles.progress_bar} 
                                    value={analysisResult.environment.co2_score} 
                                    max={100}
                                    optimum={100}
                                    low={50}>
                                </meter>
                            </div>

                            <div className={styles.progress}>
                                <label>Water Usage Score:</label>
                                <meter className={styles.progress_bar} 
                                    value={analysisResult.environment.water_score} 
                                    max={100}
                                    optimum={100}
                                    low={50}>
                                </meter>
                            </div>

                            <div className={styles.progress}>
                                <label>Land Usage Score:</label>
                                <meter className={styles.progress_bar} 
                                    value={analysisResult.environment.land_score} 
                                    max={100}
                                    optimum={100}
                                    low={50}>
                                </meter>
                            </div>
                        </section>
                        <p className={styles.score}>Overall Environment Score: {analysisResult.environment_score}</p>
                    </div>
                </section>
            )}
        </section>
    );
}