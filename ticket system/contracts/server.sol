pragma solidity >=0.7.0;

// using SafeMath for uint256

contract Campaign {
    address public owner;
    uint256 public levels;
    uint256[] public seats;
    string public campaign_name;
    uint256[] public price;
    uint256 public campaign_start_time;
    uint256 public campaign_end_time;
    uint256 public start_sell_time;
    string public abstraction;
    address[] seat_owner;
    uint256[] public remain;
    string public link; 

    constructor(
        string memory _link,
        // address user,
        string memory _campaign_name,
        uint256 _levels,
        uint256[] memory _seats,
        uint256[] memory _price,
        uint256 _campaign_start_time,
        uint256 _campaign_end_time,
        uint256 _start_sell_time,
        string memory _abstraction
    ) public {
        // owner = user;
        levels = _levels;
        uint256 total_seats = 0;
        for (uint256 i = 0; i < levels; i++) {
            seats.push(_seats[i]);
            price.push(_price[i]);
            total_seats += _seats[i];
            remain.push(_seats[i]);
        }
        link = _link;
        campaign_name = _campaign_name;
        campaign_start_time = _campaign_start_time;
        campaign_end_time = _campaign_end_time;
        start_sell_time = _start_sell_time;
        abstraction = _abstraction;
        seat_owner = new address[](total_seats);

    }

    modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    function setOwner(address user) public {
        owner = user;
    }

    function getSeats() public view returns(uint256[] memory) {
        return seats;
    } 

    function getPrice() public view returns(uint256[] memory) {
        return price;
    } 

    function getRemain() public view returns(uint256[] memory) {
        return remain;
    } 

    function buy(address user,uint256 amount, uint256 level)
        public
        payable
        returns (uint256[] memory seat_num)
    {
        uint256 j = 0;
        // uint k=0;
        seat_num = new uint256[](amount);
        for (uint256 i = 0; i < seats[level]; i++) {
            if (j < amount) {
                uint256 num = 0;
                for (int256 k = 0; k < int(level); k++ ){
                    num = num + seats[uint256(k)];
                }
                num += i;
                address temp = seat_owner[num];
                if (temp == address(0x00) && remain[level] >= amount) {
                    seat_owner[num] = user;
                    // address(this).call{value: price[level]}("");
                    // uint256 cost = (price[level]);
                    address(this).transfer(price[level]);
                    remain[level]--;
                    seat_num[j] = num;
                    j++;
                }
            }
        }
    }

    function withdraw(address payable user) public restricted {
        require ( block.timestamp > campaign_end_time, "the campaign haven't closed");
        // if (block.timestamp > campaign_end_time) {
            // msg.sender.call{value: address(this).balance}("");
        user.transfer(address(this).balance);
        // }
    }

    function refund(address payable user, uint256 level, uint256 seat_num) public {
        require ( block.timestamp < campaign_end_time, "the campaign is close");
        require ( seat_owner[seat_num] == user, "you aren't the owner");
        // if (block.timestamp < campaign_end_time) {
        //     if (seat_owner[seat_num]!=address(0x0)){
        seat_owner[seat_num]=address(0x0);
        user.transfer(price[level]);
            // }
        // }
    }

    receive() external payable {}
}

