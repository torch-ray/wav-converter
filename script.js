const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const uploader = document.getElementById('uploader');
const convertBtn = document.getElementById('convertBtn');
const status = document.getElementById('status');

convertBtn.onclick = async () => {
  const file = uploader.files[0];
  if (!file) return alert("파일을 선택하세요");

  status.innerText = "로딩 중...";
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  const inputName = "input." + file.name.split('.').pop();
  const outputName = "output.wav";

  ffmpeg.FS("writeFile", inputName, await fetchFile(file));
  await ffmpeg.run("-i", inputName, outputName);
  const data = ffmpeg.FS("readFile", outputName);

  const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/wav" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "converted.wav";
  a.click();

  status.innerText = "변환 완료!";
};

