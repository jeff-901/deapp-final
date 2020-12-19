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
        address campaign_address;
        bool isValid;
        bool isEnd;
    }
    struct OwnTicket {
        address attend_address;
        bool isValid;
        bool isEnd;
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
        return own_campaigns[_ticketId].isValid;
    }

    function addCampaign(address _campaign_address) public {
        OwnCampaign memory campaign = OwnCampaign(
            _campaign_address,
            true,
            false
        );
        own_campaigns.push(campaign);
        uint256 Id = own_campaigns.length - 1;

        emit OnAddCampaign(msg.sender, _campaign_address, Id);
    }

    function getPassword() public isOwner returns (string memory password) {
        password = pwd;
    }

    function addTicket(address _ticket_address, uint256 seatId) public {
        OwnTicket memory ticket = OwnTicket(
            _ticket_address,
            true,
            false,
            seatId
        );
        own_tickets.push(ticket);
        uint256 Id = own_tickets.length - 1;

        emit OnAddTicket(msg.sender, _ticket_address, Id);
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

    function ViewTickets() public view returns (address[] memory) {
        uint256 len = 0;
        uint256[] memory count_to_id = new uint256[](own_tickets.length);
        for (uint256 id = 0; id < own_tickets.length; id++) {
            if (isTicketValid(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for (uint256 i = 0; i < len; i++) {
            campaignList[i] = own_tickets[count_to_id[i]].attend_address;
        }
        return campaignList;
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
