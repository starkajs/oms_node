$(function(){
    let href = location.href;
    let $table = $('#solutionsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_solutions/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'system_id',
            title: 'ID',
            visible: false
        },{
            field: 'system_name',
            title: 'Solution',
            filterControl: 'input',
            formatter: solutionNameFormatter
        }]
    });
})

const solutionNameFormatter = (value, row) => {
    return `<a href="/journey/solution/${row.system_id}">${value}</a>`
}
