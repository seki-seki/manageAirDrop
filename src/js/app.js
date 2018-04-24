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
            airDropInstance.getExpireContentsIndexes.call().then(function (indexes) {
                    indexes.forEach(function (i) {
                        airDropInstance.airDropContents(i).then(function (airDropContent) {
                            //TODO: I want recieve airDropContent    as map instead of array to access using domain name
                            airDropsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toAscii(airDropContent[1])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
                                        <li>Symbol: ${web3.toAscii(airDropContent[2])}</li>
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
                            //TODO: I want recieve airDropContent    as map instead of array to access using domain name
                            ownContentsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toAscii(airDropContent[1])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
                                        <li>Symbol: ${web3.toAscii(airDropContent[2])}</li>
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
            // Create New Content
            App.bindEvents();
        }).catch(function (err) {
            console.log(err.message);
        })
    },
    bindEvents: function () {
        $(document).on('click', '.create-btn', App.createNewContent);
    },
    createNewContent: function () {
        let name = $("#createForm > form >input[name='name']")[0].value;
        let address = $("#createForm > form >input[name='address']")[0].value;
        let symbol = web3.fromAscii($("#createForm > form >input[name='symbol']")[0].value);
        let image = $("#createForm > form >input[name='image']")[0].value;
        let supply = $("#createForm > form >input[name='supply']")[0].value;
        let decimal = $("#createForm > form >input[name='decimal']")[0].value;
        let start = $("#createForm > form >input[name='start']")[0].value;
        let expire = $("#createForm > form >input[name='expire']")[0].value;
        let site = $("#createForm > form >input[name='site']")[0].value;
        let description = $("#createForm > form >input[name='description']")[0].value;
        let enable =  $("#createForm > form >input[name='enable']")[0].checked;
        //TODO: validate form input value here
        $("#txStatus").text("Create your own AirDrop content...");
        App.contracts.airDrop.deployed().then(function (instance) {
            let airDropInstance = instance;
            airDropInstance.createNewContent(address,name,symbol,image,site,description,decimal,start,expire,supply,enable,{from: App.userAccount,value: web3.toWei("1", "ether")})
                .then(function(receipt) {
                    $("#txStatus").text("Success");
                })
                .catch(function(error) {
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
