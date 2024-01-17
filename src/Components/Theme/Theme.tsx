import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import style from "./Theme.module.css";

const Theme = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className={style.themeContainer}>
                <div className={style.grad1}></div>
                <div className={style.grad2}></div>
                <div className={style.grad3}></div>
                <Header />
                {children}
                <Footer />
            </div>
        </>
    );
};

export default Theme;
