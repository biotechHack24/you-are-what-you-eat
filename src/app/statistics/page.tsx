'use client'

import { useEffect } from 'react';
import styles from "./page.module.css";
import Chart, { ChartConfiguration } from 'chart.js/auto';

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


const Statistics = (props :any) => {
    let response = props.response;

    useEffect(() => {
        if (response === null) return;

        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const pie_chart_config = {
            type: 'pie',
            data: get_pie_chart_data(response.nutrients)
        };

        const myChart = new Chart(ctx, pie_chart_config as ChartConfiguration);

        // Cleanup function to destroy the chart instance
        return () => {
            myChart.destroy();
        };
    }, [response]);

    if (response == null) return;

    return (
        <section className={styles.main}>
            <h1 className={styles.heading}>Statistics</h1>
            <section className={styles.data}>

                <div className={styles.data_section}>
                    <h2 className={styles.section_heading}>Nutrients</h2>
                    <canvas id="chart" className={styles.graphic}></canvas>
                    <p className={styles.score}>Overall Health Sore: {response.nutrient_score}</p>
                </div>

                <div className={styles.data_section}>
                    <h2 className={styles.section_heading}>Environment</h2>
                    <section className={styles.graphic}>
                        <div className={styles.progress}>
                            <label>CO2 Emission Score:</label>
                            <meter className={styles.progress_bar} 
                                value={response.environment.co2_score} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>

                        <div className={styles.progress}>
                            <label>Water Usage Score:</label>
                            <meter className={styles.progress_bar} 
                                value={response.environment.water_score} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>

                        <div className={styles.progress}>
                            <label>Land Usage Score:</label>
                            <meter className={styles.progress_bar} 
                                value={response.environment.land_score} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>
                    </section>
                    <p className={styles.score}>Overall Environment Score: {response.environment_score}</p>
                </div>
            </section>
        </section>
    );
}

export default Statistics
