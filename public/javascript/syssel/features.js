$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/features',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete_feature',
            title: 'Delete',
            formatter: featureDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'feature_name',
            title: 'Name',
            filterControl: 'input',
            formatter: featureNameFormatter,
            sortable: true
        }, {
            field: 'feature_description',
            title: 'Description',
            filterControl: 'input'
        }, {
            field: 'system_count',
            title: 'Systems',
            halign: 'center',
            align: 'center',
            sortable: true
        }]
    });
})


const featureNameFormatter = function(value, row){
    return '<a href="/syssel/feature/' + row.id + '">' + value + '</a>';
};

const featureDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_feature/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
