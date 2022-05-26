
const CalcObj = {
    exceptionCheck: function () {
        // 예외처리
        if (document.getElementById("successRate").value == ""
            || document.getElementById("tryCount").value == ""
            || document.getElementById("wishCount").value == "") {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "빈 칸에 숫자를 모두 입력해주세요.";
            return true;
        }
        if (isNaN(document.getElementById("successRate").value)
            || isNaN(document.getElementById("tryCount").value)
            || isNaN(document.getElementById("wishCount").value)) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "모든 입력은 숫자로만 적어주세요.";
            return true;
        }
        if (!(Number(document.getElementById("successRate").value) >= 0 && Number(document.getElementById("successRate").value) <= 100)
            || Number(document.getElementById("tryCount").value) % 1 != 0
            || Number(document.getElementById("tryCount").value) <= 0
            || Number(document.getElementById("wishCount").value) % 1 != 0
            || Number(document.getElementById("wishCount").value) <= 0
            || Number(document.getElementById("tryCount").value) < Number(document.getElementById("wishCount").value)) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "입력이 올바르지 않습니다.";
            return true;
        }
        if (Number(document.getElementById("tryCount").value) >= 12000) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "시행횟수가 너무 큽니다. 횟수를 조절해주세요.";
            return true;
        }
        document.querySelector(".alert").style.display = "none";
        return false;
    },

    calcProbability: function () {
        if (this.exceptionCheck())
            return;

        // 계산준비
        document.getElementById("title").style.display = "none";
        document.getElementById("calcForm").classList.add("my-5");
        document.getElementById("loadingMessage").style.display = "block";

        // 계산 중
        let tryCount = Number(document.getElementById("tryCount").value);
        let wishCount = Number(document.getElementById("wishCount").value);
        let successRate = Number(document.getElementById("successRate").value) / 100;

        // (1) 계산확률
        let calcResult = MathObj.binomialProbability(successRate, tryCount, wishCount);
        document.getElementById("calcResult").innerText = Math.ceil(calcResult * 100 * 100000) / 100000;

        // (2) 기대 성공횟수
        document.getElementById("expectSuccess").innerText = Math.ceil(tryCount * successRate * 1000) / 1000;

        // (3) 각 성공횟수별 기대확률
        if (wishCount > 5) {
            document.getElementById("key1").innerText = 1;
            document.getElementById("key2").innerText = Math.ceil(wishCount / 4);
            document.getElementById("key3").innerText = Math.ceil(wishCount / 2);
            document.getElementById("key4").innerText = wishCount;
            document.getElementById("key5").innerText = Math.ceil(wishCount * 1.5);
            if (Math.ceil(wishCount * 1.5) > tryCount)
                document.getElementById("key5").innerText = tryCount;
        } else {
            document.getElementById("key1").innerText = 1;
            document.getElementById("key2").innerText = 2;
            document.getElementById("key3").innerText = 3;
            document.getElementById("key4").innerText = 4;
            document.getElementById("key5").innerText = 5;
        }

        for (let i = 1; i <= 5; i++) {
            let temp = Math.ceil(MathObj.binomialProbability(successRate, tryCount, Number(document.getElementById("key" + String(i)).innerText)) * 100 * 10000) / 10000;
            document.getElementById("value" + String(i)).innerText = temp;
            document.getElementById("progressValue" + String(i)).ariaValueNow = temp;
            document.getElementById("progressValue" + String(i)).style.width = String(temp) + "%";
        }

        // (4) 기대 시행횟수
        document.getElementById("expectCount").innerText = Math.ceil(wishCount * (1 / successRate) * 1000) / 1000;

        // (5) 각 행운별 시행횟수
        let countArr = MathObj.negativeBinomialCount(successRate, wishCount);

        for (let i = 1; i <= 10; i++) {
            if (countArr.length >= i)
                document.getElementById("count" + String(i)).innerText = countArr[i - 1];
            else
                document.getElementById("count" + String(i)).innerText = "?";
        }

        // 계산 후
        document.getElementById("loadingMessage").style.display = "none";
        document.getElementById("calcMessage").style.display = "block";

        document.querySelectorAll(".success-rate").forEach(element => {
            element.innerText = document.getElementById("successRate").value;
        });
        document.querySelectorAll(".try-count").forEach(element => {
            element.innerText = document.getElementById("tryCount").value;
        });
        document.querySelectorAll(".wish-count").forEach(element => {
            element.innerText = document.getElementById("wishCount").value;
        });
    }
}

const EventObj = {
    setEventListeners: function () {
        document.getElementById("calcButton").addEventListener("click", () => {
            CalcObj.calcProbability();
        });

        document.getElementById("moreInfoButton").addEventListener("click", () => {
            document.getElementById("moreInfoButton").style.display = "none";
            document.getElementById("calcMore").style.display = "block";
        });
    }
}

function initConfig() {
    EventObj.setEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    initConfig();
});