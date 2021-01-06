pragma solidity >=0.7.0;

// using SafeMath for uint256;
// pragma solidity  >=0.7.0;
// using SafeMath for uint256

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

    constructor(
        string memory _campaign_name,
        uint256 _levels,
        uint256[] memory _seats,
        uint256[] memory _price,
        uint256 _campaign_start_time,
        uint256 _campaign_end_time,
        uint256 _start_sell_time,
        string memory _abstraction
    ) public {
        owner = msg.sender;
        levels = _levels;
        uint256 total_seats = 0;
        for (uint256 i = 0; i < levels; i++) {
            seats.push(_seats[i]);
            price.push(_price[i]);
            total_seats += _seats[i];
            remain.push(_seats[i]);
        }
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

    function getSeats() public view returns(uint256[] memory) {
        return seats;
    } 

    function getPrice() public view returns(uint256[] memory) {
        return price;
    } 

    function buy(uint256 amount, uint256 level)
        public
        payable
        returns (uint256[] memory seat_num)
    {
        uint256 j = 0;
        // uint k=0;
        seat_num = new uint256[](amount);
        for (uint256 i = 0; i < seats[level]; i++) {
            while (j < amount) {
                address temp = seat_owner[i];
                if (temp == address(0x00) && remain[level] >= amount) {
                    seat_owner[i] = msg.sender;
                    msg.sender.transfer(price[level]);
                    remain[level]--;
                    seat_num[j] = i;
                    j++;
                }
            }
        }
    }

    function withdraw() public restricted {
        if (block.timestamp > campaign_end_time) {
            msg.sender.call{value: address(this).balance}("");
        }
    }

    receive() external payable {}
}

