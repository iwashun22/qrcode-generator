"use strict";

$(() => {

// :::: MOUSE MOVE EFFECT ::::
let delayCounter = 15; // ms
let wait = false;
document.addEventListener("mousemove", e => {
  // console.log(e.clientX, e.clientY);
  if(!wait) {
    const span = document.createElement("span");
    span.style.top = e.clientY + "px";
    span.style.left = e.clientX + "px";
    const bg = document.getElementById("background");
    
    bg.appendChild(span);
    
    setTimeout(() => {
      bg.removeChild(span);
    }, 800)

    wait = true;
    setTimeout(() => wait = false, delayCounter);
  }
})

$("#generate-btn").on("click", function(e) {
  const input = $("#url-input").val();
  if(!input) return;
  // console.log(encodeURIComponent(input))
  // convert to ASCII character code
  $("#result").empty();
  
  const encoded = encodeURIComponent(input);
  console.log(encoded);

  const qrcodeLink = "https://chart.apis.google.com/chart?cht=qr&chl=" + encoded + "&chs=186";
  const img = document.createElement("img");
  img.src = qrcodeLink;
  img.id = "qr-code";

  $("#result").append(img);
  createClipboardAndDownloadLink();
})

function createClipboardAndDownloadLink() {
  const qrcode = document.getElementById("qr-code");
  const images = {
    copy: createImage(35, "copy-solid.svg"),
    download: createImage(35, "download-solid.svg")
  }

  const copyButton = document.createElement("button");
  copyButton.appendChild(images.copy);
  createCopyQrcode(copyButton, qrcode);
  const copyDiv = wrapDivAndLabel(copyButton, "copy");

  const downloadButton = document.createElement("button");
  downloadButton.appendChild(images.download);
  createDownloadQrcode(downloadButton, qrcode);
  const downloadDiv = wrapDivAndLabel(downloadButton, "save");

  const div = document.createElement("div");
  div.classList.add("save-btn-area");
  div.append(copyDiv, downloadDiv);
  $("#result").append(div);
}

function wrapDivAndLabel(element, labelText) {
  const div = document.createElement("div");
  div.classList.add("button-container");
  const span = document.createElement("span");
  span.innerText = labelText;

  div.append(element, span);
  return div;
}

function createCopyQrcode(element, qrcode) {
  element.addEventListener("click", async (e) => {
    try {
      const data = await fetch(qrcode.src);
      console.log(data);
      const blob = await data.blob();
      console.log(blob);
      navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
    } catch (error) {
      console.log(error);
    }
  })
}

function createDownloadQrcode(element, qrcode) {
  element.addEventListener("click", async (e) => {
    try {
      const data = await fetch(qrcode.src);
      const blob =  await data.blob();

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;

      const fileName = Date.now().toString(16) + "-qrcode.png";
      a.download = fileName;

      a.click();
      URL.revokeObjectURL(href);
    } catch (error) {
      console.log(error);
    }
  })
}

function createImage(size, filename) {
  const img = new Image(size);
  img.src = "./img/" + filename;

  return img;
}

// function asciiEncode(original) {
//   let copiedAsciiEncodeURL = original;
//   let include = true;
//   while(include) {
//     const regex = /\/|\\|\(|\)|\!|\@|\#|\$|\%|\^|\&|\*|\-|\+|\=|\:|\;|\"|\'|\,|\.|\<|\>|\?|\{|\}|\[|\]|\_/;
//     const match = original.match(regex);
//     console.log(match);
//     if(!match) {
//       include = false;
//       break;
//     }

//     const charCode = match[0].charCodeAt(0).toString(16).toUpperCase();
//     console.log(charCode);
    
//     original = original.replaceAll(match[0], "");
//     copiedAsciiEncodeURL = copiedAsciiEncodeURL.replaceAll(match[0], `%${charCode}`);
//   }
//   console.log(copiedAsciiEncodeURL);

//   return copiedAsciiEncodeURL;
// }

})