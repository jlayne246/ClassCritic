import "./Toggle.css";

const Toggle = ({ handleChange, isChecked }) => {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
      />
      {isChecked ? (<label htmlFor="check" style={{color: 'white'}}>Light Mode</label>) : (<label htmlFor="check">Dark Mode</label>)}
    </div>
  );
};

export default Toggle;