contract Server {
    struct server_campaign {
        address payable campaign;
        bool isvalid;
    }

    event OnAddUser(string message, address user_address);
    event OnGetCampaigns(address payable[] campaigns);
    event OnAddCampaign(string message);
    event OnBuyTicket(string message);

    server_campaign[] public campaigns;
    address public users_address;

    constructor() public{
        users_address = address(new Users());
    }

    function callServer(string memory i) public pure returns (string memory) {
        return (i);
    }

    function addCampaign(
        string memory _link,
        string memory _campaign_name,
        uint256 _levels,
        uint256[] memory _seats,
        uint256[] memory _price,
        uint256 _campaign_start_time,
        uint256 _campaign_end_time,
        uint256 _start_sell_time,
        string memory _abstraction
    ) public  {
        address payable campaign_address =
            address(
                new Campaign(
                    _link,
                    // msg.sender,
                    _campaign_name,
                    _levels,
                    _seats,
                    _price,
                    _campaign_start_time,
                    _campaign_end_time,
                    _start_sell_time,
                    _abstraction
                )
            );
        Campaign(campaign_address).setOwner(msg.sender);
        campaigns.push(server_campaign(campaign_address, true));
        Users users = Users(users_address);
        users.addCampaign(address(msg.sender), campaign_address);
        string memory message = "success";
        emit OnAddCampaign(message);
    }

    function viewCampaign(address payable campaign_address)
        public
        view
        returns (
            // string memory link,
            uint256[] memory seats,
            string memory campaign_name,
            uint256[] memory price,
            uint256 campaign_start_time,
            uint256 campaign_end_time,
            uint256 start_sell_time,
            string memory abstraction,
            uint256[] memory remain
        )
    {
        Campaign currentCampaign = Campaign(campaign_address);
        campaign_name = currentCampaign.campaign_name();
        seats = currentCampaign.getSeats();
        price = currentCampaign.getPrice();
        campaign_start_time = currentCampaign.campaign_start_time();
        campaign_end_time = currentCampaign.campaign_end_time();
        start_sell_time = currentCampaign.start_sell_time();
        abstraction = currentCampaign.abstraction();
        remain = currentCampaign.getRemain();
        // link = currentCampaign.link();
        
    }

    function viewCampaign2(address payable campaign_address) 
        public view 
        returns(string memory link)
    {
        link = Campaign(campaign_address).link();
    }

    function getUserTickets()
        public
        view
        returns (address[] memory , uint256[] memory , uint256[] memory)
    {
        Users users = Users(users_address);
        return users.ViewTickets(address(msg.sender));
    }

    function getUserCampaigns()
        public
        view
        returns (address[] memory u_campaigns)
    {
        Users users = Users(users_address);
        return users.ViewCampaigns(address(msg.sender));
    }

    function getCampaigns() public view returns (address[] memory ) {
        uint256 num = 0;
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].isvalid) {
                if (
                    Campaign(campaigns[i].campaign).campaign_end_time() >
                    block.timestamp
                ) {
                    num++;
                }
            }
        }
        address [] memory c = new address [](num);
        uint256 j = 0;
        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaigns[i].isvalid) {
                if (
                    Campaign(campaigns[i].campaign).campaign_end_time() >
                    block.timestamp
                ) {
                    c[j] = address(campaigns[i].campaign);
                    j++;
                }
            }
        }
        return c;
    }

    function buyTicket(address payable campaign_address, uint256 amount, uint256 level) public payable  {
        uint256[] memory seat_num;
        string memory message;
        Users users = Users(users_address);
        Campaign c = Campaign(campaign_address);
        if (c.remain(level) >= amount) {
            seat_num = c.buy{value: msg.value}(address(msg.sender), amount, level);
        } else {
            message = "fail";
            emit OnBuyTicket(message);
        }
        for (uint256 i = 0; i < seat_num.length; i++) {
            users.addTicket(address(msg.sender), campaign_address, seat_num[i], level);
        }
        message = "success";
        emit OnBuyTicket(message);
    }

    function withdraw(address payable campaign_address) public {
        Campaign(campaign_address).withdraw(msg.sender); 
    }

    function completeTicket(address payable campaign_address, uint256 level, uint256 seat_num) public {
        Users(users_address).CompleteTicket(msg.sender, campaign_address, level, seat_num);
    }

    function refund(address payable campaign_address, uint256 level, uint256 seat_num) public {
        Campaign(campaign_address).refund(msg.sender, level, seat_num); 
        Users(users_address).RefundTicket(msg.sender, campaign_address, level, seat_num);
    }

    receive() external payable {}
}

pragma solidity >=0.7.0;

