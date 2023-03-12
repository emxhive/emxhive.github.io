





function runFormula() {

    let amount = 1000;

    let buyRate = 0.988;
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
        let fee = percent(binSellFeeP, usdt);

        usdt -= fee;
        fees.push(fee);
        results.push(usdt);

    }

    const four = () => {
        let i = results.length - 1;
        let usdt = results[i];

        let ngn = usdt * sellRate;
        results.push(ngn);

    }

    const five = () => {
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



        netBuyRate = totalUsd / results[2];
        netSellRate = totalNgn / results[2];


        finalRate = totalNgn / totalUsd;


        let usdNgn = buyIsUsd === true && sellIsUSd === false;

        switch (usdNgn) {
            case true:
                profit = "NOT SAME CURRENCY!. FIGURE IT OUT YOURSELF!!";
                break;
            case false:
                profit = totalUsd - totalNgn;
                break;
        }

    }



    //array of functions
    const arrFunctions = [
        zero, one, two, three, four, five, last
    ]





    let x = 0;

    while (run === true) {
        arrFunctions[x]();
        x++;
    }

    console.log(profit);
    console.log("Finalrate=> " + finalRate);
    console.log("netbuy => " + netBuyRate);
    console.log("netsell => " + netSellRate);


    const resultValueDisplay = [netBuyRate, netSellRate, finalRate, profit];
    const resultNodes = document.querySelectorAll(".result-item");
    const resultArr = [];

    resultNodes.forEach(function (nodes) {
        resultArr.push(nodes);
    });

    const resultElementDisplay = resultArr.map(function (div) {
        return div.children[1];
    });

    for (let i=0; i<resultArr.length; i++ ){
        resultElementDisplay[i].innerText= resultValueDisplay[i];
    }

    console.log(resultElementDisplay);

}

runFormula();