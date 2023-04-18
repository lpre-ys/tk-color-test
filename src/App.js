import "./App.css";
import "normalize.css";
import LoadImage from "./LoadImage";
import { useRef, useState } from "react";
import Parameter from "./Parameter";
import Palette from "./Palette";

function App() {
  const [material, setMaterial] = useState(null);
  const [r, setR] = useState();
  const [g, setG] = useState();
  const [b, setB] = useState();
  const [s, setS] = useState();
  const [isPalette, setIsPalette] = useState(false);
  const canvasRef = useRef();

  return (
    <div className="App">
      <h1>RPGツクール2000 色調シミュレータ</h1>
      <h2>画像読み込み</h2>
      <LoadImage
        setMaterial={setMaterial}
        setR={setR}
        setG={setG}
        setB={setB}
        setS={setS}
      />
      {material && (
        <>
          <h2>プレビュー</h2>
          <canvas ref={canvasRef} width={100} height={100}></canvas>
          <h2>パラメータ</h2>
          <Parameter
            material={material}
            r={r}
            g={g}
            b={b}
            s={s}
            setR={setR}
            setG={setG}
            setB={setB}
            setS={setS}
            isPalette={isPalette}
            canvasRef={canvasRef}
          />
          <div className="paletteChoice">
            <h3>
              <label>
                HSVモード:&nbsp;
                <input
                  type="checkbox"
                  checked={isPalette}
                  onChange={({ target }) => {
                    setIsPalette(target.checked);
                  }}
                />
                &nbsp;
                {isPalette ? "ON" : "OFF"}
              </label>
            </h3>
          </div>
          {isPalette && (
            <Palette
              r={r}
              g={g}
              b={b}
              setR={setR}
              setG={setG}
              setB={setB}
            />
          )}
        </>
      )}
      <h2>nnkr</h2>
      <p>
        RPGツクール2000の「色調」のシミュレーションをするツールです。<br />
        ピクチャ、戦闘アニメの画像表示および、「画面の色調変更」イベントでの結果をシミュレーションします。<br />
        画像を読み込むと、UIが出ます。
      </p>
      <p>
        色調のアルゴリズム詳細は、下記記事にまとめてあります。<br />
        <a href="https://lpre-ys.fanbox.cc/posts/5738528">RPGツクール2000の、ちょっと不思議な「色調」の話</a>
      </p>
      <h2>HSVモード？</h2>
      <p>
        赤、緑、青の色の強さを、HSV方式で選択するツールです。<br />
        HSVで色を作った後、その色の赤、緑、青の値を、min maxの範囲内に割り当てます。<br />
        ツクール側の彩度が100%の時に、min=0, max=100にすると、元画像の白い部分が、おおよそベースカラーの色になります。<br />
        ただし、小数点の扱い等の理由により、近似値です。正確な色はプレビューで確認してください。
      </p>
      <h2>注意</h2>
      <h3>1. 結果について</h3>
      <p>
        個人の検証によるアルゴリズムにて、再現しています。
        <br />
        概ね正しい事は確認していますが、完全に再現出来ている保証はありません。
        <br />
        また、環境によって、表示が異なる可能性もあります。
        <br />
        正確な結果は、ツクール本体の画面上で確認してください。
      </p>
      <h3>2. 読み込む画像について</h3>
      <p>
        大きな画像を読み込んだ場合、ブラウザが負荷で死ぬ可能性があります。
        <br />
        ツクールで読み込む程度の画像にしておくことを推奨します。
        <br />
        コマアニメやUIのため、縦または横につなげた画像を使う場合も、できれば、結合前の画像でテストしたほうが無難です。
      </p>
      <h2>更新履歴</h2>
      <dl>
        <dt>2023.04.14</dt>
        <dd>β版公開</dd>
      </dl>
      <dl>
        <dt>2023.04.18</dt>
        <dd>
          FireFoxで一部スタイルが当たらない問題の修正<br />
          canvasで生成した画像をimgタグで表示していたが、無駄に重いので、canvasをそのまま表示するよう変更<br />
          以上2点を以て、正式版と言う事でβ表記を削除
        </dd>
      </dl>
    </div>
  );
}

export default App;
