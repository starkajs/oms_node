$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/modules',
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
            field: 'delete',
            title: 'Delete',
            formatter: moduleDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'module_name',
            title: 'Name',
            filterControl: 'input',
            formatter: moduleNameFormatter,
            sortable: true
        }, {
            field: 'module_description',
            title: 'Description',
            filterControl: 'input'
        }, {
            field: 'system_count',
            title: 'Systems',
            sortable: true,
            halign: 'center',
            align: 'center'
        }]
    });
})


const moduleNameFormatter = function(value, row){
    return '<a href="/syssel/module/' + row.id + '">' + value + '</a>';
};

const moduleDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_module/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
