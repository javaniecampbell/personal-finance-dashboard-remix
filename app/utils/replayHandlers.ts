// app/utils/replayHandlers.js
export const handleDepositReplay = (event, updateBalance) => {
    updateBalance(prevBalance => prevBalance + event.amount);
  };
  
  export const handleWithdrawalReplay = (event, updateBalance) => {
    updateBalance(prevBalance => prevBalance - event.amount);
  };
  
  export const handleBudgetAdjustmentReplay = (event, updateBudget) => {
    updateBudget(event.categoryId, event.newAmount);
  };
  
  export const handleBillPaymentReplay = (event, updateBalance, updateBillStatus) => {
    updateBalance(prevBalance => prevBalance - event.amount);
    updateBillStatus(event.billId, 'paid');
  };    