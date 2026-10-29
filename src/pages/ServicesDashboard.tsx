
import calenderIcon from "../assets/SVG/calender.svg"
import seperator from "../assets/SVG/Elementos_Separador.svg"
import advantagesIcon from "../assets/SVG/Elementos_Ilustracion 6.svg"
import orderIcon from "../assets/SVG/Elementos_Ilustracion 5.svg"
import eventsIcon from "../assets/SVG/Elementos_Ilustracion 8.svg"
import foxIcon from "../assets/SVG/Elementos_Fox 3.svg"
const ServicesDashboard = () => {
    return (
        <div className="servicesDashboard-container">
            <div>

                <div>
                    <div className='servicesDashboard-header'>Welcome to Rowley's</div>
                    <span className="servicesDashboard-subheader">To enjoy benefits - please login</span>
                </div>

                <div>
                    <div> <img src={seperator} height={10} style={{ width: '100%' }} alt="" /> </div>
                    <div>The world of Rowley's</div>
                    <div className="servicesDashboard-grid">
                        <div className="servicesDashboard-menu-item servicesDashboard-gray">
                            <img src={orderIcon} className='servicesDashboard-menu-item-image' alt="" />
                            <span>Order now</span>
                        </div>
                        <div className="servicesDashboard-menu-item servicesDashboard-gray">
                            <img src={advantagesIcon} className='servicesDashboard-menu-item-image' alt="" />
                            <span>Advantages</span>
                        </div>
                        <div className="servicesDashboard-menu-item servicesDashboard-gray">
                            <img src={calenderIcon} className='servicesDashboard-menu-item-image' alt="" />
                            <span>Event's & more</span>
                        </div>
                        <div className="servicesDashboard-menu-item servicesDashboard-gray">
                            <img src={eventsIcon} className='servicesDashboard-menu-item-image' alt="" />
                            <span>Rate Rowley's</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="servicesDashboard-about-btn">
                <div>
                    About Rowleys
                </div>
                <div>
                    <img src={foxIcon} style={{ maxHeight: '40px', maxWidth: '90px' }} alt="Image" />
                </div>
            </button>
        </div>
    );
};

export default ServicesDashboard;