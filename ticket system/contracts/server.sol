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
            if (j < amount) {
                address temp = seat_owner[i];
                if (temp == address(0x00) && remain[level] >= amount) {
                    seat_owner[i] = msg.sender;
                    // address(this).call{value: price[level]}("");
                    address(this).transfer(price[level] ether);
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
    address public users_address;

    constructor() public{
        users_address = address(new Users());
    }
    // mapping(address => address) private users;
    // mapping(address => return_campaign) public CampaignStruct;
    // modifier validUser() {
    //     require(users[msg.sender] != address(0x0));
    //     _;
    // }

    // modifier validSignup() {
    //     require(users[msg.sender] == address(0x0));
    //     _;
    // }

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
    ) public  {
        string memory message;
        
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
        Users users = Users(users_address);
        users.addCampaign(campaign_address);
        message = "success";

        emit OnAddCampaign(message);
    }

    // function addUser(string memory _name, string memory _pwd)
    //     public
    // {
    //     string memory message;
    //     address user_address;
    //     if (users[msg.sender] == address(0x0)) {
    //         user_address = address(new User(_name, _pwd));
    //         users[msg.sender] = user_address;
    //         message = "successs";
    //     } else {
    //         message = "already exist";
    //     }
    //     emit OnAddUser(message, user_address);
    // }

    // function checkUser(string memory _name, string memory _password)
    //     public
    //     view
        
    //     returns (bool success, address user)
    // {
    //     if (users[msg.sender] != address(0x0)) {
    //         User currentUser = User(users[msg.sender]);
    //         string memory name = currentUser.name();
    //         string memory password = currentUser.getPassword();
    //         success = (keccak256(abi.encodePacked(name)) ==
    //             keccak256(abi.encodePacked(_name)) &&
    //             keccak256(abi.encodePacked(password)) ==
    //             keccak256(abi.encodePacked(_password)));
    //         if (success) {
    //             user = users[msg.sender];
    //         } else {
    //             user = address(0);
    //         }
    //     }
    // }

    function viewCampaign(address payable campaign_address)
        public
        view
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
        
        returns (address[] memory , uint256[] memory , uint256[] memory)
    {
        Users users = Users(users_address);
        return users.ViewTickets();
        // if (users[msg.sender] != address(0x0)) {
        //     User currentUser = User(users[msg.sender]);
        //     (u_campaigns, seats) = currentUser.ViewTickets();
        // } else {
        //     u_campaigns = new address[](0);
        //     seats = new uint256[](0);
        // }
    }

    function getUserCampaigns()
        public
        view
        
        returns (address[] memory u_campaigns)
    {
        Users users = Users(users_address);
        return users.ViewCampaigns();
        // if (users[msg.sender] != address(0x0)) {
        //     User currentUser = User(users[msg.sender]);
        //     u_campaigns = currentUser.ViewCampaigns();
        // }
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
            seat_num = c.buy(amount, level);
        } else {
            message = "fail";
            emit OnBuyTicket(message);
        }
        for (uint256 i = 0; i < seat_num.length; i++) {
            users.addTicket(campaign_address, seat_num[i], level);
        }
        message = "success";
        
        emit OnBuyTicket(message);
    }

    receive() external payable {}
}

pragma solidity >=0.7.0;

contract Users {
    event OnAddCampaign(address capmaign_addr, uint256 Id);
    event OnAddTicket(address attend_addr, uint256 Id);
    event OnCompleteCampaign(address capmaign_addr, uint256 Id);
    event OnCompleteTicket(address attend_addr, uint256 Id);

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

    function isValidCampaign(uint256 _campaignId) 
        public 
        view 
        returns(bool)
    {
        return addr_to_U[msg.sender].campaigns[_campaignId].isValid;
    }

    function isValidTicket(uint256 _ticketId) 
        public 
        view 
        returns(bool)      
    {
        return addr_to_U[msg.sender].tickets[_ticketId].isValid;
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
    
    function addCampaign(address payable _campaign_address) 
        public 
    {
        if (!usr_addr_valid[msg.sender]){
            addUser(msg.sender);
        }
        OwnCampaign memory campaign =
            OwnCampaign(_campaign_address, true, false);
        addr_to_U[msg.sender].campaigns.push(campaign);
        addr_to_U[msg.sender].amount_campaigns += 1;
        uint256 Id = addr_to_U[msg.sender].amount_campaigns - 1;

        emit OnAddCampaign(_campaign_address, Id);
    }

    // if more than one ticket is bought for a single campaign, just call iot several times
    function addTicket(address payable _ticket_address, uint256 seat, uint256 level) 
        public 
    {
        if (!usr_addr_valid[msg.sender]){
            addUser(msg.sender);
        }
        OwnTicket memory ticket =
            OwnTicket(_ticket_address, seat, level, true, false);
        addr_to_U[msg.sender].tickets.push(ticket);
        addr_to_U[msg.sender].amount_tickets += 1;
        uint256 Id = addr_to_U[msg.sender].amount_tickets - 1;

        emit OnAddTicket(_ticket_address, Id);
    }

    // function getPassword(address user_addr)
    //     public
    //     view
    //     isServer()
    //     isUserValid(user_addr)
    //     returns (string memory)
    // {
    //     return addr_to_U[user_addr].pwd;
    // }

    function ViewCampaigns() 
        public 
        view 
        // isUserValid(user_addr)
        returns (address[] memory)
    {
        if (!usr_addr_valid[msg.sender]){
            address[] memory tmp = new address[](0);
            return tmp;
        }
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[msg.sender].amount_campaigns);
        for (uint256 id = 0; id < addr_to_U[msg.sender].amount_campaigns; id++) {
            if (isValidCampaign(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            campaignList[i] = addr_to_U[msg.sender].campaigns[count_to_id[i]].campaign_address;
        }
        return campaignList;
    }

    function ViewTickets() 
        public 
        view 
        // isUserValid(user_addr)
        returns (address[] memory, uint256[] memory, uint256[] memory )
    {
        if (!usr_addr_valid[msg.sender]){
            address[] memory tmp_a = new address[](0);
            uint256[] memory tmp_l = new uint256[](0);
            uint256[] memory tmp_s = new uint256[](0);
            return (tmp_a, tmp_l, tmp_s);
        }
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[msg.sender].amount_tickets);
        for (uint256 id = 0; id < addr_to_U[msg.sender].amount_tickets; id++) {
            if (isValidTicket(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory ticketList = new address[](len);
        uint256[] memory ticketLevels = new uint256[](len);
        uint256[] memory ticketSeats = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            ticketList[i] = addr_to_U[msg.sender].tickets[count_to_id[i]].attend_address;
            ticketLevels[i] = addr_to_U[msg.sender].tickets[count_to_id[i]].level;
            ticketSeats[i] = addr_to_U[msg.sender].tickets[count_to_id[i]].seat;
        }
        return (ticketList, ticketLevels, ticketSeats);
    }

    function CompleteCampagin(address _campaign_address) public 
    {
        uint256 _id = addr_to_U[msg.sender].campaign_addr_to_id[_campaign_address];
        addr_to_U[msg.sender].campaigns[_id].isValid = false;
        addr_to_U[msg.sender].campaigns[_id].isEnd = true;
    }

    function CompleteTicket(address _ticket_address) public 
    {
        uint256 _id = addr_to_U[msg.sender].ticket_addr_to_id[_ticket_address];
        addr_to_U[msg.sender].tickets[_id].isValid = false;
        addr_to_U[msg.sender].tickets[_id].isEnd = true;
    }
}