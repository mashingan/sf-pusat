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

module.exports.performanceData = performanceData;
