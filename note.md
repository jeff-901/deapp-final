# 售票系統 Contracts

### NOTE
**usage**
```bash
truffle build
truffle migrate
truffle deploy
truffle console

Server.deployed().then(function(instance){return instance.getCampaigns()})
```
**concept**
- safemath : avoid problems caused by overflow
- emit : necessary when interacting with web3.js
- event
    那什麼時候會需要用到event呢？
    - 當作一個額外的儲存空間。event寫入的成本和用合約變數來儲存的成本相比之下少了很多，如果你開發的dapp需要將使用者的使用紀錄(如付款紀錄)等記錄下來當作證明，與其用一個陣列儲存，不如在每次使用時用event寫進log裡。但要注意的是，這些寫進log裡的資料是沒辦法被合約所存取的。
    - 做出 transaction 時，函式不會傳回任何你函式執行的結果，而是回傳你這筆transaction的hash值，所以這時候你需要使用event來將回傳值記錄起來
    - 最後便是當你開發dapp的時候，藉由觸發event寫入log，再觸發監聽器執行對應動作，如此完成從 外界->鏈->鏈->外界
    