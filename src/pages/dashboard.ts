import * as d from "../util/document.js"
import * as c from "../util/conversions.js"

import { show as MyAccountPage_show } from "./my-account.js"

import { wallet } from "../wallet-api/wallet.js"
import { divPool } from "../contracts/div-pool.js"
import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from "constants"

async function dashboardRefresh() {

  try {
    d.showWait()
    d.hideErr()

    //let contractInfo = await divPool.get_contract_info()
    let contractState = await divPool.get_contract_state()

    let dashboardInfo = 
    {
      location: divPool.contractAccount,
      total: c.toStringDec(c.yton(contractState.total_available) + c.yton(contractState.total_for_staking) + c.yton(contractState.total_for_unstaking)),
      historicRewards: c.toStringDec(c.yton(contractState.accumulated_staked_rewards)),
      skash: c.ytonString(contractState.total_for_staking),
      nslp_liquidity: c.ytonString(contractState.nslp_liquidity),
      nslp_current_discount: contractState.nslp_current_discount_basis_points/100,
      timeToRewardsString: "7hs 45min",
      numberOfPools: contractState.staking_pools_count,
      numberOfAccounts: contractState.accounts_count,
    }
    //show dashboard info
    d.applyTemplate("dashboard", "dashboard-template", dashboardInfo)

    document.querySelectorAll("#dashboard .number").forEach(el => {
      if (el instanceof HTMLDivElement) {
        el.innerText = el.innerText.replace(".00", "")
      }
    })
    d.showPage("dashboard-page")
  }
  catch (ex) {
    d.showErr(ex.message)
  }
  finally {
    d.hideWait()
  }
}

//--------------------------
export async function show() {

  d.onClickId("refresh-dashboard", dashboardRefresh);
  d.onClickId("enter-my-account", myAccountClicked);
  
  dashboardRefresh()

}

//---------------------------------------------------
//-- account item clicked => account selected Page --
//---------------------------------------------------
async function myAccountClicked(ev: Event) {
  try {
    wallet.checkConnected()
    MyAccountPage_show()
  }
  catch (ex) {
    d.showErr(ex.message);
  }
}


