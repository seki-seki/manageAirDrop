pragma solidity ^0.4.21;
import "./AirDropFactory.sol";

contract AirDropEntry is AirDropFactory{
    modifier onlyOwnerOrContentsOwner(uint _id){
        require(msg.sender == owner || msg.sender ==airDropContentToOwner[_id]);
        _;
    }
    modifier onlyOwnerOf(uint _id){
        require(msg.sender ==airDropContentToOwner[_id]);
        _;
    }
    uint entryFee = 1 ether;
    
    function setEntryFee(uint _fee) external onlyOwner{
        entryFee = _fee;
    }
    
    function createNewContent(
    address _contractAddress, 
    bytes32 _name,
    bytes32 _symbol, 
    string _imageUrl,
    string _webSiteUrl,
    string _descriptions,
    uint8 _decimal, 
    uint64 _startDateTimestamp,
    uint64 _expireDateTimestamp,
    uint64 _totalSupply,
    bool _enable) external payable {
        require(msg.value == entryFee);
        _createNewContent(_contractAddress, _name, _symbol, _imageUrl, _webSiteUrl,_descriptions, _decimal, _startDateTimestamp, _expireDateTimestamp, _totalSupply, _enable);
    }
    
    function createNewContentByOwner(
    address _contractAddress, 
    bytes32 _name,
    bytes32 _symbol, 
    string _imageUrl,
    string _webSiteUrl,
    string _descriptions,
    uint8 _decimal, 
    uint64 _startDateTimestamp,
    uint64 _expireDateTimestamp,
    uint64 _totalSupply,
    bool _enable) external onlyOwner {
        _createNewContent(_contractAddress, _name, _symbol, _imageUrl, _webSiteUrl,_descriptions, _decimal, _startDateTimestamp, _expireDateTimestamp, _totalSupply, _enable);
    }
    
    /**
     * @dev contractAddress cannot be modified 
     */
    function modifyContent(
    uint _id,
    bytes32 _name,
    bytes32 _symbol, 
    string _imageUrl,
    string _webSiteUrl,
    string _descriptions,
    uint8 _decimal, 
    uint64 _startDateTimestamp,
    uint64 _expireDateTimestamp,
    uint64 _totalSupply,bool _enable) external onlyOwnerOrContentsOwner(_id){
        _modifyContent(_id, _name, _symbol, _imageUrl, _webSiteUrl,_descriptions, _decimal, _startDateTimestamp, _expireDateTimestamp, _totalSupply, _enable);
    }
    function modifyContractAddress(uint _id,address _contractAddress) external onlyOwner{
        _modifyContractAddress(_id,_contractAddress);
    }
}
