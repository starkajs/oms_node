$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/entarch/capabilities',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'short_code',
            title: 'Code',
            filterControl: 'input'
        }, {
            field: 'capability_name',
            title: 'Name',
            filterControl: 'input',
            formatter: capabilityNameFormatter
        }, {
            field: 'capability_description',
            title: 'Description'
        },{
            field: 'process_count',
            title: 'Processes',
            halign: 'center',
            align: 'center'
        },{
            field: 'metric_count',
            title: 'Metrics',
            halign: 'center',
            align: 'center'
        },{
            field: 'requirement_count',
            title: 'Requirements',
            halign: 'center',
            align: 'center'
        }]
    });
})

const capabilityNameFormatter = (value, row) => {
    return `<a href="/entarch/capability/${row.id}">${value}</a>`
}
