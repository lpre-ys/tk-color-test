import chroma from "chroma-js";
import { useEffect, useState } from "react";
import RangeParam from "./RangeParam";

export default function Palette({ r, g, b, setR, setG, setB }) {
  const [baseR, setBaseR] = useState(0);
  const [baseG, setBaseG] = useState(0);
  const [baseB, setBaseB] = useState(0);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(0);
  const [v, setV] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(200);

  const updateRGB = (hue, sat, v, min, max) => {
    const [newR, newG, newB] = chroma.hsv([hue, sat / 100, v / 100]).rgb();
    if (baseR !== newR) {
      setBaseR(newR);
    }
    if (baseG !== newG) {
      setBaseG(newG);
    }
    if (baseB !== newB) {
      setBaseB(newB);
    }
    setR(valueToRate(min, max, newR));
    setG(valueToRate(min, max, newG));
    setB(valueToRate(min, max, newB));
  };

  const updateHSV = (r, g, b) => {
    const hsv = chroma.rgb([r, g, b]).hsv();
    const newHue = Math.round(hsv[0]);
    if (!Number.isNaN(newHue)) {
      setHue(newHue);
    }
    setSat(Math.round(hsv[1] * 100));
    setV(Math.round(hsv[2] * 100));
  };

  useEffect(() => {
    if (Number.isNaN(min) || Number.isNaN(max)) {
      return;
    }
    // 基礎値が変更になった場合、表示を更新する
    const newR = rateToValue(min, max, r);
    const newG = rateToValue(min, max, g);
    const newB = rateToValue(min, max, b);

    setBaseR(newR);
    setBaseG(newG);
    setBaseB(newB);

    updateHSV(newR, newG, newB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="palette">
      <div className="info">
        <div>
          ベースカラー:{" "}
          <div
            className="baseColorBox"
            style={{ backgroundColor: `rgb(${baseR}, ${baseG}, ${baseB})` }}
          >
            &nbsp;
          </div>
        </div>
        <label>
          min:{" "}
          <input
            type="number"
            className="number"
            value={min}
            onChange={({ currentTarget }) => {
              const value = parseInt(currentTarget.value);
              if (value >= 0 && value <= 200) {
                setMin(value);
                updateRGB(hue, sat, v, value, max);
              }
            }}
          />
        </label>
        <label>
          max:{" "}
          <input
            type="number"
            className="number"
            value={max}
            onChange={({ currentTarget }) => {
              const value = currentTarget.value;
              if (value >= 0 && value <= 200) {
                setMax(value);
                updateRGB(hue, sat, v, min, value);
              }
            }}
          />
        </label>
      </div>
      <RangeParam
        v={hue}
        setV={setHue}
        name="hue"
        label="色相(度)"
        addFunc={(value) => {
          updateRGB(value, sat, v, min, max);
        }}
        max={359}
        sliderColor={chroma.hsv([hue, 1, 0.8]).hex()}
      />
      <RangeParam
        v={sat}
        setV={setSat}
        name="pSat"
        label="彩度(%)"
        addFunc={(value) => {
          updateRGB(hue, value, v, min, max);
        }}
        max={100}
      />
      <RangeParam
        v={v}
        setV={setV}
        name="value"
        label="明度(%)"
        addFunc={(value) => {
          updateRGB(hue, sat, value, min, max);
        }}
        max={100}
      />
    </div>
  );
}

function rateToValue(min, max, rate) {
  const range = max - min;
  rate = parseInt(rate);
  // valueのrange調整
  if (rate < min) {
    rate = min;
  }
  if (rate > max) {
    rate = max;
  }
  rate -= min;
  return Math.floor((rate / range) * 255);
}

function valueToRate(min, max, value) {
  const range = max - min;
  value = parseInt(value);
  return Math.round((value / 255) * range) + min;
}
