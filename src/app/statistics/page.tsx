'use client'

import { useEffect } from 'react';
import styles from "./page.module.css";
import Chart, { ChartConfiguration } from 'chart.js/auto';

import { AIResponseData, NutrientsData } from "../types";


function get_pie_chart_data(data: NutrientsData) {
    return {
        labels: ['Carbohydrates', 'Protein', 'Minerals', 'Dairy'],
        datasets: [{
            label: 'Nutrients',
            data: [
                data?.carbohydrates ?? 0, 
                data?.protein ?? 0, 
                data?.minerals ?? 0,
                data?.dairy ?? 0
            ],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(126, 100, 55)'
            ],
        }]
    };
}


const Statistics = (props: any) => {
    const response: AIResponseData | null = props.response;

    useEffect(() => {
        if (!response) return;

        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const pie_chart_config = {
            type: 'pie',
            data: get_pie_chart_data(response.nutrients || {}),
        };

        const myChart = new Chart(ctx, pie_chart_config as ChartConfiguration);

        return () => {
            myChart.destroy();
        };
    }, [response]);

    if (!response) return //<p>No data available for analysis.</p>;

    const { nutrients, environment, nutrient_score, environment_score } = response;

    return (
        <section className={styles.main}>
            <h1 className={styles.heading}>Statistics</h1>
            <section className={styles.data}>
                <div className={styles.data_section}>
                    <h2 className={styles.section_heading}>Nutrients</h2>
                    <canvas id="chart" className={styles.graphic}></canvas>
                    <p className={styles.score}>Overall Health Score: {nutrient_score ?? 0}</p>
                </div>

                <div className={styles.data_section}>
                    <h2 className={styles.section_heading}>Environment</h2>
                    <section className={styles.graphic}>
                        <div className={styles.progress}>
                            <label>CO2 Emission Score:</label>
                            <meter className={styles.progress_bar} 
                                value={environment?.co2_score ?? 0} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>

                        <div className={styles.progress}>
                            <label>Water Usage Score:</label>
                            <meter className={styles.progress_bar} 
                                value={environment?.water_score ?? 0} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>

                        <div className={styles.progress}>
                            <label>Land Usage Score:</label>
                            <meter className={styles.progress_bar} 
                                value={environment?.land_score ?? 0} 
                                max={100}
                                optimum={100}
                                low={50}>
                            </meter>
                        </div>
                    </section>
                    <p className={styles.score}>Overall Environment Score: {environment_score ?? 0}</p>
                </div>
            </section>
        </section>
    );
}

export default Statistics;