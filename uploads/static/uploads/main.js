const uploadsList = document.querySelector("#uploadsList");
const spinnerBox = document.querySelector("#spinner-box");
const imagePreview = document.querySelector("#imagePreview");
const imageName = document.querySelector(".imageName");

const imageUploadForm = document.querySelector("#imageUploadForm");
const imageInput = document.querySelector("#id_image");
const sizeField = document.querySelector("#id_size");
const filter = document.querySelector("#id_action");
const cutoffInput = document.querySelector("#id_cutoff_val");

const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const url = window.location.href;
// sizeField.setAttribute("disabled", "true");

// Check if there is deleted item in localStorage
const deleted = localStorage.getItem("deleted");
if (deleted) {
  console.log("deleted ID", deleted);
  handleAlert("danger", `Đã xóa ảnh - id: ${deleted}`);
  localStorage.clear();
}

const renderUpload = (upload) => {
  const uploadFields = upload.fields;
  const imageUrl = uploadFields.image;
  const imageName = imageUrl.split("/").pop();
  const createdTime = getInternationalizedTime(uploadFields.created);
  const updatedTime = getInternationalizedTime(uploadFields.updated);
  return `
    <div id="upload-${upload.pk}" class="card mb-3">
      <h5 class="card-header">
        <a href="${url}upload/${upload.pk}" class="uploadLink">
          Hình ${upload.pk} - ${imageName}
        </a>
      </h5>
      <div class="row">
        <div class="col-md-6">
          <div class="d-flex align-items-center justify-content-center">
            <img src="media/${imageUrl}" alt="Upload Image" class="uploadImage">
          </div>
        </div>
        <div class="col-md-6">
          <div class="card-body">
            <div>
              <p class="card-text">
                <strong>Kích thước ảnh: </strong>
                ${getActionDisplay(uploadFields.size)}
              </p>
              <p class="card-text">
                <strong>Bộ lọc: </strong>
                ${getActionDisplay(uploadFields.action)}
              </p>
              <p class="card-text">
                <strong>Giá trị cắt - D0: </strong>
                ${uploadFields.cutoff_val}
              </p>
              <p class="card-text"><strong>Thời gian tạo:
                </strong>${createdTime}</p>
              <p class="card-text"><strong>Cập nhật lần cuối lúc:
                </strong>${updatedTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const clearUploadForm = () => {
  imagePreview.innerHTML = "";
  imageName.innerHTML = "";
  imageUploadForm.reset();
  sizeField.setAttribute("disabled", "true");
};

$.ajax({
  url: "/data/",
  type: "GET",
  dataType: "json",
  success: function (response) {
    const data = JSON.parse(response.data);
    console.log(data);
    data.forEach((upload) => {
      uploadsList.insertAdjacentHTML("beforeend", renderUpload(upload));
    });
    spinnerBox.classList.add("hidden");
    spinnerBox.innerHTML = createOverlaySpinner();
  },
  error: function (xhr, status, error) {
    console.log(error);
  },
});

// Add Event listeners
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    imageName.innerHTML = file.name;
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
    imageName.innerHTML = "";
    imagePreview.innerHTML = "";
  }
});

imageUploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  spinnerBox.classList.remove("hidden");
  // Remove disable attribute on size field, set back to true on clearUploadForm
  sizeField.removeAttribute("disabled");

  const formData = new FormData();
  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("image", imageInput.files[0]);
  formData.append("size", sizeField.value);
  formData.append("action", filter.value);
  formData.append("cutoff_val", cutoffInput.value);

  // Start measure execution time
  const startTime = performance.now();
  $.ajax({
    type: "POST",
    url: "",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // End time
      const endTime = performance.now();
      const executionTime = (endTime - startTime) / 1000;

      const data = JSON.parse(response.data);
      console.log(data);
      // Update upload list
      uploadsList.insertAdjacentHTML("afterbegin", renderUpload(data[0]));
      spinnerBox.classList.add("hidden");
      $("#imageUploadModal").modal("hide");
      handleAlert("success", "Ảnh đã tải lên thành công", executionTime);
      clearUploadForm();
    },
    error: function (xhr, status, error) {
      console.log(error);
      spinnerBox.classList.add("hidden");
      $("#imageUploadModal").modal("hide");
      handleAlert("danger", "Đã có lỗi xảy ra!");
      clearUploadForm();
    },
  });
});
