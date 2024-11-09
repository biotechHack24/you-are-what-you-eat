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
        <section className={styles.main}>
            <h1 className={styles.heading}>Statistics</h1>
            <section className={styles.data}>
                <h2 className={styles.section_heading}>Nutrients</h2>
                <section className={styles.data_subsection}>
                    <p>Carbohydrates: {example_obj.nutrients.carbohydrates}</p>
                    <p>Protein: {example_obj.nutrients.protein}</p>
                    <p>Minerals: {example_obj.nutrients.minerals}</p>
                    <p>Dairy: {example_obj.nutrients.dairy}</p>
                    <hr />
                    <p>Overall Health Sore: {example_obj.health_score}</p>
                </section>
                <h2 className={styles.section_heading}>Environment</h2>
                <section className={styles.data_subsection}>
                    <p>Score: {example_obj.environmental_score}</p>
                </section>
            </section>
        </section>
    );
}
