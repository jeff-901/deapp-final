pragma solidity >=0.7.0;
import "./user.sol";
import "./campaign.sol";
// using SafeMath for uint256

contract Server {
    struct server_campaign{
        address payable campaign;
        bool isvalid;
    }
    struct Ticket{
        address  campaign_address;
        uint seat_num;
    }
    server_campaign[] public campaigns;
    uint ptr = 0;
    mapping (address => address) private users;

    function callServer(string memory i) public pure returns (string memory) {
        return(i);
    }
    function addCampaign(string memory _campaign_name, uint _seats, uint _price, uint _campaign_start_time, 
    uint _campaign_end_time, uint _start_sell_time, string memory _abstraction) public {
        if (users[msg.sender] != address(0x0)){
            address payable campaign_address = address(new Campaign(_campaign_name, _seats, _price, _campaign_start_time, 
            _campaign_end_time, _start_sell_time, _abstraction));
            campaigns.push(server_campaign(campaign_address, true));
            User user = User(users[msg.sender]);
            user.addCampaign(campaign_address);
        }
    }

    function addUser(string memory _name, string memory _pwd) public returns (address user_address) {
        if (users[msg.sender] == address(0x0)){
            user_address = address(new User(_name, _pwd));
            users[msg.sender] = user_address;
        }
    }

    //TODO
    // function getUserTickets() public view returns (Ticket[] memory list) {
    //     
    // }

    function getUserCampaigns() public view returns (Campaign[] memory list) {
        //TODO
    }

    function getCampaigns() public returns (address[] memory){
        uint j = ptr;
        uint k = 0;
        address[] memory c = new address[](campaigns.length);
        for (uint i = ptr; i<campaigns.length; i++){
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

    function buyTicket(uint index, uint amount) public payable returns(uint[] memory seat_num){
        if (users[msg.sender] != address(0x0)){
            User user = User(users[msg.sender]);
            if (campaigns[index].isvalid){
                Campaign c = Campaign(campaigns[index].campaign);
                if (c.remain() >= amount){
                    seat_num = c.buy(msg.sender, amount);
                }
            }
            for (uint i = 0; i < seat_num.length; i++){
                user.addTicket(campaigns[index].campaign, seat_num[i]);
            }
        }
    }

    receive () external payable {}
}
