import styles from './ViewGuest.module.css';

const ViewGuest = () => {
  return (
    <div className={styles.viewGuestsContainer}>
      <div className={styles.viewGuests}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.tsTexts}>
              <p className={styles.name}>Drijusha TK</p>
              <p className={styles.emailAddress}>kmwcs007drijusha@gmail.com</p>
            </div>
            <div className={styles.type}>Students</div>
          </div>
          <div className={styles.tsRow2}>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Registered</p>
              <p className={styles.fieldData}>14 Aug, 20:59F</p>
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>Checked In</p>
              <p className={styles.fieldData}>14 Aug, 20:59F</p>
            </div>
          </div>
        </div>
        <hr className={styles.line} />
        <div className={styles.bottomSection}>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Phone Number</p>
            <p className={styles.fieldData}>+91 1234567890</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Organization</p>
            <p className={styles.fieldData}>Mar Baselios College of Engineering, Kerala, India</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Profession</p>
            <p className={styles.fieldData}>Student</p>
          </div>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>What do you expect from in50</p>
            <p className={styles.fieldData}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus reiciendis excepturi,
              nobis ipsum iusto amet magnam, quam expedita commodi perferendis hic aperiam dolores
              beatae animi odit, facere ipsa ea. Ad inventore delectus modi. Vitae, alias impedit?
              Consequatur aliquam culpa maiores dolores. Dicta recusandae soluta iure non nostrum
              esse culpa similique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGuest;
