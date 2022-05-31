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
    // 확정 성공이 있을 경우(maxStack-1번 연속 실패시 maxStack번째에 성공)
    binomialProbabilityWithMaxStack: function (basicSuccessRate, tryCount, wishCount, maxStack = tryCount + 1, detailSuccessRate = 1) {
        // dp[i][j]는 현재 i번까지 도전했고 그 중 j번 성공했을 때 조건에 만족할 확률
        var dp = Array.from(Array(tryCount + 1), () => Array(tryCount + 1).fill(-1));

        const totalSuccessRate = basicSuccessRate * detailSuccessRate; // 기본확률 * 세부확률 = 목표확률

        for (let j = 0; j <= tryCount; j++)
            dp[tryCount][j] = (j >= wishCount) ? 1 : 0;

        for (let i = tryCount - 1; i >= 0; i--) {
            for (let j = 0; j <= i; j++) {
                if (i + maxStack <= tryCount) {
                    currentSuccessRate = totalSuccessRate;
                    sumOfCurrentSuccessRate = totalSuccessRate;
                    dp[i][j] = currentSuccessRate * dp[i + 1][j + 1];

                    for (let k = 2; k <= maxStack - 1; k++) {
                        currentSuccessRate *= (1 - totalSuccessRate);
                        sumOfCurrentSuccessRate += currentSuccessRate;
                        dp[i][j] += currentSuccessRate * dp[i + k][j + 1];
                    }
                    
                    dp[i][j] += ((1 - sumOfCurrentSuccessRate) * detailSuccessRate) * dp[i + maxStack][j + 1]
                        + ((1 - sumOfCurrentSuccessRate) * (1 - detailSuccessRate)) * dp[i + maxStack][j];
                }
                else
                    dp[i][j] = totalSuccessRate * dp[i + 1][j + 1] + (1 - totalSuccessRate) * dp[i + 1][j];
            }
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
    },
    negativeBinomialCountWithMaxStack: function (basicSuccessRate, wishCount, maxStack, detailSuccessRate = 1) {
        let nextSum = 0.1;
        let countArr = [];

        // dp[i][j]는 현재 j번까지 도전했고 그 중 i번 성공했을 때 조건에 만족할 확률
        var dp = Array.from(Array(wishCount + 1), () => []);

        const totalSuccessRate = basicSuccessRate * detailSuccessRate; // 기본확률 * 세부확률 = 목표확률

        for (let j = 0; j < wishCount; j++)
            dp[j].push(0);
        dp[wishCount].push(1);

        for (let j = 1; j < 10000000; j++) {
            if (countArr.length == 10)
                break;

            if (nextSum <= dp[0][j - 1]) {
                countArr.push(j - 1);
                nextSum += 0.1;
                if (countArr.length == 9) {
                    nextSum = 0.99;
                }
                j -= 1;
                continue;
            }


            for (let i = 0; i <= wishCount - 1; i++) {
                if (j < maxStack) {
                    dp[i].push(totalSuccessRate * dp[i + 1][j - 1] + (1 - totalSuccessRate) * dp[i][j - 1]);
                } else {
                    currentSuccessRate = totalSuccessRate;
                    sumOfCurrentSuccessRate = totalSuccessRate;
                    dp[i].push(currentSuccessRate * dp[i + 1][j - 1]);

                    for (let k = 2; k <= maxStack - 1; k++) {
                        currentSuccessRate *= (1 - totalSuccessRate);
                        sumOfCurrentSuccessRate += currentSuccessRate;
                        dp[i][j] += currentSuccessRate * dp[i + 1][j - k];
                    }
                    
                    dp[i][j] += ((1 - sumOfCurrentSuccessRate) * detailSuccessRate) * dp[i + 1][j - maxStack]
                        + ((1 - sumOfCurrentSuccessRate) * (1 - detailSuccessRate)) * dp[i][j - maxStack];
                }
            }

            dp[wishCount].push(1);
        }

        return countArr;
    }
}