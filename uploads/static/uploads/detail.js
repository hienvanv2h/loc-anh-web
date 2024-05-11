const backBtn = document.querySelector("#backBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const downloadBtn = document.querySelector("#downloadBtn");

const uploadDetailBox = document.querySelector("#uploadDetail");
const spinnerBox = document.querySelector("#spinner-box");
const imagePreview = document.querySelector("#imagePreview");
const imageNameBox = document.querySelector(".imageName");

const modifyUploadModal = document.querySelector("#modifyUploadModal");
const imageInput = document.querySelector("#id_image");
const sizeField = document.querySelector("#id_size");
const filter = document.querySelector("#id_action");
const cutoffInput = document.querySelector("#id_cutoff_val");

const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

const url = window.location.href + "data/";
const modifyUrl = window.location.href + "modify/";
const deleteUrl = window.location.href + "delete/";

// Functions
const loadImageInput = () => {
  const image = imagePreview.querySelector("img");
  if (!image) {
    console.log("imagePreview không có thẻ <img>! Kiểm tra lại");
    return;
  }
  const imageUrl = image.getAttribute("src");
  const imageName = imageUrl.split("/").pop();
  const imageFormat = imageName.split(".").pop();

  fetchExistingImage(imageUrl, imageName, imageFormat, (file) => {
    const fileList = new DataTransfer();
    fileList.items.add(file);
    imageInput.files = fileList.files;
    // dispatch "change" event
    const event = new Event("change");
    imageInput.dispatchEvent(event);
  });
};

const renderUploadDetail = (data) => {
  // Update href of download button
  downloadBtn.setAttribute("href", data.image_url);

  // Render modify modal inputs
  imagePreview.innerHTML = `<img src="${data.image_url}" alt="Image Preview">`;
  loadImageInput(); // load image to modal's file input
  imageNameBox.innerHTML = data.image_name;
  sizeField.value = data.size;
  filter.value = data.action;
  cutoffInput.value = data.cutoff_val;

  const createdTime = getInternationalizedTime(data.created);
  const updatedTime = getInternationalizedTime(data.updated);
  return `
    <h4>
      ${data.image_name} 
      (<a href="${data.image_url}" target="_blank">Xem ảnh</a>)
    </h4>
    <hr />
    <div class="d-flex gap-4 justify-content-start">
      <div class="row">
        <div class="col-md-6 d-flex align-items-center justify-content-center">
          <img src="${data.image_url}" alt="Upload Image" class="uploadImage" />
        </div>
        <div class="col-md-6">        
          <div>
            <p><strong>Bộ lọc: </strong>${getActionDisplay(data.action)}</p>
            <p><strong>Giá trị cắt: </strong>${data.cutoff_val}</p>
            <p><strong>Thời gian tạo: </strong>${createdTime}</p>
            <p><strong>Cập nhật lần cuối lúc: </strong>${updatedTime}</p>
          </div>
        </div>
      </div>  
    </div>
  `;
};

$.ajax({
  type: "GET",
  url: url,
  success: function (response) {
    console.log(response);
    const data = response.data;
    uploadDetailBox.innerHTML = renderUploadDetail(data);
    spinnerBox.classList.add("hidden");
    spinnerBox.innerHTML = createOverlaySpinner();
  },
  error: function (xhr, status, error) {
    console.log(error);
  },
});

// Add Event listeners
backBtn.addEventListener("click", () => {
  history.back();
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    imageNameBox.innerHTML = file.name;
    // Render preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      const imageUrl = event.target.result;
      image.src = imageUrl;
      image.onload = function () {
        const width = this.width;
        const height = this.height;
        sizeField.value = `${width}x${height}`;
      };
      imagePreview.innerHTML = `<img src="${imageUrl}" alt="Image Preview">`;
    };
    reader.onerror = (err) => {
      console.log(err);
    };
    reader.readAsDataURL(file);
  } else {
    imageNameBox.innerHTML = "";
    imagePreview.innerHTML = "";
  }
});

modifyUploadModal.addEventListener("submit", (e) => {
  e.preventDefault();
  spinnerBox.classList.remove("hidden");
  // Check if user change image or not
  file = imageInput.files[0];
  if (!file) {
    console.log("Vui lòng chọn ảnh!!!");
  }
  const formData = new FormData();
  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("image", file);
  formData.append("size", sizeField.value);
  formData.append("action", filter.value);
  formData.append("cutoff_val", cutoffInput.value);

  // Start measure execution time
  const startTime = performance.now();
  $.ajax({
    type: "POST",
    url: modifyUrl,
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // End time
      const endTime = performance.now();
      const executionTime = (endTime - startTime) / 1000;

      const data = response.data;
      console.log(data);
      uploadDetailBox.innerHTML = renderUploadDetail(data);
      spinnerBox.classList.add("hidden");
      $("#modifyUploadModal").modal("hide");
      handleAlert("success", "Thay đổi ảnh thành công!", executionTime);
    },
    error: function (xhr, status, error) {
      console.log(error);
      spinnerBox.classList.add("hidden");
      $("#modifyUploadModal").modal("hide");
      handleAlert("danger", `Lỗi: ${error}`);
    },
  });
});

deleteBtn.addEventListener("click", () => {
  if (confirm("Bạn có chắc chắn muốn xóa ảnh?")) {
    $.ajax({
      type: "POST",
      url: deleteUrl,
      data: {
        csrfmiddlewaretoken: csrftoken,
      },
      success: function (response) {
        // Redirect
        window.location.href = window.location.origin;
        // Store deleted upload id to be use after redirect
        localStorage.setItem("deleted", response.deleted);
      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
  }
});
