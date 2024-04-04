const uploadsList = document.querySelector("#uploadsList");
const spinnerBox = document.querySelector("#spinner-box");
const imagePreview = document.querySelector("#imagePreview");
const imageName = document.querySelector(".imageName");

const imageUploadForm = document.querySelector("#imageUploadForm");
const imageInput = document.querySelector("#id_image");
const filter = document.querySelector("#id_action");
const cutoffInput = document.querySelector("#id_cutoff_val");

const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
const url = window.location.href;

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
      <div class="card-body d-flex gap-2">
        <img src="media/${imageUrl}" alt="Upload Image" class="uploadImage" >
        <div>
          <p>
            <strong>Bộ lọc: </strong>
            ${getActionDisplay(uploadFields.action)}</p>
          <p>
            <strong>Giá trị cutoff - D0: </strong>
            ${uploadFields.cutoff_val}</p>
          <p><strong>Thời gian tạo: </strong>${createdTime}</p>
          <p><strong>Cập nhật lần cuối lúc: </strong>${updatedTime}</p>
        </div>
      </div>
    </div>
  `;
};

const clearUploadForm = () => {
  imagePreview.innerHTML = "";
  imageName.innerHTML = "";
  imageUploadForm.reset();
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
      const imageUrl = event.target.result;
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
  const formData = new FormData();
  formData.append("csrfmiddlewaretoken", csrftoken);
  formData.append("image", imageInput.files[0]);
  formData.append("action", filter.value);
  formData.append("cutoff_val", cutoffInput.value);

  $.ajax({
    type: "POST",
    url: "",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      const data = JSON.parse(response.data);
      // Update upload list
      uploadsList.insertAdjacentHTML("afterbegin", renderUpload(data[0]));
      spinnerBox.classList.add("hidden");
      $("#imageUploadModal").modal("hide");
      handleAlert("success", "Ảnh đã tải lên thành công");
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
