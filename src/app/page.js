import styles from "./page.module.css";
import Analysis from "./analysis/page";
import Statistics from "./statistics/page";

export default function Home() {
  return (
      <div>
          <p>home page</p>
          <Analysis />
          <Statistics />
      </div>
  );
}
