//Variables for adding the retrieved values to the page
var ApplePrice = $("#AppleDollarVal");
var AppleVolume = $("#AppleVolume");
var AppleCrypto = $("#AppleCryptoVal");
var MicrosoftPrice = $("#MicrosoftDollarVal");
var MicrosoftVolume = $("#MicrosoftVolume");
var MicrosoftCrypto = $("#MicrosoftCryptoVal");
var AmazonPrice = $("#AmazonDollarVal");
var AmazonVolume = $("#AmazonVolume");
var AmazonCrypto = $("#AmazonCryptoVal");
var GooglePrice = $("#GoogleDollarVal");
var GoogleVolume = $("#GoogleVolume");
var GoogleCrypto = $("#GoogleCryptoVal");
var FacebookPrice = $("#FacebookDollarVal");
var FacebookVolume = $("#FacebookVolume");
var FacebookCrypto = $("#FacebookCryptoVal");

//Due to the limit of API call that we are allowed to make per minute
//We have created an array of API keys that are pulled from randomly
//This allows us to be able to keep the site functioning
//Arrays that hold the API Keys
var alphaAPI = ["8R49FW9VLKSNE9JK", "D7BDX98JEX4CMDGY", "7YQ6SGFLSAWG2PNY", "R1HO6T0SA0NNCUFX"]
var coinAPI = ["C0947395-C774-4C99-9908-9B82CB91E1F6", "9F1B5FB4-A270-44EA-97F3-969AB45E6F08", "3E618E22-0BFE-4AE3-96DD-CE807B909C95, DE8538D9-7264-4490-90FD-0ABB4E2B1908"]

//Function for looping through the API keys
function randomAlpha(alphaAPI){ 
    return alphaAPI[Math.floor(Math.random() * alphaAPI.length)];
};
    
function randomCoin(coinAPI){ 
    return coinAPI[Math.floor(Math.random() * coinAPI.length)];
};

//Call for Amazon info
function AmazonCall() {
    var querySymbol = "AMZN";
    var AVurl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + querySymbol + `&apikey= ${randomAlpha(alphaAPI)}`;
    $.ajax({
        url: AVurl,
        method: "GET"
    })
        .then(function (response) {
            var stockPrice = response["Global Quote"]["05. price"];
            var stockVolume = response["Global Quote"]["06. volume"];
            AmazonPrice.text("$" + stockPrice);
            AmazonVolume.text(stockVolume + " " + "Shares Today");

            $.ajax({
                url: "https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=9F1B5FB4-A270-44EA-97F3-969AB45E6F08",
                method: "GET"
            })
                .then(function (response) {
                    var convRate = response.rate;
                    var newPrice = stockPrice / convRate;
                    AmazonCrypto.text("₿" + newPrice);

                });
        })
}

AmazonCall();



//Variable that grabs the search button
var searchBtn = $("#searchBtn");
//Function that handles the onclick search button
$(searchBtn).on("click", function () {
    querySymbol = $(document.querySelector("#search")).val();
    var AVurl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + querySymbol + `&apikey= ${randomAlpha(alphaAPI)}`;
    $.ajax({
        url: AVurl,
        method: "GET"
    }).then(function (response) {

        // if the user searches for a ticker symbol, then the site will search for values.
        // else, the site will take the input, convert it into a symbol, and THEN search.


        if (response.bestMatches["0"]["1. symbol"] === querySymbol) {
            butt = 1;
            compName = response.bestMatches["0"]["2. name"];
            $.ajax({
                url: "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + querySymbol + `&apikey= ${randomAlpha(alphaAPI)}`,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                stockPrice = response["Global Quote"]["05. price"];
                searchVol = response["Global Quote"]["06. volume"];
                convRate = 8200;
                    cryptoConvert(stockPrice, convRate)
                // $.ajax({
                //     url: "https://rest.coinapi.io/v1/exchangerate/BTC/USD?" + `&apikey= ${randomCoin(coinAPI)}`,
                //     method: "GET"
                // }).then(function (response) {
                    
                // });
            });

        }
        else {
            butt = 2;
            compName = response.bestMatches["0"]["2. name"];
            stuff = response.bestMatches["0"]["1. symbol"];
            var AVurl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stuff + `&apikey= ${randomAlpha(alphaAPI)}`;
            $.ajax({
                url: AVurl,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                stockPrice = response["Global Quote"]["05. price"];
                searchVol = response["Global Quote"]["06. volume"];
                convRate = 8200;
                    cryptoConvert(stockPrice, convRate)
                // $.ajax({
                //     url: "https://rest.coinapi.io/v1/exchangerate/BTC/USD?" + `&apikey= ${randomCoin(coinAPI)}`,
                //     method: "GET"
                // }).then(function (response) {
                    
                // });
            });
        }
            });
});

//Function that adds the values to the page from the search
function prependous(name) {
    var newElement = $("<tr>");
    $("tbody").prepend(newElement);
    $(newElement).append($("<td>").text(name));

    // if the user input a ticker symbol, the function will append that to the table.
    // else, if the user input a name, the function will append that company's symbol
    // as found by the initial lookup.

    if (butt === 1) {
        $(newElement).append($("<td>").text(querySymbol));
    }
    else {
        $(newElement).append($("<td>").text(stuff));
    }
    $(newElement).append($("<td>").text("$" + stockPrice));
    $(newElement).append($("<td>").text(searchVol + " " + "Shares Today"));
    $(newElement).append($("<td>").text("₿" + newPrice));
}

//Funciton that converts the current price of the stock to Bitcoin
function cryptoConvert(q, r) {
    newPrice = q / r;
    console.log(newPrice);
    prependous(compName);
}
 
