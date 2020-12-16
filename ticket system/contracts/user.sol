pragma solidity >=0.7.0;

contract User {

/*
If a campaign is completed. Server will find the host of campaign (user),
call CompleteCampaign(address campaign_address). The address will be removed from
own_campaigns.
Also, traverse all seat_owners of this campaign, for all the seat_owners(user), call CompleteTickets to delete the corresponding campaigns.
*/
    address public owner;
    string public name;
    string private pwd;

    struct OwnCampaigns {
        address campaign_address;
        bool isValid;
        bool isEnd;
    }
    struct OwnTickets {
        address attend_address;
        bool isValid;
        bool isEnd;
    }
    mapping (address => uint) campaign_addr_to_id;
    mapping (address => uint) ticket_addr_to_id;

    OwnCampaigns[] own_campaigns;
    OwnTickets[] own_tickets;


    constructor(string memory _name, string memory _pwd) public {
        owner = msg.sender;
        name = _name;
        pwd = _pwd;
    }

    modifier isValidCampaign(uint _campaignId) {
        require(isCampaignValid(_campaignId), "The campaign is end");
        _;
    }

    modifier isValidTicket(uint _ticketId) {
        require(isCampaignValid(_ticketId), "The campaign is end");
        _;
    }

    function isCampaignValid(uint _campaignId) public view returns(bool isValid) {
        return own_campaigns[_campaignId].isValid;
    }

    function isTicketValid(uint _ticketId) public view returns(bool isValid) {
        return own_campaigns[_ticketId].isValid;
    }

    function view_campaigns() public view returns(address[] memory) {
        uint len = 0;
        uint[] memory count_to_id = new uint[](own_campaigns.length);
        for(uint id = 0; id < own_campaigns.length; id++) {
            if (isCampaignValid(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for(uint i = 0; i < len; i++) {
            campaignList[i] = own_campaigns[count_to_id[i]].campaign_address;
        }
        return campaignList;
    }

    function view_tickets() public view returns(address[] memory) {
        uint len = 0;
        uint[] memory count_to_id = new uint[](own_tickets.length);
        for(uint id = 0; id < own_tickets.length; id++) {
            if (isTicketValid(id)) {
                count_to_id[len] = id;
                len++;
            }
        }
        address[] memory campaignList = new address[](len);
        for(uint i = 0; i < len; i++) {
            campaignList[i] = own_tickets[count_to_id[i]].attend_address;
        }
        return campaignList;
    }

    function CompleteCampaign(address _campaign_address) public {
        uint _id = campaign_addr_to_id[_campaign_address];
        own_campaigns[_id].isValid = false;
        own_campaigns[_id].isEnd = true;
    }

    function CompleteTicket(address _ticket_address) public {
        uint _id = ticket_addr_to_id[_ticket_address];
        own_tickets[_id].isValid = false;
        own_tickets[_id].isEnd = true;
    }
}