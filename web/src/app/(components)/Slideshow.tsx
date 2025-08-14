import styles from "./Slideshow.module.css";

const Slideshow = () => {
  return (
    <div className={styles.heroSlideshow}>
      <div
        className={`${styles.slide} ${styles.active}`}
        style={{ backgroundImage: "url(/images/general/imperial.jpg)" }}
      >
        <div className={styles.slideContent}>
          <h1>Lovelace Research is an independent research-led innovation lab for personal and humane AI.</h1>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
