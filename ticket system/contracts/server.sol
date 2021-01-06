pragma solidity >=0.7.0;
import "./user.sol";
import "./campaign.sol";
// using SafeMath for uint256

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
        returns (address[] memory u_campaigns, uint256[] memory seats)
    {
        if (users[msg.sender] != address(0x0)) {
            User currentUser = User(users[msg.sender]);
            (u_campaigns, seats) = currentUser.ViewTickets();
        } else {
            u_campaigns = new address[](0);
            seats = new uint256[](0);
        }
    }

    function getUserCampaigns()
        public
        view
        validUser
        returns (address[] memory u_campaigns)
    {
        if (users[msg.sender] != address(0x0)) {
            User currentUser = User(users[msg.sender]);
            u_campaigns = currentUser.ViewCampaigns();
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
