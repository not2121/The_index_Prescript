const button=document.getElementById("MyButton");
const englishMessage =document.getElementById("englishMessage");
const japaneseMessage =document.getElementById("japaneseMessage");
const sound=document.getElementById("clickSound");
const volumeControl = document.getElementById("volumeControl");
const volumeValue = document.getElementById("volumeValue");
const volumeStorageKey = "theIndex.clickSoundVolume";
let audioContext;
let volumeGain;

function updateVolume(volume) {
  const level = volume / 100;
  sound.muted = level === 0;

  if (volumeGain) {
    volumeGain.gain.setTargetAtTime(level, audioContext.currentTime, 0.01);
  } else {
    sound.volume = level;
  }

  volumeControl.value = String(volume);
  volumeControl.setAttribute("aria-valuetext", `${volume}%`);
  volumeValue.value = `${volume}%`;
}

function playClickSound() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      // file:// の直接プレビューでは、音声の読み込み制限を避けて従来の再生を使う。
      const isLocalFile = window.location?.protocol === "file:";

      if (AudioContextClass && !isLocalFile) {
        // 最初のクリックで音の経路を作る。iOSでは volume の代わりに GainNode で調整する。
        const context = new AudioContextClass();
        const gain = context.createGain();
        gain.gain.value = Number(volumeControl.value) / 100;
        const source = context.createMediaElementSource(sound);
        source.connect(gain);
        gain.connect(context.destination);
        audioContext = context;
        volumeGain = gain;

        // 音量調整を GainNode に任せ、二重に小さくならないようにする。
        sound.volume = 1;
        updateVolume(Number(volumeControl.value));
      }
    }

    if (audioContext && audioContext.state !== "running") {
      audioContext.resume().catch((error) => {
        console.warn("Audio could not resume:", error);
      });
    }
  } catch (error) {
    console.warn("Web Audio could not be initialized:", error);
  }

  sound.currentTime = 0;
  sound.play().catch((error) => {
    console.warn("Click sound could not be played:", error);
  });
}

let initialVolume = Number(volumeControl.value);

try {
  const storedVolume = localStorage.getItem(volumeStorageKey);
  const savedVolume = Number(storedVolume);

  if (
    storedVolume !== null &&
    storedVolume.trim() !== "" &&
    Number.isInteger(savedVolume) &&
    savedVolume >= 0 &&
    savedVolume <= 100
  ) {
    initialVolume = savedVolume;
  }
} catch {
  // 音量の保存が許可されていない環境でも、その場で調整できるようにする。
}

updateVolume(initialVolume);

volumeControl.addEventListener("input", () => {
  const volume = Number(volumeControl.value);
  updateVolume(volume);

  try {
    localStorage.setItem(volumeStorageKey, String(volume));
  } catch {
    // 保存できなくても、現在の音量は反映されている。
  }
});

const finalTexts = [
  {
    english: "Sleep for a total of 800 hours per day",
    japanese: "一日で合計800時間寝てください"
  },
  {
    english: "Stand on any three-way intersection at 3:38 tomorrow, look to the east, and wave seven times",
    japanese: "明日3時38分にどこでもいいから三叉路で東を見つめて手を7回振れ"
  },
  {
    english: "Extract the spinal cords of all 37-year-old people in this Nest",
    japanese: "L社の巣で37歳の人の脊椎を抜き取れ"
  },
    {
    english: "Only eat, or write, or pull the trigger with your right hand",
    japanese: "食べることも書くこともトリガーを引くことも右手でしなさい"
  },
  {
    english: "Pick up a knife and stab a familiar warm body",
    japanese: "ナイフを手に取り、親しい誰かの肉体を刺す"
  },
  {
    english: "Do not go home until you finish reading the value of e",
    japanese: "e値を終わるまでお家に帰らないでください"
  },
  {
    english: "drink a liter of milk, warm up before you go play",
    japanese: "牛乳を1リットル飲み、遊びに行く前にウォームアップしてください"
  },
  {
    english: "Kill Your Art",
    japanese: "あなたの絵を殺せ"
  },
  {
    english: "Pet the four-legged animal five times",
    japanese: "四足の獣を5回撫でる"
  },
  {
    english: "Cut off the ear of the first person who ever yelled at me at work",
    japanese: "職場で初めて自分を怒鳴った人の耳を切る"
  },{
    english: "Eat your own vocal cords—which you’ve blanched in boiling salt water for 14 seconds—as a side dish with dinner.",
    japanese: "沸騰した塩水で14秒間湯通しした自分の声帯を夕食の付け合わせとして食べろ"
  },{
    english: "Those whose eyes have met and those whose eyes have not 72minites Kill",
    japanese: "目を合わせた者。合わせなかった者。72分。殺害"
  },{
    english: "Shear 663 strands of hair and enclose them in an envelope, to be deposited at Ticket Gate 3",
    japanese: "髪の毛を663本切って封筒に入れ、3番改札口に入れろ。"
  },{
    english: "Drink 1 liter of juice every morning; there is no time limit.",
    japanese: "毎朝ジュースを1L飲め、期限は無制限"
  },{
    english: "Split the nocturnal lights of the Backstreets thrice before 6 months pass",
    japanese: "裏路地の夜道の光を三度裂け。期限は半年以内。"
  },{
    english: "Put three needles in Lily's birthday cake by noon tomorrow.",
    japanese: "明日の正午までに針3本をリリーの誕生日ケーキに入れろ"
  },
   {
    english: "Make risotto with sewage water and give it to Minji as a gift.",
    japanese: "下水道の水でリゾットを作ってミンジにプレゼントしろ"
  },
   {
    english: "Tell Lehman the numbers,move the unicorn doll to the park,and make sure Haein can see the white wall as green.",
    japanese: "リーマンに数字を伝えてユニコーンの人形を公園に移してヘインが白い壁を緑色に見れるようにしろ"
  },
   {
    english: "Cut off the limbs of the thumb still in the nest.Then impale them all and display them.",
    japanese: "巣に残っている親指の手足を切り取れ、そして全員串刺しにして飾っておけ"
  },
   {
    english: "Cutting off your own right ankle, grilling it until it’s medium-rare, and eating it P.S.: You don’t have to eat the bone",
    japanese: "自分の右足首を切刀り取ってミディアムレアに焼いて食べること、PS:骨は食べずともよろしい"
  },
];

const randomCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?";

let effectTimer;

function createEffectText(targetText, revealedCount) {
  return [...targetText]
    .map((character, index) => {
      if (character === " ") {
        return " ";
      }

      if (index < revealedCount) {
        return character;
      }

      const randomIndex =
        Math.floor(Math.random() * randomCharacters.length);

      return randomCharacters[randomIndex];
    })
    .join("");
}

button.addEventListener("click", () => {
  clearInterval(effectTimer);

  playClickSound();

  const textIndex =
    Math.floor(Math.random() * finalTexts.length);

  const selectedText = finalTexts[textIndex];
  const targetEnglish = selectedText.english;
const targetJapanese = selectedText.japanese;

const animationLength = Math.max(
  [...targetEnglish].length,
  [...targetJapanese].length
);

  let revealedCount = 0;

effectTimer = setInterval(() => {
  const englishEffect =
    createEffectText(targetEnglish, revealedCount);

  const japaneseEffect =
    createEffectText(targetJapanese, revealedCount);

englishMessage.textContent = englishEffect;
japaneseMessage.textContent = japaneseEffect;

  revealedCount++;

  if (revealedCount > animationLength) {
    clearInterval(effectTimer);

englishMessage.textContent = targetEnglish;
japaneseMessage.textContent = targetJapanese;
  }
}, 30);
});
