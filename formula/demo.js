let attachedEvent = false;
let amount = 1000;

let buyRate = 0.988;
let spotRate = 1;
let sellRate = 740;

let beforeFee = 0;
let afterFee = 50;

let beforeFeeP = 1.25;
let afterFeeP = 0;

let binBuyFeeP = 0.28;
let binSellFeeP = 0.08;

let run = true;

let buyIsUsd = true;
let sellIsUSd = false;

let profit;
let netBuyRate;
let netSellRate;
let finalRate;
let valuesArr = [];
let inputNodes;


//for printing console log 
function p(r) {
    console.log(r);
}

function solveFormula(i) {
    let numReg = /[\d.]+/g;
    let symbReg = /[^.\w\s]/g;
    const numArr = i.match(numReg);
    const symbArr = i.match(symbReg);
    let result;

    if (numArr.length === 2 && symbArr.length === 1) {
      
        switch (symbArr[0]) {
            case "-":
                result = Number(numArr[0]) - Number(numArr[1]);
                break;
            case "+":
                result = Number(numArr[0]) + Number(numArr[1]);
                break;
            case "/":
                result = Number(numArr[0]) / Number(numArr[1]);
                break;
            case "*":
                result = Number(numArr[0]) * Number(numArr[1]);
                break;

        }
    }
    return result;
}

function setVariables(i) {

    switch (i) {
        case 0:
            amount = valuesArr[0];
            break;
        case 1:
            beforeFee = valuesArr[1];
            break;
        case 2:
            beforeFeeP = valuesArr[2];
            break;
        case 3:
            buyRate = valuesArr[3];
            break;
        case 4:
            binBuyFeeP = valuesArr[4];
            break;
        case 5:
            spotRate = valuesArr[5];
            break;
        case 6:
            sellRate = valuesArr[6];
            break;
        case 7:
            binSellFeeP = valuesArr[7];
            break;
        case 8:
            afterFee = valuesArr[8];
            break;
        case 9:
            afterFeeP = valuesArr[9];
            break;
    }



}


function runFormula() {
    if (attachedEvent === false) {


        valuesArr = [amount, beforeFee, beforeFeeP, buyRate, binBuyFeeP,
            spotRate, sellRate, binSellFeeP, afterFee, afterFeeP
        ]
        inputNodes = document.querySelectorAll("input");

        inputNodes.forEach(function (inputNode, i) {

            inputNode.addEventListener("input", function (e) {

                if (isNaN(e.target.value)) {
                    valuesArr[i] = solveFormula(e.target.value);
                    if (isNaN(valuesArr[i])) {
                        document.querySelector("#calc-result").textContent = "......."
                    } else {
                        document.querySelector("#calc-result").textContent = valuesArr[i].toFixed(10);
                    }

                    setTimeout(function () {
                        document.querySelector("#calc-result").textContent = ".......";
                    }, 10000);
                } else {
                    valuesArr[i] = Number(e.target.value);

                }
                setVariables(i);
                runFormula();

            });
            inputNode.value = valuesArr[i];

        });

    };

    attachedEvent = true;
    run = true;


    function percent(p, n) {
        //p-percentage, n- number

        return (p / 100) * n;
    }



    //array of results
    const results = [];
    const fees = [beforeFee];


    //mathematical sequence

    const zero = () => {
        //remove airtm/before fees percentage
        let fee = percent(beforeFeeP, amount);
        fees.push(fee);

        let usd = amount - (beforeFee + fee);
        let check = beforeFee + fee;

        results.push(usd);

    }

    const one = () => {
        let i = results.length - 1;
        let usd = results[i];

        let usdt = usd / buyRate;
        results.push(usdt);

    }

    const two = () => {
        let i = results.length - 1;
        let usdt = results[i];
        let fee = percent(binBuyFeeP, usdt);


        usdt -= fee;
        fees.push(fee);
        results.push(usdt);

    }

    const three = () => {
        let i = results.length - 1;
        let usdt = results[i];

        busd = usdt / spotRate;
        results.push(busd);
    }

    const four = () => {
        let i = results.length - 1;
        let busd = results[i];
        let fee = percent(binSellFeeP, busd);

        busd -= fee;
        fees.push(fee);
        results.push(busd);

    }

    const five = () => {
        let i = results.length - 1;
        let busd = results[i];

        let ngn = busd * sellRate;
        results.push(ngn);

    }

    const six = () => {
        // remove all after fees, percentage first, next second
        let i = results.length - 1;
        let ngn = results[i];

        let fee = percent(afterFeeP, ngn);
        fees.push(fee);
        fees.push(afterFee);

        ngn -= (afterFee + fee);
        results.push(ngn);

    }

    const last = () => {
        // produces results for display
        run = false;
        let totalUsd = amount;
        let totalNgn = results[results.length - 1];



        netBuyRate = totalUsd / results[3];
        netSellRate = totalNgn / results[3];


        finalRate = totalNgn / totalUsd;
        // if (Math.trunc(buyRate).toString < 3) {
        //     buyIsUsd = true;
        // } else {
        //     buyIsUsd = false;
        // }
        // if (Math.trunc(sellRate).toString.length < 3) {
        //     sellIsUSd = true;
        // } else {
        //     sellIsUSd = false;
        // }

        buyIsUsd = (Math.trunc(buyRate).toString().length < 3 === true);
        sellIsUSd = (Math.trunc(sellRate).toString().length < 3 === true);




        let usdNgn = (buyIsUsd === true && sellIsUSd === false) || (buyIsUsd === false && sellIsUSd === true);
        switch (usdNgn) {
            case true:
                profit = "Currency Mismatch!";
                break;
            case false:
                profit = totalNgn - totalUsd;
                profit = profit.toFixed(2) + "       ||    " + (((profit * 100) / amount).toFixed(1)) + "%";
                break;
        }

    }



    //array of functions
    const arrFunctions = [
        zero, one, two, three, four, five, six, last
    ]


    let x = 0;

    while (run === true) {
        arrFunctions[x]();
        x++;
    }



    const resultValueDisplay = [netBuyRate, netSellRate, finalRate, profit];
    const resultNodes = document.querySelectorAll(".result-item");
    const resultArr = [];

    resultNodes.forEach(function (nodes) {
        resultArr.push(nodes);
    });

    const resultElementDisplay = resultArr.map(function (div) {
        return div.children[1];
    });

    for (let i = 0; i < resultArr.length; i++) {
        resultElementDisplay[i].innerText = resultValueDisplay[i];
    }




}


runFormula();