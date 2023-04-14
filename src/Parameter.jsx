import { useEffect } from "react";
import RangeParam from "./RangeParam";

const FACTOR_R = 0.3;
const FACTOR_G = 0.6;
const FACTOR_B = 0.1;

export default function Parameter({
  setPreview,
  material,
  r,
  g,
  b,
  s,
  setR,
  setG,
  setB,
  setS,
  isPalette,
}) {
  useEffect(() => {
    loadImage(material).then((original) => {
      if (original) {
        const width = original.width;
        const height = original.height;

        // キャンバスへ画像のロード
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(original, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        // 各ピクセルのデータを取得
        const data = imageData.data;
        const grayData = [];

        // RGB565へ減らす
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] >> 3;
          data[i + 1] = data[i + 1] >> 2;
          data[i + 2] = data[i + 2] >> 3;
        }

        // グレースケールを作る
        for (let i = 0; i < data.length; i += 4) {
          grayData[i] = Math.floor(
            data[i] * FACTOR_R +
              (data[i + 1] * FACTOR_G) / 2 +
              data[i + 2] * FACTOR_B
          );
          grayData[i + 1] = grayData[i] * 2;
          grayData[i + 2] = grayData[i];
        }

        // 合成
        for (let i = 0; i < data.length; i += 4) {
          // 彩度
          data[i] = satulation(data[i], grayData[i], s, 31);
          data[i + 1] = satulation(data[i + 1], grayData[i + 1], s, 63);
          data[i + 2] = satulation(data[i + 2], grayData[i + 2], s, 31);
          // 色
          data[i] = add(data[i], r, 31);
          data[i + 1] = add(data[i + 1], g, 63);
          data[i + 2] = add(data[i + 2], b, 31);
        }

        // RGB565での表示と同じになるよう、色を変換する
        for (let i = 0; i < data.length; i += 4) {
          data[i] = normalize5Bit(data[i]);
          data[i + 1] = normalize6Bit(data[i + 1]);
          data[i + 2] = normalize5Bit(data[i + 2]);
        }

        ctx.putImageData(imageData, 0, 0);
        setPreview(canvas.toDataURL());
      }
    });
  }, [material, setPreview, r, g, b, s]);

  return (
    <div className="paramContainer">
      <RangeParam
        v={r}
        setV={setR}
        name="red"
        label="赤"
        isDisabled={isPalette}
      />
      <RangeParam
        v={g}
        setV={setG}
        name="green"
        label="緑"
        isDisabled={isPalette}
      />
      <RangeParam
        v={b}
        setV={setB}
        name="blue"
        label="青"
        isDisabled={isPalette}
      />
      <RangeParam v={s} setV={setS} name="sat" label="彩度" />

      <small>※単位は全て%です。</small>
      <small>※つまみをダブルクリックで、100にリセットできます。</small>
    </div>
  );
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function add(data, c, max) {
  if (c < 100) {
    data = Math.floor((data * c) / 100);
  } else if (c > 100) {
    data += Math.floor(((max - data) * (c - 100)) / 100);
  }
  if (data > max) {
    data = max;
  }
  return data;
}

function satulation(data, gray, s, max) {
  const diff = gray - data;
  if (s < 100) {
    data += Math.floor((diff * (100 - s)) / 100);
  } else if (s > 100) {
    data -= Math.floor((diff * (s - 100)) / 100);
  }
  if (data > max) {
    data = max;
  }
  return data;
}

function normalize5Bit(c) {
  return (c << 3) | (c >> 2);
}

function normalize6Bit(c) {
  return (c << 2) | (c >> 4);
}
