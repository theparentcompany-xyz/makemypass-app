import Theme from "../../../../../components/Theme/Theme";
import Header from "../../../Overview/components/Header/Header";
import styles from "./CheckIn.module.css";
import { RiSearchLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { guests } from "./types";
import CheckInHeader from "../../components/CheckInHeader/CheckInHeader/CheckInHeader";

const CheckIn = () => {
    const [guests, setGuests] = useState<guests[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    useEffect(() => {
        setGuests([]);
    }, []);

    return (
        <Theme>
            <div className={styles.checkInContainer}>
                <Header />

                <CheckInHeader />

                <div className={styles.searchInput}>
                    <RiSearchLine color="#5F6063" />
                    <input
                        onChange={(event) => {
                            setSearchKeyword(event.target.value);
                        }}
                        placeholder="Search"
                        type="text"
                    />
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.table}>
                        {guests
                            .filter((data) => {
                                const { name, email } = data;
                                const keyword = searchKeyword.toLowerCase();
                                return (
                                    name.toLowerCase().includes(keyword) ||
                                    email.toLowerCase().includes(keyword)
                                );
                            })
                            .map((data, index) => {
                                return (
                                    <div key={index} className={styles.row}>
                                        <div className={styles.rowData}>
                                            <p className={styles.rowName}>
                                                {data.name}
                                            </p>
                                            <p className={styles.rowEmail}>
                                                {data.email}
                                            </p>
                                        </div>
                                        <div className={styles.rowData}>
                                            <p className={styles.rowType}>
                                                {data.category}
                                            </p>
                                            <p className={styles.rowDate}>
                                                {data.registered_at}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default CheckIn;
