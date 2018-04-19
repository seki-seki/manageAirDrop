pragma solidity ^0.4.21;
import "./AirDropEntry.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract AirDropOwnership is AirDropEntry,ERC721{
  using SafeMath for uint256;
  mapping (uint => address) aireDropContentApprovals;

  function balanceOf(address _owner) public view returns (uint256 _balance) {
    return ownerContentCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    return airDropContentToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerContentCount[_to] = ownerContentCount[_to].add(1);
    ownerContentCount[msg.sender] = ownerContentCount[msg.sender].sub(1);
    airDropContentToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    aireDropContentApprovals[_tokenId] = _to;
    emit Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId) public {
    require(aireDropContentApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }
}
