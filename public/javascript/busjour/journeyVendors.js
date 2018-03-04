$(function(){
    let href = location.href;
    let $table = $('#vendorsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_vendors/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'vendor_name',
            title: 'Vendor',
            filterControl: 'input',
            formatter: vendorNameFormatter
        }, {
            field: 'status_name',
            title: 'Status',
            filterControl: 'input'
        }]
    });
})

const vendorNameFormatter = (value, row) => {
    return `<a href="/journey/journey_vendor/${row.journey_id}/${row.vendor_id}">${value}</a>`
}
