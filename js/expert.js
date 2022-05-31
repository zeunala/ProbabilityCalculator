
const CalcObj = {
    exceptionCheck: function () {
        // 예외처리
        if (document.getElementById("successRate").value == ""
            || document.getElementById("tryCount").value == ""
            || document.getElementById("wishCount").value == ""
            || (document.getElementById("priceOption").checked && document.getElementById("price").value == "")
            || (document.getElementById("detailOption").checked && document.getElementById("detailSuccessRate").value == "")
            || (document.getElementById("maxStackOption").checked && document.getElementById("maxStack").value == "")) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "빈 칸에 숫자를 모두 입력해주세요.";
            return true;
        }
        if (isNaN(document.getElementById("successRate").value)
            || isNaN(document.getElementById("tryCount").value)
            || isNaN(document.getElementById("wishCount").value)
            || (document.getElementById("priceOption").checked && isNaN(document.getElementById("price").value))
            || (document.getElementById("detailOption").checked && isNaN(document.getElementById("detailSuccessRate").value))
            || (document.getElementById("maxStackOption").checked && isNaN(document.getElementById("maxStack").value))) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "모든 입력은 숫자로만 적어주세요.";
            return true;
        }
        if (!(Number(document.getElementById("successRate").value) >= 0 && Number(document.getElementById("successRate").value) <= 100)
            || Number(document.getElementById("tryCount").value) % 1 != 0
            || Number(document.getElementById("tryCount").value) <= 0
            || Number(document.getElementById("wishCount").value) % 1 != 0
            || Number(document.getElementById("wishCount").value) <= 0
            || Number(document.getElementById("tryCount").value) < Number(document.getElementById("wishCount").value)
            || (document.getElementById("detailOption").checked && !(Number(document.getElementById("detailSuccessRate").value) >= 0 && Number(document.getElementById("detailSuccessRate").value) <= 100))
            || (document.getElementById("maxStackOption").checked && (Number(document.getElementById("maxStack").value) % 1 != 0 || Number(document.getElementById("maxStack").value) <= 1))) {
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
        let detailSuccessRate = 1;
        if (document.getElementById("detailOption").checked)
            detailSuccessRate = Number(document.getElementById("detailSuccessRate").value) / 100;
        let maxStack = tryCount + 1;
        if (document.getElementById("maxStackOption").checked)
            maxStack = Number(document.getElementById("maxStack").value);

        // (1) 계산확률
        let calcResult;
        if (document.getElementById("maxStackOption").checked)
            calcResult = MathObj.binomialProbabilityWithMaxStack(successRate, tryCount, wishCount, maxStack, detailSuccessRate);
        else
            calcResult = MathObj.binomialProbability(successRate * detailSuccessRate, tryCount, wishCount);
        document.getElementById("calcResult").innerText = Math.ceil(calcResult * 100 * 100000) / 100000;

        // (2) 기대 성공횟수
        if (document.getElementById("maxStackOption").checked)
        document.getElementById("expectSuccess").innerText = Math.ceil(
            (Math.max(parseInt(tryCount / maxStack) * maxStack, 0) * detailSuccessRate * successRate / (1 - (1 - successRate) ** maxStack)
                + Math.min(tryCount, maxStack) * detailSuccessRate * successRate)
            * 1000) / 1000;
        else
            document.getElementById("expectSuccess").innerText = Math.ceil(tryCount * detailSuccessRate * successRate * 1000) / 1000;

        
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
            let temp;
            if (document.getElementById("maxStackOption").checked)
                temp = MathObj.binomialProbabilityWithMaxStack(successRate, tryCount, Number(document.getElementById("key" + String(i)).innerText), maxStack, detailSuccessRate);
            else
                temp = MathObj.binomialProbability(successRate * detailSuccessRate, tryCount, Number(document.getElementById("key" + String(i)).innerText));
            temp = Math.ceil(temp * 100 * 10000) / 10000;

            document.getElementById("value" + String(i)).innerText = temp;
            document.getElementById("progressValue" + String(i)).ariaValueNow = temp;
            document.getElementById("progressValue" + String(i)).style.width = String(temp) + "%";
        }

        // (4) 기대 시행횟수
        if (document.getElementById("maxStackOption").checked)
            document.getElementById("expectCount").innerText = Math.ceil(wishCount * ((1 - (1 - successRate) ** maxStack) / successRate) * (1 / detailSuccessRate) * 1000) / 1000;
        else
            document.getElementById("expectCount").innerText = Math.ceil(wishCount * (1 / (successRate * detailSuccessRate)) * 1000) / 1000;

        // (5) 각 행운별 시행횟수
        let countArr;
        if (document.getElementById("maxStackOption").checked)
            countArr = MathObj.negativeBinomialCountWithMaxStack(successRate, wishCount, maxStack, detailSuccessRate);
        else
            countArr = MathObj.negativeBinomialCount(successRate * detailSuccessRate, wishCount);
            
        for (let i = 1; i <= 10; i++) {
            if (countArr.length >= i) {
                document.getElementById("count" + String(i)).innerText = countArr[i - 1] + "회";
                if (document.getElementById("priceOption").checked) {
                    document.getElementById("count" + String(i)).innerText += (" (" + countArr[i - 1] * Number(document.getElementById("price").value) + "ⓒ)")
                }
            }
            else
                document.getElementById("count" + String(i)).innerText = "?";
        }

        // 계산 후
        document.getElementById("loadingMessage").style.display = "none";
        document.getElementById("calcMessage").style.display = "block";

        document.querySelectorAll(".success-rate").forEach(element => {
            if (document.getElementById("detailOption").checked)
                element.innerText = document.querySelector(".total-success-rate").innerText;
            else
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

        document.getElementById("priceOption").addEventListener("click", (e) => {
            if (e.target.checked) {
                document.getElementById("priceInfo").style.display = "flex";
            } else {
                document.getElementById("priceInfo").style.display = "none";
            }
        });

        document.getElementById("detailOption").addEventListener("click", (e) => {
            if (e.target.checked) {
                document.getElementById("detailInfo").style.display = "flex";
            } else {
                document.getElementById("detailInfo").style.display = "none";
            }
        });

        document.getElementById("maxStackOption").addEventListener("click", (e) => {
            if (e.target.checked) {
                document.getElementById("maxStackInfo").style.display = "flex";
            } else {
                document.getElementById("maxStackInfo").style.display = "none";
            }
        });

        document.getElementById("successRate").addEventListener("change", (e) => {
            if (!isNaN(e.target.value) && e.target.value != '') {
                document.querySelectorAll(".basic-success-rate").forEach(element => {
                    element.innerText = e.target.value;
                });

                if (!isNaN(document.getElementById("detailSuccessRate").value) && document.getElementById("detailSuccessRate").value != '') {
                    document.querySelector(".total-success-rate").innerText = Number(e.target.value) * Number(document.getElementById("detailSuccessRate").value) / 100;
                }
            }
        });

        document.getElementById("detailSuccessRate").addEventListener("change", (e) => {
            if (!isNaN(e.target.value)
                && e.target.value != ''
                && !isNaN(document.getElementById("successRate").value)
                && document.getElementById("successRate").value != '') {
                document.querySelector(".total-success-rate").innerText = Number(e.target.value) * Number(document.getElementById("successRate").value) / 100;
            }
        });
    }
}

function initConfig() {
    EventObj.setEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
    initConfig();
});