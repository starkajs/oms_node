$(function(){
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/entarch/capability_processes/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'process_level',
            title: 'Level',
            filterControl: 'input'
        }, {
            field: 'process_short_code',
            title: 'Short Code',
            filterControl: 'input',
            visible: false
        }, {
            field: 'process',
            title: 'Process',
            filterControl: 'input',
            formatter: processNameFormatter
        },{
            field: 'metric_count',
            title: 'Metrics',
            halign: 'center',
            align: 'center'
        }, {
            field: 'requirement_count',
            title: 'Requirements',
            halign: 'center',
            align: 'center'
        }]
    });
})

const processNameFormatter = (value, row) => {
    return `<a href="/entarch/process/${row.id}">${value}</a>`
}
