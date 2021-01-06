pragma solidity >=0.7.0;

contract Users {
    event OnAddCampaign(address user, address capmaign_addr, uint256 Id);
    event OnAddTicket(address user, address attend_addr, uint256 Id);
    event OnCompleteCampaign(address user, address capmaign_addr, uint256 Id);
    event OnCompleteTicket(address user, address attend_addr, uint256 Id);

    address public server;

    mapping (address => User) addr_to_U;
    mapping (address => bool) usr_addr_valid;

    struct User {
        address user_addr;
        string name;
        string pwd;
        uint256 private amount_tickets;
        uint256 private amount_campaigns;
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

    constructor() public {
        // Contract "Users" is initialized via "Server"
        server = msg.sender;
    }

    /*
    require(msg.sender == server); may be changed
    only server has the right to access user.sol
    */
    modifier isUserValid(address user_addr) {
        require(usr_addr_valid[user_addr], "This user does not exist");
        _;
    }

    modifier isvalidSignup(address user_addr) {
        require(usr_addr_valid[user_addr], "Already exists");
        _;
    }

    modifier isServer() {
        require(msg.sender == server);
        _;
    }

    modifier isOwner(address user_addr) {
        require(msg.sender == user_addr);
        _;
    }

    function isValidCampaign(address user_addr, uint256 _campaignId) 
        public 
        view 
        returns(bool)
    {
        return addr_to_U[user_addr].campaigns[_campaignId].isValid;
    }

    modifier isValidTicket(address user_addr, uint256 _ticketId) 
        public 
        view 
        returns(bool)      
    {
        return addr_to_U[user_addr].tickets[_ticketId].isValid;
    }

    function addUser(address user_addr, string memory _name, string momory _pwd)
        public
        isValidSignup(user_addr)
    {
        User storage user;
        user.user_addr = user_addr;
        user.pwd = pwd;
        user.amount_tickets = 0;
        user.amount_campaigns = 0;
        addr_to_U[user_addr] = user;

        usr_addr_valid[user_addr] = true;
    }
    
    function addCampaign(address user_addr, address payable _campaign_address) 
        public 
        isServer()
        isUserValid(user_addr)
    {
        OwnCampaign memory campaign =
            OwnCampaign(_campaign_address, true, false);
        addr_to_U[user_addr].campaigns.push(campaign);
        addr_to_U[user_addr].amount_campaigns += 1;
        uint256 Id = addr_to_U[user_addr].amount_campaigns - 1;

        emit OnAddCampaign(user_addr, _campaign_address, Id);
    }

    // if more than one ticket is bought for a single campaign, just call iot several times
    function addTicket(address user_addr, address payable _ticket_address, uint256 seat, uint256 level) 
        public 
        isServer()
        isUserValid(user_addr)
    {
        OwnTicket memory ticket =
            OwnTicket(_ticket_address, seat, level, true, false);
        addr_to_U[user_addr].tickets.push(ticket);
        addr_to_U[user_addr].amount_tickets += 1;
        uint256 Id = addr_to_U[user_addr].amount_tickets - 1;

        emit OnAddTicket(user_addr, _ticket_address, Id);
    }

    function getPassword(address user_addr)
        public
        view
        isServer()
        isUserValid(user_addr)
        returns (string memory)
    {
        password = pwd;
    }

    function ViewCampaigns(address user_addr) 
        public 
        view 
        isUserValid(user_addr)
        returns (address[] memory)
    {
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[user_addr].amount_campaigns);
        uint 
        for (uint256 id = 0; id < addr_to_U[user_addr].amount_campaigns; id++) {
            if (isValidCampaign(user_addr, id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            campaignList[i] = addr_to_U[user_addr].campaigns[count_to_id[i]].campaign_address;
        }
        return campaignList;
    }

    function ViewTickets(address user_addr) 
        public 
        view 
        isUserValid(user_addr)
        returns (address[] memory)
    {
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](addr_to_U[user_addr].amount_tickets);
        for (uint256 id = 0; id < addr_to_U[user_addr].amount_tickets; id++) {
            if (isValidTicket(user_addr, id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory ticketList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            ticketList[i] = addr_to_U[user_addr].tickets[count_to_id[i]].attend_address;
        }
        return ticketList;
    }

    function CompleteCampagin(address user_addr, address _campaign_address) public isServer()
    {
        uint256 _id = addr_to_U[user_addr].campaign_addr_to_id[_campaign_address];
        addr_to_U[user_addr].campaigns[_id].isValid = false;
        addr_to_U[user_addr].campaigns[_id].isEnd = true;
    }

    function CompleteTicket(address user_addr, address _ticket_address) public isServer()
    {
        uint256 _id = addr_to_U[user_addr].ticket_addr_to_id[_ticket_address];
        addr_to_U[user_addr].tickets[_id].isValid = false;
        addr_to_U[user_addr].tickets[_id].isEnd = true;
    }
}