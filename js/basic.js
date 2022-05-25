const MathObj = {
    factorial: function (n) {
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    },
    // successRate의 확률로 tryCount번 시행시 wishCount번 이상 성공할 확률
    binomialProbability: function (successRate, tryCount, wishCount) {
        // dp[i][j]는 현재 i번까지 도전했고 그 중 j번 성공했을 때 조건에 만족할 확률
        var dp = Array.from(Array(tryCount + 1), () => Array(tryCount + 1).fill(-1));

        for (let j = 0; j <= tryCount; j++)
            dp[tryCount][j] = (j >= wishCount) ? 1 : 0;

        for (let i = tryCount - 1; i >= 0; i--) {
            for (let j = 0; j <= i; j++)
                dp[i][j] = successRate * dp[i + 1][j + 1] + (1 - successRate) * dp[i + 1][j];
        }

        return dp[0][0];
    },
    // successRate의 확률로 wishCount번 이상 성공시 필요한 시도횟수의 배열 리턴
    negativeBinomialCount: function (successRate, wishCount) {
        let nextSum = 0.1;
        let countArr = [];
        let currentProbability = successRate ** wishCount;
        let probabilitySum = currentProbability; // 누적 확률
        for (let i = 0; i <= 10000000; i++) {
            if (countArr.length == 9) {
                countArr.push(countArr[countArr.length - 1] * 2);
                break;
            }

            // 현재까지의 누적합이 지정조건 달성시 현재까지의 시행횟수를 배열에 담고 i 유지시켜 다시 반복
            if (nextSum <= probabilitySum) {
                countArr.push(wishCount + i);
                nextSum += 0.1;
                i -= 1
                continue
            }

            currentProbability *= ((wishCount + i) * (1 - successRate) / (i + 1))
            probabilitySum += currentProbability;
        }
        return countArr;
    }
}

const EventObj = {
    exceptionCheck: function () {
        // 예외처리
        if (document.getElementById("successRate").value == ""
            || document.getElementById("tryCount").value == ""
            || document.getElementById("wishCount").value == "") {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "빈 칸에 숫자를 모두 입력해주세요."
            return true;
        }
        if (isNaN(document.getElementById("successRate").value)
            || isNaN(document.getElementById("tryCount").value)
            || isNaN(document.getElementById("wishCount").value)) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "모든 입력은 숫자로만 적어주세요."
            return true;
        }
        if (!(Number(document.getElementById("successRate").value) >= 0 && Number(document.getElementById("successRate").value) <= 100)
            || Number(document.getElementById("tryCount").value) % 1 != 0
            || Number(document.getElementById("tryCount").value) <= 0
            || Number(document.getElementById("wishCount").value) % 1 != 0
            || Number(document.getElementById("wishCount").value) <= 0
            || Number(document.getElementById("tryCount").value) < Number(document.getElementById("wishCount").value)) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "입력이 올바르지 않습니다."
            return true;
        }
        if (Number(document.getElementById("tryCount").value) >= 12000) {
            document.querySelector(".alert").style.display = "block";
            document.querySelector(".alert").innerText = "시행횟수가 너무 큽니다. 횟수를 조절해주세요."
            return true;
        }
        document.querySelector(".alert").style.display = "none";
        return false;
    },
    setEventListeners: function () {
        document.getElementById("calcButton").addEventListener("click", () => {
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