pragma solidity ^0.4.21;
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AirDropFactory is Ownable{
    event NewContent(uint id,bytes32 name);
    event ModifiedContent(uint id, bytes32 name);
    struct AirDropContent {
        bytes32 name;
        address contractAddress;
        bytes32 symbol;
        string imageUrl;
        string webSiteUrl;
        string descriptions;
        uint8 decimal;
        uint64 startDateTimestamp;
        uint64 expireDateTimestamp;
        uint64 totalSupply;
        bool enable;
    }
    AirDropContent[] public airDropContents;
    
    mapping (uint => address) airDropContentToOwner;
    mapping (address =>uint) ownerContentCount;
    
    function _createNewContent(
    bytes32 _name,
    address _contractAddress,
    bytes32 _symbol, 
    string _imageUrl,
    string _webSiteUrl,
    string _descriptions,
    uint8 _decimal, 
    uint64 _startDateTimestamp,
    uint64 _expireDateTimestamp,
    uint64 _totalSupply,bool _enable) internal{
	AirDropContent memory airDropContent = AirDropContent(_name, _contractAddress, _symbol, _imageUrl, _webSiteUrl,
        _descriptions, _decimal, _startDateTimestamp, _expireDateTimestamp, _totalSupply, _enable);
        uint id = airDropContents.push(airDropContent);
        airDropContentToOwner[id] = msg.sender;
        ownerContentCount[msg.sender]++;
        emit NewContent(id,_name);
    }
    /**
     * @dev contractAddress cannot be modified 
     */
    function _modifyContent(
    uint _id,
    bytes32 _name,
    bytes32 _symbol, 
    string _imageUrl,
    string _webSiteUrl,
    string _descriptions,
    uint8 _decimal, 
    uint64 _startDateTimestamp,
    uint64 _expireDateTimestamp,
    uint64 _totalSupply,bool _enable) internal{
        airDropContents[_id] = AirDropContent(_name, airDropContents[_id].contractAddress, _symbol, _imageUrl, _webSiteUrl,
        _descriptions, _decimal, _startDateTimestamp, _expireDateTimestamp, _totalSupply, _enable);
        emit ModifiedContent(_id,_name);
    }
    
    function _modifyContractAddress(uint _id,address _contractAddress) internal{
        airDropContents[_id].contractAddress = _contractAddress;
        emit ModifiedContent(_id, airDropContents[_id].name);
    }

    function getExpireContentsIndexes() public view returns(uint[] indexes){
        uint[] memory expireIndexes;
        uint counter =0;
        for(uint i = 0;i < airDropContents.length;i++){
            if(airDropContents[i].enable && now < airDropContents[i].expireDateTimestamp){
                expireIndexes[counter] = i;
                counter++;
            }
        }
        return expireIndexes;
    }
    
    function getOwnContentsIndexes() public view returns(uint[] indexes){
        uint[] memory ownIndexes;
        uint counter =0;
        for(uint i = 0;i < airDropContents.length;i++){
            if(airDropContentToOwner[i] == msg.sender){
                ownIndexes[counter] = i;
                counter++;
            }
        }
        return ownIndexes;
    }
}
