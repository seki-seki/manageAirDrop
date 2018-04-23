App = {
    web3Provider: null,
    contracts: {},

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
        return App.initContract();
    },

    initContract: function () {
        $.getJSON('AirDropOwnership.json', function (data) {
            const AirDropOwnershipArtifact = data;
            App.contracts.AirDrop = TruffleContract(AirDropOwnershipArtifact);
            App.contracts.AirDrop.setProvider(App.web3Provider);
            return App.render();
        });
    },

    render: function (adopters, account) {
        let AirDropInstance;
        let airDropsRow = $('#airDropsRow');
        airDropsRow.empty()
        App.contracts.AirDrop.deployed().then(function (instance) {
            AirDropInstance = instance;
            //List Expire Contents
            AirDropInstance.getExpireContentsIndexes.call().then(function (indexes) {
                    indexes.forEach(function (i) {
                        AirDropInstance.airDropContents(i).then(function (airDropContent) {
                            //TODO: I want recieve airDropContent    as map instead of array to access using domain name
                            airDropsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toAscii(airDropContent[1])}</li>
                                        <li>Symbol: ${web3.toAscii(airDropContent[2])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
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
            ownContentsRow.empty()
            AirDropInstance.getOwnContentsIndexes.call().then(function (indexes) {
                    indexes.forEach(function (i) {
                        AirDropInstance.airDropContents(i).then(function (airDropContent) {
                            //TODO: I want recieve airDropContent    as map instead of array to access using domain name
                            ownContentsRow.append(
                                `<div class = "airDrop">
                                     <ul>
                                        <li>Name: ${web3.toAscii(airDropContent[1])}</li>
                                        <li>Symbol: ${web3.toAscii(airDropContent[2])}</li>
                                        <li>Adress: ${airDropContent[0]}</li>
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
        }).catch(function (err) {
            console.log(err.message);
        })
    },

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
