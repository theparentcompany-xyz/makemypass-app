import styles from "./Glance.module.css";
const Glance = () => {
    const progressData = [
        {
            type: "Student",
            color: "#47C97E",
            value: 202,
        },
        {
            type: "Startups",
            color: "#7662FC",
            value: 202,
        },
        {
            type: "Local Business/SME",
            color: "#C33D7B",
            value: 126,
        },
        {
            type: "NRE",
            color: "#FBD85B",
            value: 556,
        },
        {
            type: "Working Profesionals",
            color: "#5B75FB",
            value: 45,
        },
        {
            type: "Others",
            color: "#D2D4D7",
            value: 560,
        },
    ];

    return (
        <>
            <div className={styles.glanceContainer}>
                <p className={styles.glanceHeader}>At a Glance</p>

                <p className={styles.guests}>
                    20,002 <span>guests</span>
                </p>

                <div className={styles.progresBarGraph}>
                    {progressData.map((data) => (
                        <>
                            <div
                                key={data.type}
                                className={styles.progressBar}
                                style={{
                                    backgroundColor: data.color,
                                    width: `${data.value / 10}%`,
                                }}
                            ></div>
                        </>
                    ))}
                </div>

                <div className={styles.progressLabels}>
                    <ul>
                        {progressData.map((data) => (
                            <>
                                <li
                                    key={data.type}
                                    className={styles.progressLabel}
                                    style={{
                                        color: data.color,
                                    }}
                                >
                                    <p className={styles.dataCount}>
                                        • {data.value} {data.type}
                                    </p>
                                </li>
                            </>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Glance;
