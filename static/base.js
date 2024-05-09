const alertBox = document.querySelector("#alertBox");

const actionDisplayMap = {
  NO_FILTER: "Không lọc",
  IDEAL_LP: "Lọc thông thấp Ideal",
  GAUSSIAN_LP: "Lọc thông thấp Gaussian",
  BUTTERWORTH_LP: "Lọc thông thấp Butterworth",
  IDEAL_HP: "Lọc thông cao Ideal",
  GAUSSIAN_HP: "Lọc thông cao Gaussian",
  BUTTERWORTH_HP: "Lọc thông cao Butterworth",
};

const getActionDisplay = (action) => {
  return actionDisplayMap[action] || action;
};

const createOverlaySpinner = () => {
  return `
    <div class="loadingOverlay">
      <div class="spinner-border text-info" role="status"></div>
    </div>
  `;
};

const fetchExistingImage = (imageUrl, imageName, format, callback) => {
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Tạo một File từ Blob
      file = new File([blob], imageName, { type: `image/${format}` });
      // console.log(file);
      callback(file);
    })
    .catch((error) => console.log(error));
};

const getInternationalizedTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  // Create Intl.DateTimeFormat with locale "vi-VN"
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  // Return formatted date time
  return formatter.format(dateTime);
};

const handleAlert = (type, message, executionTime = null) => {
  const executionTimeReport = executionTime
    ? `<p>Thời gian thực thi: ${executionTime} giây</p>`
    : "";
  if (alertBox) {
    alertBox.innerHTML = `
      <div class="alert alert-${type}" role="alert">
        ${message} ${executionTimeReport}
      </div>
    `;
    // setTimeout(() => {
    //   alertBox.innerHTML = "";
    // }, 5000);
  } else {
    console.log("alertBox is undefined!");
  }
};
