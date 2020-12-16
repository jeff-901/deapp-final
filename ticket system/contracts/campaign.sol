pragma solidity  >=0.7.0;
<<<<<<< HEAD
// using SafeMath for uint256
=======

using SafeMath for uint256
>>>>>>> abd9670b2b51e6eecef4c9df608de8e4746d7ae6

contract Campaign {
  address public owner;
  uint public seats;
  string public campaign_name;
  uint public price;
  uint public campaign_start_time;
  uint public campaign_end_time;
  uint public start_sell_time;
  string public abstraction;
  address[] seat_owner;
  uint256 public remain;
  constructor(string memory _campaign_name, uint _seats, uint _price, uint _campaign_start_time, 
  uint _campaign_end_time, uint _start_sell_time, string memory _abstraction) public {
    owner = msg.sender;
    seats = _seats;
    campaign_name = _campaign_name;
    price = _price;
    campaign_start_time = _campaign_start_time;
    campaign_end_time = _campaign_end_time;
    start_sell_time = _start_sell_time;
    abstraction = _abstraction;
    seat_owner = new address[](_seats);
    remain = _seats;
  }

  modifier restricted() {
    require (msg.sender == owner);
    _;
  }

  function buy(address payable buyer, uint amount) public payable returns (uint[] memory seat_num){
      uint j=0;
      // uint k=0;
      seat_num = new uint[](amount);
      for (uint i=0; i<seats; i++){
        while(j<amount){
          address temp = seat_owner[uint(i)];
          if (temp==address(0x00000000000000000000000000000000) && remain >= amount){
              seat_owner[i]=buyer;
              buyer.transfer(price);
              remain--;
              seat_num[j]=i;
              j++;
          }
        }
      }
  }

  function withdraw() public restricted {
      if (block.timestamp > campaign_end_time) {
          msg.sender.call{value: address(this).balance}('');
      }
  }

  receive () external payable {}
}
