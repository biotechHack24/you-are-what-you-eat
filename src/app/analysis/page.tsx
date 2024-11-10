'use client'

import { useState, useEffect } from 'react';

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionEvent {
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}
import styles from "./page.module.css";
import { AIResponseData } from "../types";
import Statistics from '../statistics/page';
import { HfInference } from "@huggingface/inference";

const prompt: string = 
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
const TEXT_MODEL = "Qwen/Qwen2.5-72B-Instruct";
const IMAGE_MODEL = "Salesforce/blip-image-captioning-large";

const ai_client = new HfInference(HUGGING_FACE_API_KEY);

export default function Analysis() {
    const [foodInput, setFoodInput] = useState("");
    const [analysisResult, setAnalysisResult] = useState<AIResponseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = "en-US";

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = Array.from(event.results as any)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setFoodInput(transcript);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            console.error("Speech recognition not supported by this browser.");
        }

        return () => {
            recognition?.stop();
        };
    }, []);

    const startListening = () => {
        if (recognition && !isListening) {
            recognition.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            setLoading(true);

            try {
                let food = await ai_client.imageToText({
                    model: IMAGE_MODEL,
                    data: file,
                });

                setFoodInput(food.generated_text);
            } catch (error) {
                console.error("Error analyzing image:", error);
                handleImageUpload(event);
            } finally {
                handleTextSubmit();
            }
        }
    };

    const handleTextSubmit = async () => {
        setLoading(true);

        try {
            let ai_res = "";

            const stream = ai_client.chatCompletionStream({
                model: TEXT_MODEL,
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

            let relevantData = JSON.parse(ai_res);
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
                    onClick={isListening ? stopListening : startListening} 
                    className={styles.micButton}
                >
                    {isListening ? "Stop" : "Dictate"}
                </button>

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

        {analysisResult && <Statistics response={analysisResult} />}
        </>
    );
}
