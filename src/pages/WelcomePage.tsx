import '../styles/WelcomePage.css';
import { useNavigate } from 'react-router-dom';
// import rightIcon from "../assets/SVG/Elementos_Flecha 1.svg"
// import EventBox from '../components/EventBox';
import { FiBox } from "react-icons/fi";
import { useEffect } from 'react';
import ActiveOrderBox from '../components/ActiveOrderBox';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';
const WelcomePage = () => {
  const navigate = useNavigate();
  // const [events, setEvents] = useState([]);
  // const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  // const handleCategorySelection = async (category) => {
  //   try {
  //     localStorage.setItem('selectedCategory', category);
  //     navigate(`/products?category=${category}`)
  //   } catch (error) {
  //     console.error('Error saving category:', error);
  //   }
  // };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        dispatch(showLoader());
        // const resoponse = await fetch(`${baseUrl}/events/active`, {
        //   headers: {
        //     "Authorization": `Bearer ${localStorage.getItem('token')}`,
        //   }
        // });
        // const data = await resoponse.json();
        // setEvents(data.events);
      } catch (err) {
        dispatch(hideLoader());
        console.error(err)
      } finally {
        dispatch(hideLoader());
      }
    }
    fetchEvents()

  }, [])



  return (
    <div className="Welcome-container">
      <div className='welcome-page-logo' >
        <div className='welcome-img-container' ><img src="/images/rowleysLogo.png" alt="" /></div>
        <h1 className="welcomeText">Welcome to Rowley</h1>
      </div>

      <div className='welcome-subscription-card' onClick={()=>{navigate("/subscriptions")}} >
        <div className='welcome-subscription-card-text' >
            Subscription 
        </div>
        <div>
          <FiBox size={40} />
        </div>
      </div>  

      {/* {
          events.length > 0 ?
            <div style={{ height: '150px', width: '100%', overflow: 'hidden', borderRadius: '20px' }} >
              <EventBox events={events} />
            </div>
            :
      }

      <h1 className="welcomeText">Welcome to Rowley's</h1> */}

      {/* <div className="promoBanner">
        <div className='' style={{ margin: '10px' }} >
          <div className="promoText">Save money </div>
          <div className='promoText' >Become a Red Tail.</div>
        </div>
        <div > <img src={rightIcon} style={{ height: '40px', width: '50px' }} alt="" /></div>
      </div>

      <div className="menuContainer">
        <div
          className="menuItem"
          onClick={() => handleCategorySelection('Food')}
        >
          <img src="/images/food.png" alt="Food" className="menuImage" />
          <div className="menuText">Food</div>
        </div>

        <div
          className="menuItem"
          onClick={() => handleCategorySelection('Beverages')}
        >
          <img src="/images/beverages.png" alt="Beverages" className="menuImage" />
          <div className="menuText"  >Beverages</div>
        </div>
      </div>
      <div onClick={()=>(navigate(""))}  >Subscriptions</div>
      <div className="hotItem" onClick={() => handleCategorySelection('Now Hot')}>
        <div className='hotItem-container' >
          <div className='hotItem-text-container'  >
            <p className="hotTitle">Now Hot</p>
            <p className="hotDescription">The all-new Flanksteak</p>
          </div>
          <div className='hotItem-image-container' >
            <img src="/images/steaks.png" alt="Flanksteak" className="hotImage" />
          </div>
        </div>
      </div> */}
      <ActiveOrderBox />
    </div>

  );
};

export default WelcomePage;
