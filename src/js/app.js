App = {
    web3Provider: null,
    contracts: {},
    userAccount: null,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }
        web3 = new Web3(App.web3Provider);
        App.userAccount = web3.eth.accounts[0];
        return App.initContract();
    },

    initContract: function () {
        $.getJSON('AirDropOwnership.json', function (data) {
            const airDropOwnershipArtifact = data;
            App.contracts.airDrop = TruffleContract(airDropOwnershipArtifact);
            App.contracts.airDrop.setProvider(App.web3Provider);
            return App.render();
        });
    },

    render: function (adopters, account) {
        let airDropInstance;
        let airDropsRow = $('#airDropsRow');
        airDropsRow.empty()
        App.contracts.airDrop.deployed().then(function (instance) {
            let airDropInstance = instance;
            //List Expire Contents
            airDropInstance.getEffectiveContentsIndexes.call().then(function (indexes) {
                    indexes.forEach(function (i) {
                        airDropInstance.airDropContents(i).then(function (airDropContent) {
                            //TODO: I want recieve airDropContent as map instead of array to access using domain name
                            airDropsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toUtf8(airDropContent[1])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
                                        <li>Symbol: ${web3.toUtf8(airDropContent[2])}</li>
                                        <li>Image: ${airDropContent[3]}</li>
                                        <li>WebSiteUrl: ${airDropContent[4]}</li>
                                        <li>Descriptions: ${airDropContent[5]}</li>
                                        <li>Decimal: ${airDropContent[6]}</li>
                                        <li>TotalSupply;: ${airDropContent[9]}</li>
                                        <li>StartDate: ${new Date(airDropContent[7] * 1000)}</li>
                                        <li>ExpireDate: ${new Date(airDropContent[8] * 1000)}</li>
                                    </ul>
                                </div>`)
                        })
                    })
                }
            );
            // List Own Contents
            let ownContentsRow = $('#ownContentsRow');
            ownContentsRow.empty();
            airDropInstance.getOwnContentsIndexes.call().then(function (indexes) {
                    indexes.forEach(function (i) {
                        airDropInstance.airDropContents(i).then(function (airDropContent) {
                            //TODO: I want recieve airDropContent as map instead of array to access using domain name
                            ownContentsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toUtf8(airDropContent[1])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
                                        <li>Symbol: ${web3.toUtf8(airDropContent[2])}</li>
                                        <li>Image: ${airDropContent[3]}</li>
                                        <li>WebSiteUrl: ${airDropContent[4]}</li>
                                        <li>Descriptions: ${airDropContent[5]}</li>
                                        <li>Decimal: ${airDropContent[6]}</li>
                                        <li>TotalSupply;: ${airDropContent[9]}</li>
                                        <li>StartDate: ${new Date(airDropContent[7] * 1000)}</li>
                                        <li>ExpireDate: ${new Date(airDropContent[8] * 1000)}</li>
                                    </ul>
                                    <a href="./modify-own-contents.html?index=${i}">modify</a>
                                </div>`)
                        })
                    })
                }
            );
            // Modify Own Contents
            let modifyOwnContentsRow = $('#modifyOwnContentsRow');
            index = getParameterByName("index");
            airDropInstance.airDropContents(index).then(function (airDropContent) {
                //TODO: I want recieve airDropContent as map instead of array to access using domain name
                let name = web3.toUtf8(airDropContent[1]);
                let address = airDropContent[0];
                let symbol = web3.toUtf8(airDropContent[2]);
                let image = airDropContent[3];
                let site = airDropContent[4];
                let description = airDropContent[5];
                let decimal = airDropContent[6];
                let totalSupply = airDropContent[9];
                let startDate = airDropContent[7];
                let expireDate = airDropContent[8];
                let enable = airDropContent[10];
                modifyOwnContentsRow.append(
                    `<div class = "airDrop">
                        <div id="modifyForm" class="row">
                            <form>
                                name : <input type="text" name="name" value="${name}"><br>
                                address : ${address}  <br>
                                symbol : <input type="text" name="symbol" value="${symbol}"><br>
                                image link : <input type="text" name="image" value="${image}"><br>
                                total supply : <input type="text" name="supply" value="${totalSupply}"><br>
                                decimal : <input type="text" name="decimal" value="${decimal}"><br>
                                <!-- TODO: Use Date Picker,and convert to Unix Time. Now Unix Time direct input. -->
                                start date : <input type="text" name="start" class="datepicker" value="${startDate}"><br>
                                expire date : <input type="text" name="expire" class="datepicker" value="${expireDate}"><br>
                                web site : <input type="text" name="site" value="${site}"><br>
                                description : <input type="text" name="description" value="${description}"><br>
                                enable : <input type="checkbox" name="enable" ${enable? "checked":""}><br>
                                <input type="button" name="submit" value="modify" class = "modify-btn">
                            </form>
                        <div id = "txStatus"/>
                        </div>
                    </div>`
                )
            });

            // Create New Content
            App.bindEvents();
        }).catch(function (err) {
            console.log(err.message);
        })
    },
    bindEvents: function () {
        $(document).on('click', '.create-btn', App.createNewContent);
        $(document).on('click', '.modify-btn', App.modifyContent);
    },
    createNewContent: function () {
        let name = web3.fromUtf8($("#createForm > form >input[name='name']")[0].value);
        let address = $("#createForm > form >input[name='address']")[0].value;
        let symbol = web3.fromUtf8($("#createForm > form >input[name='symbol']")[0].value);
        let image = $("#createForm > form >input[name='image']")[0].value;
        let supply = $("#createForm > form >input[name='supply']")[0].value;
        let decimal = $("#createForm > form >input[name='decimal']")[0].value;
        let start = $("#createForm > form >input[name='start']")[0].value;
        let expire = $("#createForm > form >input[name='expire']")[0].value;
        let site = $("#createForm > form >input[name='site']")[0].value;
        let description = $("#createForm > form >input[name='description']")[0].value;
        let enable = $("#createForm > form >input[name='enable']")[0].checked;
        //TODO: validate form input value here
        $("#txStatus").text("Create your own AirDrop content...");
        App.contracts.airDrop.deployed().then(function (instance) {
            let airDropInstance = instance;
            airDropInstance.createNewContent(address, name, symbol, image, site, description, decimal, start, expire, supply, enable, {
                from: App.userAccount,
                value: web3.toWei("1", "ether")
            })
                .then(function (receipt) {
                    $("#txStatus").text("Success");
                })
                .catch(function (error) {
                    $("#txStatus").text(error);
                });
        });
    },

    modifyContent: function () {
        let name = web3.fromUtf8($("#modifyForm > form >input[name='name']")[0].value);
        let symbol = web3.fromUtf8($("#modifyForm > form >input[name='symbol']")[0].value);
        let image = $("#modifyForm > form >input[name='image']")[0].value;
        let supply = $("#modifyForm > form >input[name='supply']")[0].value;
        let decimal = $("#modifyForm > form >input[name='decimal']")[0].value;
        let start = $("#modifyForm > form >input[name='start']")[0].value;
        let expire = $("#modifyForm > form >input[name='expire']")[0].value;
        let site = $("#modifyForm > form >input[name='site']")[0].value;
        let description = $("#modifyForm > form >input[name='description']")[0].value;
        let enable = $("#modifyForm > form >input[name='enable']")[0].checked;
        //TODO: validate form input value here
        $("#txStatus").text("modify your own AirDrop content...");
        App.contracts.airDrop.deployed().then(function (instance) {
            let airDropInstance = instance;
            airDropInstance.modifyContent(index, name, symbol, image, site, description, decimal, start, expire, supply, enable, {
                from: App.userAccount
            })
                .then(function (receipt) {
                    $("#txStatus").text("Success");
                })
                .catch(function (error) {
                    $("#txStatus").text(error);
                });
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}