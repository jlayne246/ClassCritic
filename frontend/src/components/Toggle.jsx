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
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};

export default Toggle;
