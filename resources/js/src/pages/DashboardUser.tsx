import Banner from "../components/Banner";
import BottomBar from "../components/BottomBar";
import Header from "../components/Header";
import Schedule from "../components/Schedule";
import '../../src/assets/css/style.css'

const Dashboard = () => {
    return (
        <div className="scrollable-container overflow-x-hidden">
            <Header/>
            <Banner/>
            <Schedule/>
            <BottomBar/>
        </div>
    );
};

export default Dashboard;
