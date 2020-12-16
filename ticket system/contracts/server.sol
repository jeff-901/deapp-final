pragma solidity >=0.7.0;
// using SafeMath for uint256;
// pragma solidity  >=0.7.0;
// using SafeMath for uint256

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
  


  function buy(address , uint ) public payable returns (uint[] memory seat_num){}

  function withdraw() public{  }
}

contract Server {
    struct server_campaign{
        address campaign;
        bool isvalid;
    }
    server_campaign[] public campaigns;
    uint ptr = 0;
    function addCampaign(address campaign_address) public {
        campaigns.push(server_campaign(campaign_address, true));
    }

    function getCampaigns() public returns (address[] memory){
        uint j = ptr;
        uint k = 0;
        address[] memory c = new address[](campaigns.length);
        for (uint i = ptr; i<campaigns.length; i++){
            // server_campaign memory tmp = campaigns[i];
            // Campaign campaign = Campaign(campaigns[i].campaign);
            if (campaigns[i].isvalid){
                if (Campaign(campaigns[i].campaign).campaign_end_time() >= block.timestamp){
                    campaigns[i].isvalid = false;
                    if (i==j+1){
                        j+=1;
                    }
                }else{
                    c[k] = (campaigns[i].campaign);
                    k++;
                }
            }
        }
        ptr = j;
        return c;
    }

    function buy_ticket(uint index, uint amount) public payable returns(uint[] memory seat_num){
        // campaigns[index];
        if (campaigns[index].isvalid){
            Campaign c = Campaign(campaigns[index].campaign);
            if (c.remain() >= amount){
                seat_num = c.buy(msg.sender, amount);
            }
        }
    }

    receive () external payable {}
}