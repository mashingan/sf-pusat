var performanceData = {};
performanceData.header = [{
  name: 'date',
  label: 'Date'
}, {
  name: 'gallery',
  label: 'Gallery Name'
}, {
  name: 'name',
  label: 'Staff Name'
}, {
  name: 'login',
  label: 'First Login'
}, {
  name: 'logout',
  label: 'Last Logout'
}, {
  name: 'totalLogout',
  label: 'Total Logout'
}, {
  name: 'totalLogoutTime',
  label: 'Total Logout Time'
}, {
  name: 'averageLogoutTime',
  label: 'Average Logout Time'
}, {
  name: 'totalServed',
  label: 'Total Served'
}, {
  name: 'noShow',
  label: 'No Show'
}, {
  name: 'totalTransaction',
  label: 'Total Transaction'
}, {
  name: 'totalTransactionTime',
  label: 'Total Transaction Time'
}, {
  name: 'averageHandlingTime',
  label: 'Average Handling Time'
}, {
  name: 'totalBreaktime',
  label: 'Total Breaktime'
}, {
  name: 'idleTime',
  label: 'Idle Time'
}, {
  name: 'idleTimePercentage',
  label: '% (idle)'
}];

var transactionData = {};
transactionData.header = [{
  name: 'date',
  label: 'Date'
}, {
  name: 'nik',
  label: 'User ID'
}, {
  name: 'name',
  label: 'User Name',
}, {
  name: 'gallery',
  label: 'Gallery'
}, {
  name: 'region',
  label: 'Region'
}, {
  name: 'service',
  label: 'Group Antrian'
}, {
  name: 'ticketNumber',
  label: 'Ticket Number'
}, {
  name: 'mdn',
  label: 'MDN'
}, {
  name: 'printedAt',
  label: 'Ticket Printed at'
}, {
  name: 'calledAt',
  label: 'Ticket Called at'
}, {
  name: 'closedAt',
  label: 'Ticket Closed at'
}, {
  name: 'waitingTime',
  label: 'Waiting Time'
}, {
  name: 'handlingTime',
  label: 'Handling Time'
}, {
  name: 'totalTime',
  label: 'Customer Time'
}, {
  name: 'taggingCode',
  label: 'Tagging Code'
}, {
  name: 'tagLevel1',
  label: 'Transaction Level 1'
}, {
  name: 'tagLevel2',
  label: 'Transaction Level 2'
}, {
  name: 'tagLevel3',
  label: 'Transaction Level 3'
}, {
  name: 'tagLevel4',
  label: 'Transaction Level 4'
}];


module.exports.performanceData = performanceData;
module.exports.transactionData = transactionData;
