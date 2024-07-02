const { VoucherifyServerSide } = require('@voucherify/sdk')


const voucherifyClient = VoucherifyServerSide({
    applicationId: '989ea871-8bf0-4249-8d13-d30c49222af5',
    secretKey: '59db9b65-fc2c-4431-8185-2ba71ab3fd1f',
    apiUrl: 'https://as1.api.voucherify.io', 
})
module.exports = { voucherifyClient}