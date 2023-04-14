export default function RangeParam({
  v,
  setV,
  name,
  label,
  addFunc,
  max,
  sliderColor,
  isDisabled,
}) {
  if (!max) {
    max = 200;
  }
  const change = ({ currentTarget }) => {
    const { value } = currentTarget;
    if (value >= 0 && value <= max) {
      setV(value);
      if (addFunc) {
        addFunc(value);
      }
    }
  };

  return (
    <div className={["param", name].join(" ")}>
      <label htmlFor={name}>{label}:</label>
      <input
        type="number"
        className="number"
        id={name}
        value={v}
        onChange={change}
        disabled={isDisabled}
      />
      <input
        type="range"
        className={"range"}
        id={name + "range"}
        value={v}
        min="0"
        max={max}
        onChange={change}
        onDoubleClick={() => {
          setV(100);
        }}
        style={{ "--slider-color": sliderColor ? sliderColor : "" }}
        disabled={isDisabled}
      />
    </div>
  );
}
