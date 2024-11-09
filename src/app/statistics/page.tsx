'use client'

import { useEffect } from 'react';
import styles from "./page.module.css";
import Chart from 'chart.js/auto';

import { AIResponseData, NutrientsData } from "../types";


function get_pie_chart_data(data :NutrientsData) {
    let res_data = {
        labels: [
            'Carbohydrates',
            'Protein',
            'Minerals',
            'Dairy'
        ],

        datasets: [{
            label: 'Nutrients',
            data: [
                data.carbohydrates, 
                data.protein, 
                data.minerals,
                data.dairy
            ],

            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(126, 100, 55)'
            ],
        }]
    }

    return res_data;
}


export default function Statistics() {

    let example_obj :AIResponseData = {
        nutrients: {
            carbohydrates: 50,
            protein: 15,
            minerals: 10,
            dairy: 25
        },

        nutrient_score: 70,
        environment_score: 50
    };


    useEffect(() => {
        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const pie_chart_config = {
            type: 'pie',
            data: get_pie_chart_data(example_obj.nutrients)
        };

        const myChart = new Chart(ctx, pie_chart_config);

        // Cleanup function to destroy the chart instance
        return () => {
            myChart.destroy();
        };
    }, []);


    return (
        <section className={styles.main}>
            <h1 className={styles.heading}>Statistics</h1>
            <section className={styles.data}>
                <h2 className={styles.section_heading}>Nutrients</h2>
                <section className={styles.data_subsection}>
                    <div>
                        <canvas id="chart"></canvas>
                    </div>
                    <p>Carbohydrates: {example_obj.nutrients.carbohydrates}</p>
                    <p>Protein: {example_obj.nutrients.protein}</p>
                    <p>Minerals: {example_obj.nutrients.minerals}</p>
                    <p>Dairy: {example_obj.nutrients.dairy}</p>
                    <hr />
                    <p>Overall Health Sore: {example_obj.nutrient_score}</p>
                </section>
                <h2 className={styles.section_heading}>Environment</h2>
                <section className={styles.data_subsection}>
                    <p>Score: {example_obj.environment_score}</p>
                </section>
            </section>
        </section>
    );
}
