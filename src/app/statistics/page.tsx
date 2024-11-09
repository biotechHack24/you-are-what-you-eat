import styles from "./page.module.css";

export default function Statistics() {

    let example_obj = {
        nutrients: {
            carbohydrates: 50,
            protein: 15,
            minerals: 10,
            dairy: 25
        },

        environmental_score: 50,
        health_score: 70
    };

    return (
        <main className={styles.main}>
            <h1>Statistics</h1>
            <h2>Nutrients</h2>
            <p>Carbohydrates: {example_obj.nutrients.carbohydrates}</p>
            <p>Protein: {example_obj.nutrients.protein}</p>
            <p>Minerals: {example_obj.nutrients.minerals}</p>
            <p>Dairy: {example_obj.nutrients.dairy}</p>
            <hr />
            <p>Overall Health Sore: {example_obj.health_score}</p>
            <h2>Environment</h2>
            <p>Score: {example_obj.environmental_score}</p>
        </main>
    );
}
