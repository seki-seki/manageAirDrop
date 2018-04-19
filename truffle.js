module.exports = {
   networks: {
   development: {
   host: "localhost",
   port: 9545,
   network_id: "*", // Match any network id
   from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
   gas: 2000000,   // <--- Twice as much
   gasPrice: 10000000000
  }
 }
};
