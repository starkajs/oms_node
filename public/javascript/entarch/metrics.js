$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/entarch/metrics',
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
            field: 'metric_category',
            title: 'Category',
            filterControl: 'input'
        }, {
            field: 'metric_name',
            title: 'Name',
            filterControl: 'input',
            formatter: metricNameFormatter
        }, {
            field: 'unit_of_measure',
            title: 'Unit',
            filterControl: 'input'
        },{
            field: 'formula',
            title: 'Formula',
            filterControl: 'input',
            visible: false
        },{
            field: 'is_key_performance_indicator',
            title: 'KPI',
            halign: 'center',
            align: 'center',
            formatter: kpiFormatter,
            filterControl: 'input'
        },{
            field: 'process',
            title: 'Process',
            filterControl: 'input'
        },{
            field: 'driver_name',
            title: 'Value Driver',
            filterControl: 'input'
        }, {
            field: 'lead_lag',
            title: 'Leading/Lagging',
            filterControl: 'input'
        }]
    });
})

const metricNameFormatter = (value, row) => {
    return `<a href="/entarch/metric/${row.id}">${value}</a>`
}

const kpiFormatter = (value) => {
    if (value == 1) {
        return 'Yes';
    } else {
        return 'No';
    }
}
