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
            if (countArr.length == 10)
                break;

            // 현재까지의 누적합이 지정조건 달성시 현재까지의 시행횟수를 배열에 담고 i 유지시켜 다시 반복
            if (nextSum <= probabilitySum) {
                countArr.push(wishCount + i);
                nextSum += 0.1;
                if (countArr.length == 9) {
                    nextSum = 0.99;
                }
                i -= 1;
                continue;
            }

            currentProbability *= ((wishCount + i) * (1 - successRate) / (i + 1));
            probabilitySum += currentProbability;
        }
        return countArr;
    }
}