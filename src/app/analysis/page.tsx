'use client'

import { useState } from 'react';
import styles from "./page.module.css";
import { AIResponseData } from "../types";
import Statistics from '../statistics/page';
import { HfInference } from "@huggingface/inference"

const prompt :string = 
`Do not include the prompt in your response. Respond with a JSON object based on the following types: 
export type AIResponseData = {
nutrients         :NutrientsData,
nutrient_score    :number,
environment       :EnvironmentData,
environment_score :number,
}

export type NutrientsData = {
carbohydrates :number,
protein       :number,
minerals      :number,
dairy         :number
}

export type EnvironmentData = {
co2_score      :number,
water_score    :number,
land_score     :number
}

Make sure that the numbers in NutrientsData should add up to 100. Here's an example:
{
nutrients: {
    carbohydrates: 50,
    protein: 15,
    minerals: 10,
    dairy: 25
},

nutrient_score: 70,

environment: {
    co2_score: 60,
    water_score: 50,
    land_score: 15
},

environment_score: 50
}

Base the scores on the following dish: 
`;

const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;
const MODEL_NAME = "Qwen/Qwen2.5-72B-Instruct";

const ai_client = new HfInference(HUGGING_FACE_API_KEY);

export default function Analysis() {
    const [foodInput, setFoodInput] = useState("");
    const [image, setImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState<AIResponseData | null>(null);
    const [loading, setLoading] = useState(false);


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
            let ai_res = "";

            const stream = ai_client.chatCompletionStream({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [
                    {
                        role: "user",
                        content: prompt + foodInput
                    }
                ],
                max_tokens: 500
            });

            for await (const chunk of stream) {
                if (chunk.choices && chunk.choices.length > 0) {
                    const newContent = chunk.choices[0].delta.content;
                    ai_res += newContent;
                }  
            }

            let relevantData = JSON.parse(ai_res)
            setAnalysisResult(relevantData);
        } catch (error) {
            console.error("Error analyzing text:", error);
            await handleTextSubmit();
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
        </section>

        {analysisResult !== null && <Statistics response={analysisResult} />}
        </>
    );
}