contract Server {
    struct server_campaign {
        address payable campaign;
        bool isvalid;
    }

    struct return_campaign {
        address _campaign_address;
        string _campaign_name;
        uint256 _seats;
        uint256 _price;
        uint256 _campaign_start_time;
        uint256 _campaign_end_time;
        uint256 _start_sell_time;
        string _abstraction;
    }
    event OnAddUser(string message, address user_address);
    event OnGetCampaigns(address payable[] campaigns);
    event OnAddCampaign(string message);
    event OnBuyTicket(string message);

    server_campaign[] public campaigns;
    mapping(address => address) private users;
    // mapping(address => return_campaign) public CampaignStruct;
    modifier validUser() {
        require(users[msg.sender] != address(0x0));
        _;
    }

    modifier validSignup() {
        require(users[msg.sender] == address(0x0));
        _;
    }

    function callServer(string memory i) public pure returns (string memory) {
        return (i);
    }

    function addCampaign(
        string memory _campaign_name,
        uint256 _levels,
        uint256[] memory _seats,
        uint256[] memory _price,
        uint256 _campaign_start_time,
        uint256 _campaign_end_time,
        uint256 _start_sell_time,
        string memory _abstraction
    ) public validUser {
        string memory message;
        if (users[msg.sender] != address(0x0)) {
            address payable campaign_address =
                address(
                    new Campaign(
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
            campaigns.push(server_campaign(campaign_address, true));
            User user = User(users[msg.sender]);
            user.addCampaign(campaign_address);
            message = "success";
        } else {
            message = "fail";
        }
        emit OnAddCampaign(message);
    }

    function addUser(string memory _name, string memory _pwd)
        public
        validSignup
    {
        string memory message;
        address user_address;
        if (users[msg.sender] == address(0x0)) {
            user_address = address(new User(_name, _pwd));
            users[msg.sender] = user_address;
            message = "successs";
        } else {
            message = "already exist";
        }
        emit OnAddUser(message, user_address);
    }

    function checkUser(string memory _name, string memory _password)
        public
        view
        validUser
        returns (bool success, address user)
    {
        if (users[msg.sender] != address(0x0)) {
            User currentUser = User(users[msg.sender]);
            string memory name = currentUser.name();
            string memory password = currentUser.getPassword();
            success = (keccak256(abi.encodePacked(name)) ==
                keccak256(abi.encodePacked(_name)) &&
                keccak256(abi.encodePacked(password)) ==
                keccak256(abi.encodePacked(_password)));
            if (success) {
                user = users[msg.sender];
            } else {
                user = address(0);
            }
        }
    }

    function viewCampaign(address payable campaign_address)
        public
        returns (
            uint256[] memory seats,
            string memory campaign_name,
            uint256[] memory price,
            uint256 campaign_start_time,
            uint256 campaign_end_time,
            uint256 start_sell_time,
            string memory abstraction
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
    }

    function getUserTickets()
        public
        view
        validUser
        returns (address[] memory campaigns, uint256[] memory seats)
    {
        if (users[msg.sender] != address(0x0)) {
            User currentUser = User(users[msg.sender]);
            (campaigns, seats) = currentUser.ViewTickets();
        } else {
            campaigns = new address[](0);
            seats = new uint256[](0);
        }
    }

    function getUserCampaigns()
        public
        view
        validUser
        returns (address[] memory campaigns)
    {
        if (users[msg.sender] != address(0x0)) {
            User currentUser = User(users[msg.sender]);
            campaigns = currentUser.ViewCampaigns();
        }
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

    function buyTicket(address payable campaign_address, uint256 amount, uint256 level) public payable validUser {
        uint256[] memory seat_num;
        string memory message;
        if (users[msg.sender] != address(0x0)) {
            User user = User(users[msg.sender]);
            
            Campaign c = Campaign(campaign_address);
            if (c.remain(level) >= amount) {
                seat_num = c.buy(amount, level);
            } else {
                message = "fail";
                emit OnBuyTicket(message);
            }
            for (uint256 i = 0; i < seat_num.length; i++) {
                user.addTicket(campaign_address, seat_num[i]);
            }
            message = "success";
        }
        emit OnBuyTicket(message);
    }

    receive() external payable {}
}

pragma solidity >=0.7.0;

contract User {
    event OnAddCampaign(address user, address capmaign_addr, uint256 Id);
    event OnAddTicket(address user, address attend_addr, uint256 Id);
    event OnCompleteCampaign(address user, address capmaign_addr, uint256 Id);
    event OnCompleteTicket(address user, address attend_addr, uint256 Id);
    /*
If a campaign is completed. Server will find the host of campaign (user),
call CompleteCampaign(address campaign_address). The address will be removed from
own_campaigns.
Also, traverse all seat_owners of this campaign, for all the seat_owners(user), call CompleteTickets to delete the corresponding campaigns.
*/
    address public owner;
    string public name;
    string private pwd;

    struct OwnCampaign {
        address payable campaign_address;
        bool isValid;
        bool isEnd;
    }
    struct OwnTicket {
        address attend_address;
        bool isValid;
        bool isEnd;
        uint256 seat;
    }

    struct Ticket {
        address campaign_address;
        uint256 seat;
    }
    mapping(address => uint256) campaign_addr_to_id;
    mapping(address => uint256) ticket_addr_to_id;

    OwnCampaign[] own_campaigns;
    OwnTicket[] own_tickets;

    constructor(string memory _name, string memory _pwd) public {
        owner = msg.sender;
        name = _name;
        pwd = _pwd;
    }

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    modifier isValidCampaign(uint256 _campaignId) {
        require(isCampaignValid(_campaignId), "The campaign is end");
        _;
    }

    modifier isValidTicket(uint256 _ticketId) {
        require(isCampaignValid(_ticketId), "The campaign is end");
        _;
    }

    function isCampaignValid(uint256 _campaignId)
        public
        view
        returns (bool isValid)
    {
        return own_campaigns[_campaignId].isValid;
    }

    function isTicketValid(uint256 _ticketId)
        public
        view
        returns (bool isValid)
    {
        return own_tickets[_ticketId].isValid;
    }

    function addCampaign(address payable _campaign_address) public {
        OwnCampaign memory campaign =
            OwnCampaign(_campaign_address, true, false);
        own_campaigns.push(campaign);
        uint256 Id = own_campaigns.length - 1;

        emit OnAddCampaign(msg.sender, _campaign_address, Id);
    }

    function addTicket(address _ticket_address, uint256 seatId) public {
        OwnTicket memory ticket =
            OwnTicket(_ticket_address, true, false, seatId);
        own_tickets.push(ticket);
        uint256 Id = own_tickets.length - 1;

        emit OnAddTicket(msg.sender, _ticket_address, Id);
    }

    function getPassword()
        public
        view
        isOwner
        returns (string memory password)
    {
        password = pwd;
    }

    function ViewCampaigns() public view returns (address[] memory) {
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](own_campaigns.length);
        for (uint256 id = 0; id < own_campaigns.length; id++) {
            if (isCampaignValid(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            campaignList[i] = own_campaigns[count_to_id[i]].campaign_address;
        }
        return campaignList;
    }

    function ViewTickets()
        public
        view
        returns (address[] memory campaigns, uint256[] memory seats)
    {
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](own_tickets.length);
        for (uint256 id = 0; id < own_tickets.length; id++) {
            if (isTicketValid(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        campaigns = new address[](len);
        seats = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            campaigns[i] = own_tickets[count_to_id[i]].attend_address;
            seats[i] = own_tickets[count_to_id[i]].seat;
        }
    }

    function CompleteCampaign(address _campaign_address) public {
        uint256 _id = campaign_addr_to_id[_campaign_address];
        own_campaigns[_id].isValid = false;
        own_campaigns[_id].isEnd = true;
    }

    function CompleteTicket(address _ticket_address) public {
        uint256 _id = ticket_addr_to_id[_ticket_address];
        own_tickets[_id].isValid = false;
        own_tickets[_id].isEnd = true;
    }
}
