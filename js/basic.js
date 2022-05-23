const EventObj = {
    setEventListeners: function () {
        document.getElementById("calcButton").addEventListener("click", () => {
            document.getElementById("title").style.display = "none";
            document.getElementById("calcForm").classList.add("my-5");
            document.getElementById("loadingMessage").style.display = "block";
        });
    }
}

function initConfig() {
    EventObj.setEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    initConfig();
});