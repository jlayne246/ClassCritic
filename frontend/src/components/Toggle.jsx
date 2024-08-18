import "./Toggle.css";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";

const Toggle = ({ handleChange, isChecked }) => {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
      />
      {/* {isChecked ? (<label htmlFor="check" style={{color: 'white'}}>Light Mode</label>) : (<label htmlFor="check">Dark Mode</label>)} */}
      {isChecked ? (
        <label htmlFor="check">
          <NightlightIcon aria-label="Nightlight" />
        </label>
      ) : (
        <label htmlFor="check">
          <WbSunnyIcon aria-label="Sun" />
        </label>
      )}
    </div>
  );
};

export default Toggle;
