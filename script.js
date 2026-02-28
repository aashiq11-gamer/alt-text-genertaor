async function generateAlt() {
  const fileInput = document.getElementById("imageInput");
  const result = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please upload an image first");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  result.value = "Generating...";

  const response = await fetch("/generate-alt", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  result.value = data.alt;
}

function copyText() {
  const textarea = document.getElementById("result");
  textarea.select();
  document.execCommand("copy");
  alert("Copied!");
}
