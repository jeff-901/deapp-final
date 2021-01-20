# Decentralized Platform for Holding Events and Buying tickets

## 109-1 Network & Multimedia Lab Final Project

### Motivation

It is a decentralized online event ticket platform providing integrated service from event holding, advocation to ticket selling.

+ Target at students or small groups to share their knowledge or skills
+ Provide a good opportunity for young artists to show themself
+ 

### To Start

```shell
cd ticket\ system/website/
yarn
yarn start
```

Then open localhost:3000

### Requirement

- solidity: >0.7.0
- truffle: >5.1.57
- @truffle/hdwallet-provider: >1.2.0

complete content of all the requirement are in these two file under directory "**ticket system**"  
**package.json**  
**package-lock.json**

### Usage

3 functions in main page (no need to login in, since you have unique Ethereum account).

- **Creating**: 
Create a new campaign, you can specify how many levels of tickets, amount of seats for each level, starting time, ending time, and abstraction. After pressing "**Create Now!**" button, metamask will ask for some fee, and the whole transaction will last few to dozens of second depending on the gas you give to miner and how many users are on the bolckchain.
After finidhing the transaction, you should see the created campaign when you enter **Checking** page, and **can be seen by all the other users** 

- **Booking**:
List all available campaigns, if campaigns is expired, it will not be listed on the page, clicked **BOOT IT!** on the bottom left of any campaign you desire, press "**Confirm Buy**" Then you can book the ticket, remember that some tip (gas) is needed for miners, cost about 0.001 Ethereums, 1 US dollars.

- **Checking**:
Here you can check all of tickets you bought, and campaigns you host. Those campaigns you didn't take over will not show on this page. Clicking "**CHECK IT!**" on "**Ticket**" will allow you to **refund ticket**, some tip is needed for miners to modify contracts. In addition, clicking "**CHECK IT!**" on "**Campaigns**" allows you to **take money** if someone else have bought ticket from your campaigns.

![](https://i.imgur.com/v06V97h.png)

### Future Work
Two directrions of improvments are considered, one is speed, another is fairness. The fromer was constrained by the transaction speed of Ethereum. Transaction speed on blockchain still could not bear other means of payment like VISA. While the other part is arised from that user can give various gas to miners, so if an user is more willing to pay more tips, than he has higher probablity to successfully buy hot tickets. However, since we target at niche market, this may not be a big problem by far. 

### Architecture

#### Backend

+ Smart contract based on solidity Frontend
+ JavaScript

#### Interface

+ Web3.js, a JavaScript API allowing websites to interact with remote Ethereum nodes

#### Testing Network - Ropsten

+ Can be accessed by everyone on network
+ Able to simulate the speed of transactions on real Ethereum

#### Structure

![](https://i.imgur.com/2Zm1Km5.png)