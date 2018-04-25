var AirDropOwnership = artifacts.require("AirDropOwnership");
contract('AirDropOwnership', function (accounts) {
    it("Create expired content",
        async function () {
            let instance = await AirDropOwnership.deployed();
            await instance.createNewContent(0xe09cb8f40ab26a5be11963c2641b2e13aa1a6a9dca4c4b4449922177e169fadf, "seki", "あ", "http://example.com", "http://example.com", "test", 18, 1524223327, 1625123327, 100, false,
                {
                    from: accounts[0],
                    value: web3.toWei("1", "ether"),
                    gas: 3000000

                });
            await instance.createNewContent(0xe09cb8f40ab26a5be11963c2641b2e13aa1a6a9dca4c4b4449922177e169fadf, "seki", "あ", "http://example.com", "http://example.com", "test", 18, 1524223327, 0, 100, true,
                {
                    from: accounts[0],
                    value: web3.toWei("1", "ether"),
                    gas: 3000000

                });
            let indexes = await instance.getEffectiveContentsIndexes();
            assert.equal(indexes.length,0);
        })
    it("Create effective content",
        async function () {
            let instance = await AirDropOwnership.deployed();
            await instance.createNewContent(0xe09cb8f40ab26a5be11963c2641b2e13aa1a6a9dca4c4b4449922177e169fadf, "seki", "あ", "http://example.com", "http://example.com", "test", 18, 1524223327, 1625123327, 100, true,
                {
                    from: accounts[0],
                    value: web3.toWei("1", "ether"),
                    gas: 3000000

                });
            let indexes = await instance.getEffectiveContentsIndexes();
            assert.equal(indexes[0],2);
            assert.equal(indexes.length,1)
        })
});