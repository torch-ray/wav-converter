const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const uploader = document.getElementById('uploader');
const convertBtn = document.getElementById('convertBtn');
const status = document.getElementById('status');

convertBtn.onclick = async () => {
  const file = uploader.files[0];
  if (!file) return alert("파일을 선택하세요");

  status.innerText = "ffmpeg 로딩 중...";
  convertBtn.disabled = true;

  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    status.innerText = "변환 중...";
    const inputExt = file.name.split('.').pop();
    const inputName = `input.${inputExt}`;
    const outputName = `output.wav`;

    ffmpeg.FS('writeFile', inputName, await fetchFile(file));
    await ffmpeg.run('-i', inputName, outputName);
    const data = ffmpeg.FS('readFile', outputName);

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/wav' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.wav';
    a.click();

    status.innerText = "변환 완료!";
  } catch (err) {
    console.error(err);
    status.innerText = "에러 발생 😢 콘솔을 확인해주세요.";
  } finally {
    convertBtn.disabled = false;
  }
};
