import '../styles/CustomButton.css';
const Logo = ({size}) => {
  return (
    <div className="logoContainer" >
      <img
        src='/images/output.png'
        alt="Logo"
        className="logoImage"
        style={{ height: size, maxWidth: size,}}
      />
    </div>
  );
};


export default Logo ;
