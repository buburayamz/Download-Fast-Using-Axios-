const axios = require('axios');
const fs = require('fs');
const progress = require('progress');

const url = 'https://rr1---sn-xmjxajvh-jb3s.googlevideo.com/videoplayback?expire=1706111321&ei=-dywZcnAFef9juMP7MukgAc&ip=13.212.32.72&id=o-AJSX1YRvAVJjRig_yNz96ftTkc1lH0VISbiBfKbDdxA7&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&spc=UWF9f4aVgxUfuMcmOR3SnlrRvsNLSc_GJkHMk4EprwRaw9U&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=bYg1xt2rc9m2pGC6cFOx7TMQ&gir=yes&clen=4254435&dur=240.561&lmt=1705824472897398&keepalive=yes&fexp=24007246&c=WEB&txp=5532434&n=f65SEcyVvWQHpA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgBe5k8UNOQH-SbKr1v8Nk9wsrvOS9DWYopboflwWHi-4CIQCK62OQCA2u36XO7KKfngKarnQ9UBMR849dsPqfyYUtVA%3D%3D&redirect_counter=1&rm=sn-npozd7z&req_id=76ab8fe26fdaa3ee&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=sy&mip=112.215.165.159&mm=31&mn=sn-xmjxajvh-jb3s&ms=au&mt=1706089510&mv=m&mvi=1&pl=24&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AAO5W4owRgIhALUAz8vmJf3HgaBFM1TqRD5FqFxoQWoTWs50O4KF4bqoAiEA_hQqSRCKUkkFAnSzycwzFmrmyVjtnItZowBg8EfjkX4%3D';
const outputFile = 'tes.mp3';

const downloadFile = async () => {
  const response = await axios({
    url,
    method: 'get',
    headers: {
      'range': 'bytes=0-',
    },
    responseType: 'stream',
  });

  const totalLength = response.headers['content-length'];
  const progressBar = new progress('[:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: parseInt(totalLength, 10),
  });

  response.data
    .on('data', (chunk) => {
      progressBar.tick(chunk.length);
    })
    .on('end', () => {
      console.log('Done');
    });

  response.data.pipe(fs.createWriteStream(outputFile));
};

downloadFile();