contract Users {
    event OnAddCampaign(address capmaign_addr, uint256 Id);
    event OnAddTicket(address attend_addr, uint256 Id);
    event OnCompleteCampaign(address capmaign_addr, uint256 Id);
    event OnCompleteTicket(string message);
    event OnRefundTicket(string message);

    mapping (address => User) addr_to_U;
    mapping (address => bool) usr_addr_valid;

    struct User {
        address user_addr;
        uint256 amount_tickets;
        uint256 amount_campaigns;
        OwnTicket[] tickets;
        OwnCampaign[] campaigns;
        mapping(address => uint256) campaign_addr_to_id;
        mapping(address => uint256) ticket_addr_to_id;
    }
    struct OwnTicket {
        address attend_address;
        uint256 seat;
        uint256 level;
        bool isValid;
        bool isEnd;
    }
     struct OwnCampaign {
        address payable campaign_address;
        bool isValid;
        bool isEnd;
    }

    /*
    require(msg.sender == server); may be changed
    only server has the right to access user.sol
    */
    modifier isUserValid() {
        require(usr_addr_valid[msg.sender], "This user does not exist");
        _;
    }

    modifier isOwner(address user_addr) {
        require(msg.sender == user_addr);
        _;
    }

    modifier isValidSignup(address user_addr) {
    require(usr_addr_valid[user_addr], "Already exists");
    _;
    }

    function isValidCampaign(address user, uint256 _campaignId) 
        public 
        view 
        returns(bool)
    {
        return addr_to_U[user].campaigns[_campaignId].isValid;
    }

    function isValidTicket(address user, uint256 _ticketId) 
        public 
        view 
        returns(bool)      
    {
        return addr_to_U[user].tickets[_ticketId].isValid;
    }

    function addUser(address user_addr)
        public
        // isValidSignup(msg.sender)
    {
        User storage user = addr_to_U[user_addr];
        user.user_addr = user_addr;
        user.amount_tickets = 0;
        user.amount_campaigns = 0;

        usr_addr_valid[user_addr] = true;
    }
    
    function addCampaign(address user, address payable _campaign_address) 
        public 
    {
        if (!usr_addr_valid[user]){
            addUser(user);
        }
        OwnCampaign memory campaign =
            OwnCampaign(_campaign_address, true, false);
        addr_to_U[user].campaigns.push(campaign);
        addr_to_U[user].amount_campaigns += 1;
        uint256 Id = addr_to_U[user].amount_campaigns - 1;

        emit OnAddCampaign(_campaign_address, Id);
    }

    // if more than one ticket is bought for a single campaign, just call iot several times
    function addTicket(address user, address payable _ticket_address, uint256 seat, uint256 level) 
        public 
    {
        if (!usr_addr_valid[user]){
            addUser(user);
        }
        OwnTicket memory ticket =
            OwnTicket(_ticket_address, seat, level, true, false);
        addr_to_U[user].tickets.push(ticket);
        addr_to_U[user].amount_tickets += 1;
        uint256 Id = addr_to_U[user].amount_tickets - 1;

        emit OnAddTicket(_ticket_address, Id);
    }

    function ViewCampaigns(address user) 
        public 
        view 
        // isUserValid(user_addr)
        returns (address[] memory)
    {
        if (!usr_addr_valid[user]){
            address[] memory tmp = new address[](0);
            return tmp;
        }
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[user].amount_campaigns);
        for (uint256 id = 0; id < addr_to_U[user].amount_campaigns; id++) {
            if (isValidCampaign(user, id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            campaignList[i] = addr_to_U[user].campaigns[count_to_id[i]].campaign_address;
        }
        return campaignList;
    }

    function ViewTickets(address user) 
        public 
        view 
        // isUserValid(user_addr)
        returns (address[] memory, uint256[] memory, uint256[] memory )
    {
        if (!usr_addr_valid[user]){
            address[] memory tmp_a = new address[](0);
            uint256[] memory tmp_l = new uint256[](0);
            uint256[] memory tmp_s = new uint256[](0);
            return (tmp_a, tmp_l, tmp_s);
        }
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[user].amount_tickets);
        for (uint256 id = 0; id < addr_to_U[user].amount_tickets; id++) {
            if (isValidTicket(user, id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory ticketList = new address[](len);
        uint256[] memory ticketLevels = new uint256[](len);
        uint256[] memory ticketSeats = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            ticketList[i] = addr_to_U[user].tickets[count_to_id[i]].attend_address;
            ticketLevels[i] = addr_to_U[user].tickets[count_to_id[i]].level;
            ticketSeats[i] = addr_to_U[user].tickets[count_to_id[i]].seat;
        }
        return (ticketList, ticketLevels, ticketSeats);
    }

    function CompleteCampaign(address user, address _campaign_address) public 
    {
        uint256 _id = addr_to_U[user].campaign_addr_to_id[_campaign_address];
        addr_to_U[user].campaigns[_id].isValid = false;
        addr_to_U[user].campaigns[_id].isEnd = true;
    }

    function CompleteTicket(address user, address _ticket_address, uint256 _level, uint256 _seat_num) public 
    {
        for (uint256 id = 0; id < addr_to_U[user].amount_tickets; id++) {
            if (isValidTicket(user, id)) {
                if (addr_to_U[user].tickets[id].attend_address == _ticket_address &&
                    addr_to_U[user].tickets[id].level == _level &&
                    addr_to_U[user].tickets[id].seat == _seat_num){
                        addr_to_U[user].tickets[id].isValid = false;
                        addr_to_U[user].tickets[id].isEnd = true;
                        emit OnCompleteTicket("success");
                    }
            }
        }
        emit OnCompleteTicket("can't not find campaign");
    }

    function RefundTicket(address user, address _ticket_address, uint256 _level, uint256 _seat_num) public 
    {
        for (uint256 id = 0; id < addr_to_U[user].amount_tickets; id++) {
            if (isValidTicket(user, id)) {
                if (addr_to_U[user].tickets[id].attend_address == _ticket_address &&
                    addr_to_U[user].tickets[id].level == _level &&
                    addr_to_U[user].tickets[id].seat == _seat_num){
                        addr_to_U[user].tickets[id].isValid = false;
                        addr_to_U[user].tickets[id].isEnd = true;
                        emit OnRefundTicket("success");
                    }
            }
        }
        emit OnRefundTicket("can't not find ticket");
    }
}