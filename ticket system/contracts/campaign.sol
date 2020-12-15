pragma solidity  >=0.7.0;
// using SafeMath for uint256

contract Campaign {
  address public owner;
  uint seats;
  string campaign_name;
  uint price;
  uint campaign_start_time;
  uint campaign_end_time;
  uint start_sell_time;
  string abstraction;
  address[] seat_owner;
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

  }

  modifier restricted() {
    require (msg.sender == owner);
    _;
  }

  function buy(address buyer) public payable returns (uint seat_num){
      for (uint i=0; i<seats; i++){
          address temp = seat_owner[uint(i)];
          if (temp==address(0x00000000000000000000000000000000) ){
              seat_owner[i]=buyer;
            //   buyer.transfer(price);
              return i;
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
