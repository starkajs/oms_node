$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/features',
        pagination: true,
        sidePagination: 'server',
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
        }, {
            field: 'feature_name',
            title: 'Name',
            filterControl: 'input',
            formatter: featureNameFormatter
        }, {
            field: 'feature_description',
            title: 'Description'
        }]
    });
})


const featureNameFormatter = function(value, row){
    return '<a href="/syssel/feature/' + row.id + '">' + value + '</a>';
};
